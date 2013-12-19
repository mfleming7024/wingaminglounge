wingaming.controller('GTS', ['$scope', '$routeParams', '$location', 'angularFireCollection', 'angularFireAuth','angularFire','$timeout','$rootScope', function mtCtrl($scope, $routeParams, $location, angularFireCollection, angularFireAuth,angularFire,$timeout,$rootScope){
    
    //Unique naming conventions for style points
    $rootScope.gameTitleasdf;
    $rootScope.stationGamerasdf;
    
    //Testing Integrating the Auto complete functionality
    $scope.gameTyping = false;
    $scope.userTyping = false;
    $scope.limit = 5;
    
    //Select Game from search input
    $scope.selectGame = function(game){
        $scope.gameInfos = angular.fromJson(angular.toJson(game));
        $rootScope.gameTitleasdf = $scope.gameInfos.gameArtUrl;
        $scope.gameTyping = false;
    }
    
    //Select User from search input
    $scope.selectUser = function (gamer) {
        $scope.userInfos = angular.fromJson(angular.toJson(gamer));
        $rootScope.stationGamerasdf = $scope.userInfos.displayName;
        $scope.userTyping = false; 
    };
    
    //init function to prevent the controller from running twice
    $scope.init=function() {
        if ($rootScope.shopInit==true) return;
        $rootScope.shopInit=true;
        
        //Actual code    
        //************************************Active stations database***************************************************
        var urlActiveStations = new Firebase('https://wingaminglounge.firebaseio.com/wingaminglounge/activeStations'); 
        
        //Setting scope to use with the autocomplete
        var urlGames = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/games");
        var urlUsers = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/users");
        
        $scope.games = angularFireCollection(urlGames);
        $scope.users = angularFireCollection(urlUsers);
        
        //general overall function for the page to run
        var wrapper = function () {
            updateTimer();
            $timeout(wrapper, 5000);
        }    
        
        //variables used in updateTimer function
        var time,alert;
        
        //timer event that runs through all the active stations and basically updates
        //all the timers with the correct time by calculating the change in time between
        //start time and the display time and reflects that in the html.
        var updateTimer = function(){
            for (var i = $scope.activeStations.length - 1; i >= 0; i--) {
                time = new Date().getTime() - $scope.activeStations[i].startTime;
                $scope.activeStations[i].displayTime = parseInt($scope.activeStations[i].countdown - (time/1000/60));
                
                //Checks if the time is up and removes from active adds to empty and 
                //throws an alert to display the user info of the last station
                if($scope.activeStations[i].displayTime <= 0){ 
                    //throw alert for station time up                   
                    alert = {
                        "user": $scope.activeStations[i].stationGamer,
                        "stationNumber": $scope.activeStations[i].stationNumber
                    }
                    $scope.alerts.add(alert);
                    
                    $scope.emptyStations.add({
                        "stationNumber": $scope.activeStations[i].stationNumber, 
                        "stationSystem": $scope.activeStations[i].stationSystem
                    });
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
            //Select system by whatever system the chosen game supports?
            tempActiveStation.stationGamer= $rootScope.stationGamerasdf;
            tempActiveStation.gameArt = $rootScope.gameTitleasdf;
            tempActiveStation.startTime = new Date().getTime();
            tempActiveStation.countdown = '2';
            
            //When adding to active it loops through the empty stations and finds that
            //corresponding station and removes it so it only shows in activeStations
            for (var i = 0; i < $scope.emptyStations.length; i++) {
                if ($scope.emptyStations[i].stationNumber == tempActiveStation.stationNumber) {
                    $scope.emptyStations.remove($scope.emptyStations[i].$id);
                    tempActiveStation.stationSystem = $scope.emptyStations[i].stationSystem;
                }
            }            
            $scope.activeStations.add(tempActiveStation);
        }
        
        //Removes station from active and adds to empty
        $scope.removeActiveStation = function(station) {
            $scope.activeStations.remove(station.$id);
            
            var tempEmptyStation = {
                "stationNumber": station.stationNumber,
                "stationSystem": station.stationSystem
            };            
            $scope.emptyStations.add(tempEmptyStation);
        }
        
        //************************************Empty stations database***************************************************
        var urlEmptyStations = new Firebase('https://wingaminglounge.firebaseio.com/wingaminglounge/emptyStations');
    
        $scope.emptyStations = angularFireCollection(urlEmptyStations);
        
        //*******************************************Alerts database****************************************************
        var urlAlerts = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/alerts");
        
        $scope.alerts = angularFireCollection(urlAlerts);
        
        $scope.addAlert = function(alert) {
            $scope.alerts.add(alert);
        }
        
        $scope.removeAlert = function(alertID) {
            $scope.alerts.remove(alertID);
        }
        
        //******************************************Queue database*******************************************************
        var urlPlayerQueue = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/playerQueue");
        
        $scope.playerQueue = angularFireCollection(urlPlayerQueue);
        
        //
        $scope.addToPlayerQueue = function(playerRequest) {  
            //Grabs a date and seperates it into hours and minutes
            var d = new Date();
            
            var origHours = d.getHours();
            var origMin =   d.getMinutes();
            var formatHours, formatMinutes;
            
            //adds in zeros to variables where needed
            if (origHours > 12) {
                formatHours = origHours - 12;
            } else if (origHours == 0) {
                formatHours = 12;
            } else {
                formatHours = origHours;
            }
            
            if (origMin < 10) {
                formatMinutes = "0" + origMin;
            } else {
                formatMinutes = origMin;
            }
            
            //Throws both new variables into and array and joins them together with ":"
            var dformat = [formatHours, formatMinutes].join(":");
            
            //sets the checked in time
            playerRequest.checkedIn = dformat;
                        
            $scope.playerQueue.add(playerRequest);
        }
        
        $scope.removeFromQueue = function(playerID) {
            $scope.playerQueue.remove(playerID);
        }
        
        /*******************************************Change Game************************************************************/
        //sets the boolean for game change html to hide/show
        $scope.showGameChange = function(){
            $scope.gameChange = true;
        }

        //sets the gameArtURL for the switch game to work
        $scope.switchGame = function(tempGame, tempStation){ 
            tempStation.gameArt = tempGame;
            $scope.gameChange = false;
        }
        
    }
    //runs the init function
    $scope.init(); 
}])