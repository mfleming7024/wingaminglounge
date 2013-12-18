var crudControllers = angular.module('crudControllers', []);

crudControllers.controller('gameController', ['$scope', 'angularFireCollection','$rootScope', function($scope, angularFireCollection,$rootScope) {
	var urlGames = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/games");
	//collects the info from the database for use.
	$scope.games = angularFireCollection(urlGames);
    
    var id;
    $scope.typing = false;
    //Select Game from search input
    $scope.selectGame = function(game){
        $scope.limit = 5;
        id = game.$id;
        ref = game.$ref;
        $scope.gameInfos = angular.fromJson(angular.toJson(game));
        $scope.gameInfos.$id = id;
        $scope.gameInfos.$ref = ref;
        $scope.typing = false;
    }

	//create a game and adds it to the database
	$scope.saveGame = function(info) {
        if($scope.selectGames === "New Game"){
            if ($scope.gameInfos == "" || $scope.gameInfos == null) {
                console.log("game does not exist");
            } else {
                //error checking for if fields are null
                if ($scope.gameInfos.gameSystem == "" || $scope.gameInfos.gameSystem == null) { //System
                    console.log("No game system given");
                } else if ($scope.gameInfos.gameTitle == "" || $scope.gameInfos.gameTitle == null) { //Game Title
                    console.log("No game title given");
                } else if ($scope.gameInfos.gameArtUrl == "" || $scope.gameInfos.gameArtUrl == null) { // Game Box Art
                    console.log("No game art url given");
                } else if ($scope.gameInfos.gameQuantity == "" || $scope.gameInfos.gameQuantity == null) { //Quantity
                    console.log("No game quantity given");
                } else {
                    $scope.games.add($scope.gameInfos); //Adds to Firebase;
                    console.log('new');
                }
            } //end if else
            console.log('new game added');
        }else {
            $scope.games.update($scope.gameInfos);
        }

	} //end addGame


    //removes from firebase
    $scope.deleteGame = function(game){
       $scope.games.remove(game.$id);
    }
}]);


//Station Crud
crudControllers.controller('stationController', ['$scope', 'angularFireCollection','$rootScope','$location', function($scope,angularFireCollection,$rootScope,$location) {
	//urls to the data needed
	var urlStations = new Firebase('https://wingaminglounge.firebaseio.com/wingaminglounge/stations'); //Stations Firebase
	var urlEmptyStations = new Firebase('https://wingaminglounge.firebaseio.com/wingaminglounge/emptyStations')//Empty Stations Firebase
	//collects the info from the database for use.
	$scope.stations = angularFireCollection(urlStations);
	$scope.emptyStations = angularFireCollection(urlEmptyStations);

    $scope.addStation = function() {
        for (var i=1;i<$scope.stations.length+1;i++) {
            console.log($scope.stations[i].stationNumber);
            if ($scope.stations[i].stationNumber != i) {
                $scope.stationInfos.stationNumber = i;
                $scope.stations.add($scope.stationInfos);
                //$scope.emptyStations.stations.add($scope.stationInfos);
                break;
            } else if (i == $scope.stations.length) {
                $scope.stationInfos.stationNumber = i+1;
                $scope.stations.add($scope.stationInfos);
            }
        }
    }

    //When save button is clicked this function will run
    $scope.saveStation = function(){
        // If new station, new station will be added to firebase
        if($scope.selectStations === "New Station")
        {
            if ($scope.stationInfos == "" || $scope.stationInfos == null) {
                console.log("Station does not exist");
            } else {
                if ($scope.stationInfos.stationSystem == "" || $scope.stationInfos.stationSystem == null) { // The Station System
                    console.log("No SystemTV given");
                } else if ($scope.stationInfos.stationTV == "" || $scope.stationInfos.stationTV == null) { //Station TV
                    console.log("Please enter a TV");
                } else if ($scope.stationInfos.stationTVSerial == "" || $scope.stationInfos.stationTVSerial == null) { //TV's Serial
                    console.log("Please enter a TV Serial");
                } else {
                    var stationsLength = $scope.stations.length+1;
                    $scope.stationInfos.stationNumber = stationsLength;
                    $scope.stations.add($scope.stationInfos);
                    $scope.emptyStations.add({"stationNumber": stationsLength, "stationSystem": $scope.stationInfos.stationSystem});
                }
            } //end if else
        }
        else if(typeof $scope.selectStations !== 'undefined')
        {   //If not new station, form will validate instead.
           $scope.stations.update($scope.stationInfos.$id);
        }

    }

    //removes from firebase
    $scope.deleteStation = function(station){
        $scope.stations.remove(station.$id);
        //Also deletes from emptystations
        for (var i= 0,max=$scope.emptyStations.length;i<max;i++) {
            if ($scope.emptyStations[i].stationNumber == station.stationNumber) {
                $scope.emptyStations.remove($scope.emptyStations[i].$id);
            }
        }
}
    //Station Firebase information
    $scope.stationInfo = function(info){
        $rootScope.stationInfos = $scope.stations[info];
    }

}]);