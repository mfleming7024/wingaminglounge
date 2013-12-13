wingaming.controller('GTS', ['$scope', '$routeParams', '$location', 'angularFireCollection', 'angularFireAuth','angularFire','$timeout','$rootScope', function mtCtrl($scope, $routeParams, $location, angularFireCollection, angularFireAuth,angularFire,$timeout,$rootScope){

    //************************************Active stations database***************************************************

    var urlActiveStations = new Firebase('https://wingaminglounge.firebaseio.com/wingaminglounge/activeStations');

    var wrapper = function () {
        updateTimer();
        $timeout(wrapper, 10000);
    }    
    
    var updateTimer = function(){
        for (var i = $scope.activeStations.length - 1; i >= 0; i--) {
            var time = new Date().getTime() - $scope.activeStations[i].startTime;
            $scope.activeStations[i].displayTime = parseInt($scope.activeStations[i].countdown - (time/1000/60));

            if($scope.activeStations[i].displayTime <= 0){
                timesUp = true;
                $(".station-time-remaining h2").html($scope.activeStations[i].stationNumber);
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
        var tempStation = {};
        
        tempStation.stationNumber = "1";
        tempStation.boxart = "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTKa1lpNVTPQotsxG6bexIrU4Dm9jfH1oxrmC0GrOiVVu_rqwSEhA";
        tempStation.username = "michael fleming";
        tempStation.countdown = "30";
        tempStation.startTime = new Date().getTime()

//        if(typeof $routeParams.user !== "undefined"){
//            if(typeof $routeParams.stationId !== "undefined"){
//                $scope.deleteQuedStation($routeParams.stationId);
//            }
//        }
        
        $scope.activeStations.add(tempStation);	    
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
    //************************************Empty stations database***************************************************

    //url to the data needed
    var urlEmptyStations = new Firebase('https://wingaminglounge.firebaseio.com/wingaminglounge/emptyStations');

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

    $scope.enterGamer = function(stationNumber){

        $rootScope.stationNumber = stationNumber;
        console.log(stationNumber);
    }

}])