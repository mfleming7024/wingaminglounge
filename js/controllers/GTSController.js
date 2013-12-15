wingaming.controller('GTS', ['$scope', '$routeParams', '$location', 'angularFireCollection', 'angularFireAuth','angularFire','$timeout','$rootScope', function mtCtrl($scope, $routeParams, $location, angularFireCollection, angularFireAuth,angularFire,$timeout,$rootScope){

    $scope.init=function() {
        if ($rootScope.shopInit==true) return;
        $rootScope.shopInit=true;
        
        //Actual code    
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
            //starts the clocks
            var startKillWatch = $scope.$watch('activeStations', function(){
                $timeout(wrapper);
                startKillWatch();
            });
        });
    
        //create a active station and adds it to the database
        $scope.addActiveStation = function(tempActiveStation){                
            
            //tempStation.stationNumber = "1";
            //Select system by whatever system the chosen game supports?
            //tempActiveStation.stationSystem = "Playstation 4";
            tempActiveStation.gameArt = "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTKa1lpNVTPQotsxG6bexIrU4Dm9jfH1oxrmC0GrOiVVu_rqwSEhA";
            tempActiveStation.startTime = new Date().getTime();
            tempActiveStation.countdown = "2";
            
            //checks against empty stations to remove it so multiple cannot be selected
            var i;
            for (i = 0; i < $scope.emptyStations.length; i++) {
                if ($scope.emptyStations[i].stationNumber == tempActiveStation.stationNumber) {
                    $scope.emptyStations.remove($scope.emptyStations[i].$id);
                    tempActiveStation.stationSystem = $scope.emptyStations[i].stationSystem;
                }
            }
            console.log(tempActiveStation);
            $scope.activeStations.add(tempActiveStation);
            
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
        
        
    }
    
    $scope.init();
    
    
    
}])