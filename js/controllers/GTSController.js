wingaming.controller('GTS', ['$scope', '$routeParams', '$location', 'angularFireCollection', 'angularFireAuth','angularFire','$timeout','$rootScope', function mtCtrl($scope, $routeParams, $location, angularFireCollection, angularFireAuth,angularFire,$timeout,$rootScope){

    //************************************Active stations database***************************************************

    var urlActiveStations = new Firebase('https://wingaminglounge.firebaseio.com/wingaminglounge/activeStations');

    var wrapper = function () {
        updateTimer();
        $timeout(wrapper, 5000);
    }    
    
    var time;
    
    var updateTimer = function(){
        for (var i = $scope.activeStations.length - 1; i >= 0; i--) {
            time = new Date().getTime() - $scope.activeStations[i].startTime;
            $scope.activeStations[i].displayTime = parseInt($scope.activeStations[i].countdown - (time/1000/60));
            console.log($scope.activeStations[i].displayTime);
            if($scope.activeStations[i].displayTime <= 0){ 
                //throw alert for station time up
                console.log("Time is up for " + $scope.activeStations[i].stationGamer + " at station number " + $scope.activeStations[i].stationNumber);
                
                $scope.emptyStations.add({"stationNumber": $scope.activeStations[i].stationNumber, "stationSystem": $scope.activeStations[i].stationSystem});
                
                $scope.activeStations.remove($scope.activeStations[i].$id);
            }
        };
    };

    //collects the info from the database for use.
    $scope.activeStations = angularFireCollection(urlActiveStations,function()
    {

        console.log('clicked');
        //starts the clocks
        var startKillWatch = $scope.$watch('activeStations', function(){
            $timeout(wrapper);
            startKillWatch();
        })
    });

    //create a active station and adds it to the database
    $scope.addActiveStation = function(){                
        var tempStation = {};
        
        tempStation.stationNumber = "1";
        tempStation.stationSystem = "Playstation 4";
        tempStation.gameArt = "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTKa1lpNVTPQotsxG6bexIrU4Dm9jfH1oxrmC0GrOiVVu_rqwSEhA";
        tempStation.stationGamer = "michael fleming";
        tempStation.countdown = "2";
        tempStation.startTime = new Date().getTime();
        
        $scope.activeStations.add(tempStation);
        
        //checks against empty stations to remove it so multiple cannot be selected
        var i;
        for (i = 0; i < $scope.emptyStations.length; i++) {
            if ($scope.emptyStations[i].stationNumber == tempStation.stationNumber) {
                $scope.emptyStations.remove($scope.emptyStations[i].$id);
            }
        }
        
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
    //************************************Empty stations database***************************************************

    //url to the data needed
    var urlEmptyStations = new Firebase('https://wingaminglounge.firebaseio.com/wingaminglounge/emptyStations');

    //collects the info from the database for use.
    $scope.emptyStations = angularFireCollection(urlEmptyStations);

    $scope.enterGamer = function(stationNumber){

        $rootScope.stationNumber = stationNumber;
        console.log(stationNumber);
    }

}])