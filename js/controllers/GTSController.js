wingaming.controller('GTS', ['$scope', '$routeParams', '$location', 'angularFireCollection', 'angularFireAuth','angularFire','$timeout','$rootScope', function mtCtrl($scope, $routeParams, $location, angularFireCollection, angularFireAuth,angularFire,$timeout,$rootScope){
    
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
    
    //Filter user search and select to input
    $scope.selectUser = function (gamer) {
        $scope.userInfos = angular.fromJson(angular.toJson(gamer));
        $rootScope.stationGamerasdf = $scope.userInfos.displayName;
        $scope.userTyping = false;
        
    };
    
    //select user
    
    
    
    $scope.init=function() {
        if ($rootScope.shopInit==true) return;
        $rootScope.shopInit=true;
        
        //Actual code    
        //************************************Active stations database***************************************************
        var urlActiveStations = new Firebase('https://wingaminglounge.firebaseio.com/wingaminglounge/activeStations'); 
        
        var urlGames = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/games");
        var urlUsers = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/users");
        
        $scope.games = angularFireCollection(urlGames);
        $scope.users = angularFireCollection(urlUsers);
        
        var wrapper = function () {
            updateTimer();
            $timeout(wrapper, 5000);
        }    
        
        var time,alert;
        
        var updateTimer = function(){
            for (var i = $scope.activeStations.length - 1; i >= 0; i--) {
                time = new Date().getTime() - $scope.activeStations[i].startTime;
                $scope.activeStations[i].displayTime = parseInt($scope.activeStations[i].countdown - (time/1000/60));
                
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
            tempActiveStation.countdown = "2";
            console.log(tempActiveStation);
            
            //Removes from empty by station number
            for (var i = 0; i < $scope.emptyStations.length; i++) {
                if ($scope.emptyStations[i].stationNumber == tempActiveStation.stationNumber) {
                    $scope.emptyStations.remove($scope.emptyStations[i].$id);
                    tempActiveStation.stationSystem = $scope.emptyStations[i].stationSystem;
                }
            }
            
            $scope.activeStations.add(tempActiveStation);
        }
        
        $scope.changeActiveGame = function(activeStation, gameObj) {
            console.log(activeStation);
            console.log(gameObj);
        }
        
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
        
        $scope.addToPlayerQueue = function(playerRequest) {            
            var d = new Date();
            
            var origHours = d.getHours();
            var origMin =   d.getMinutes();
            var formatHours, formatMinutes;
            
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
            
            var dformat = [formatHours, formatMinutes].join(":");
            
            playerRequest.checkedIn = dformat;
            
            $scope.playerQueue.add(playerRequest);
            console.log(playerRequest);
        }
        
        $scope.removeFromQueue = function(playerID) {
            $scope.playerQueue.remove(playerID);
        }
        
        /*******************************************Change Game************************************************************/
        $scope.showGameChange = function(){
            $scope.gameChange = true;
        }
        
        $scope.switchGame = function(tempGame, tempStation){
           
            //console.log(tempGame, tempStation);
            console.log(tempStation.gameArt);
            var temp = angular.fromJson(angular.toJson(tempGame));
            console.log(temp);
            $scope.gameChange = false;
            //tempStation.gameArt = tempGame.gameArtUrl;
        }
        
    }
    $scope.init(); 
}])