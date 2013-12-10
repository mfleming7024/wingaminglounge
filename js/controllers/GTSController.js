wingaming.controller('GTS', ['$scope', '$routeParams', '$location', 'angularFireCollection', 'angularFireAuth','angularFire','$timeout', function mtCtrl($scope, $routeParams, $location, angularFireCollection, angularFireAuth,angularFire,$timeout){
    //url to the data needed


    //************************************Active stations database***************************************************

    //url to the data needed
    var urlActiveStations = new Firebase('https://gamerscafe.firebaseio.com/wingaminglounge/activeStations');

    var wrapper = function () {
        updateTimer();
        $timeout(wrapper, 10000);
    }

    //updates the display's countdown timer for the active gts
    var updateTimer = function(){
        //runs a loop for each station on the active stations database
        for (var i = $scope.activeStations.length - 1; i >= 0; i--) {
            //checks to see if the timer is 0 and will change the status from nomral to red.
            //sets the minutes to the new time
            var time = new Date().getTime() - $scope.activeStations[i].startTime;
            $scope.activeStations[i].displayTime = parseInt($scope.activeStations[i].countdown - (time/1000/60));

            if($scope.activeStations[i].displayTime <= 0){
                timesUp = true
                $(".timeUp").html($scope.activeStations[i].stationNumber );
                $scope.activeStations[i].displayTime = 0;
            }
        };
    };

    //collects the info from the database for use.
    $scope.activeStations = angularFireCollection(urlActiveStations,function()
    {
        //starts the clocks
        var startKillWatch = $scope.$watch('activeStations', function(){
            $timeout(wrapper);
            startKillWatch();
        })
    });

    //checks to make sure that the routes parameters are set the sets the tempstation for use.
    if(typeof $routeParams !== "undefined"){
        if(typeof $routeParams.stationId !== "undefined"){
            $scope.tempStation = {};
            angularFire(urlActiveStations.child($routeParams.stationId),$scope,'tempStation');
            $timeout(function (){
                $scope.tempStation.id = $routeParams.stationId
            });
        }
    }

    //create a active station and adds it to the database
    $scope.addActiveStation = function(){

        /*		GRAB FROM SCOPE NOT JAVASCRIPT
$scope.tempStation.stationNumber = document.querySelector("#customDropdown").value;
        $scope.tempStation.boxart = document.querySelector("#games_option").value;
        $scope.tempStation.username = document.querySelector("#username").value;
        $scope.tempStation.countdown = document.querySelector("#time_dropdown").value;
        $scope.tempStation.gamerPic = document.querySelector("#gamerPic").value;
*/

        $scope.tempStation.startTime = new Date().getTime()
        $location.path("/admin");

        if(typeof $routeParams.user !== "undefined"){
            if(typeof $routeParams.stationId !== "undefined"){
                $scope.deleteQuedStation($routeParams.stationId);
            }
        }
        console.log("add ActiveStations clicked");
    }
    user_delete_confirmed = false;
    //removes activeStations based on a unique id
    $scope.deleteActiveStation = function(removeStation){
        if (user_delete_confirmed) {
            $scope.tempStation = null;
            $location.path("/admin");
            //ng-animate?
            $("#user_delete_button").css("background", "#2ba6cb").html("Delete");
            user_delete_confirmed = false;
        } else {
            $("#user_delete_button").css("background", "red").html("Are you sure");
            user_delete_confirmed = true;
        }

    }
    
    $scope.cancelActiveStation = function(){
        $scope.tempStation = null;
        $location.path("/admin");
    }

    /*		Switching Queued stations to a list instead
var urlQStation = new Firebase('https://gamerscafe.firebaseio.com/gamerscafe/quedStations');

    //test only info page
    if(typeof $routeParams !== "undefined"){
        if(typeof $routeParams.stationId !== "undefined"){
            //collects the info from the database for use.
            angularFire(urlQStation.child($routeParams.stationId),$scope,'qStation_profile');

        }
    }
*/

    //updates the activeStations database
    $scope.updateActiveStation = function(){
        console.log('urlActiveStations',urlActiveStations)
        if(typeof $scope.activeStations == "undefined"){
            $scope.activeStations = angularFireCollection(urlActiveStations,function(snap){
                var stations = snap.val();
                if(typeof $routeParams !== "undefined"){
                    var stationDropdown = $scope.tempStation.stationNumber = document.querySelector("#customDropdown");
                    $scope.tempStation.stationNumber = stationDropdown.options[stationDropdown.selectedIndex].text;
                    $scope.tempStation.boxart = document.querySelector("#games_option").value;
                    $scope.tempStation.username = document.querySelector("#username").value;
                    $scope.tempStation.countdown = parseFloat($scope.tempStation.countdown) + parseFloat(document.querySelector("#time_dropdown").value);
                    $location.path("/admin");
                }
            })
        }else{
            var stationDropdown = $scope.tempStation.stationNumber = document.querySelector("#customDropdown");
            $scope.tempStation.stationNumber = stationDropdown.options[stationDropdown.selectedIndex].text;
            $scope.tempStation.boxart = document.querySelector("#games_option").value;
            $scope.tempStation.username = document.querySelector("#username").value;
            $scope.tempStation.countdown = parseFloat($scope.tempStation.countdown) + parseFloat(document.querySelector("#time_dropdown").value);
            $location.path("/admin");
        }
    }
    //************************************Queued stations database***************************************************

    //url to the data needed
    var urlQueuedStations = new Firebase('https://gamerscafe.firebaseio.com/gamerscafe/quedStations');

    //collects the info from the database for use.
    $scope.quedStations = angularFireCollection(urlQueuedStations);

    //create a active station and adds it to the database
    $scope.addQuedStation = function(tempuser){

        var hours = new Date().getHours();
        var min =  new Date().getMinutes();
        if(parseInt(min) < 10){
            var time = hours+":0"+min;
        }else{
            var time = hours+":"+min;
        }

        //Switch to scope
        var nameValue = document.querySelector("#getName");
        var getName = nameValue.options[nameValue.selectedIndex].text;

        $scope.gamersPic = tempuser;

        $scope.quedStations.add({username:getName, currentTime:time, gamerPic:tempuser});
        console.log("addQuedStations clicked");
        $location.path("/admin");
    }

    //removes quedStations based on a unique id
    $scope.deleteQuedStation = function(myid){
        $scope.quedStations.remove(myid);
    }

    //updates the quedStations database
    //have fields instead of string literal
    $scope.updateQuedStation = function(station){
        $scope.quedStations.update(station);
    }
    //************************************Empty stations database***************************************************

    //url to the data needed
    var urlEmptyStations = new Firebase('https://gamerscafe.firebaseio.com/gamerscafe/emptyStations');

    //collects the info from the database for use.
    $scope.emptyStations = angularFireCollection(urlEmptyStations);

    //create a active station and adds it to the database
    $scope.addEmptyStation = function(){
        $scope.emptyStations.add({stationNumber: " "});
        console.log("add EmptyStations clicked");
    }

    //removes emptyStations based on a unique id
    $scope.deleteEmptyStation = function(myid){
        $scope.emptyStations.remove(myid);
        console.log("delete EmptyStations clicked");
    }

    //updates the emptyStations database
    //have fields instead of string literal
    $scope.updateEmptyStation = function(station){
        $scope.emptyStations.update(station);
    };

}])