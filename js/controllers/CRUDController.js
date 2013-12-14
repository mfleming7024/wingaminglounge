var crudControllers = angular.module('crudControllers', []);

crudControllers.controller('gameController', ['$scope', 'angularFireCollection','$rootScope', function($scope, angularFireCollection,$rootScope) {
	var urlGames = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/games");
	//collects the info from the database for use.
	$scope.games = angularFireCollection(urlGames);
	//create a game and adds it to the database
	$scope.addGame = function() {
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
				$scope.games.add($scope.gameInfos); //Adds to Firebase
			}
		} //end if else
	} //end addGame

    //Select Game from search input
    $scope.selectGame = function(title){
        $scope.limit = 5;
        $scope.gameInfos = $scope.games[title];
    }

    //removes from firebase
    $scope.deleteGame = function(game){
       $scope.games.remove(game.$id);
    }
}]);

crudControllers.controller('staffController', ['$scope', 'angularFireCollection', function($scope, angularFireCollection) {
	//url to the data needed
	var urlStaff = new Firebase('https://wingaminglounge.firebaseio.com/wingaminglounge/staff');
	//collects the info from the database for use.
	$scope.allStaff = angularFireCollection(urlStaff);
	//create a staff member and adds it to the staff database
	$scope.addStaff = function() {
		if ($scope.staff == "" || $scope.staff == null) {
			console.log("staff does not exist");
		} else {
			if ($scope.staff.staffName == "" || $scope.staff.staffName == null) { //Staff Name
				console.log("No Staff Name Given");
			} else if ($scope.staff.staffNumber == "" || $scope.staff.staffNumber == null) { //Staff Cell Number
				console.log("No Number Given");
			} else if ($scope.staff.staffEmail == "" || $scope.staff.staffEmail == null) { //Staffs Email
				console.log("Please Enter an Email");
			} else {
				$scope.allStaff.add($scope.staff);
			}
		} //end if else
	} //end addStaff
}]);

//Station Crud
crudControllers.controller('stationController', ['$scope', 'angularFireCollection','$rootScope','$location', function($scope,angularFireCollection,$rootScope,$location) {
	//urls to the data needed
	var urlStations = new Firebase('https://wingaminglounge.firebaseio.com/wingaminglounge/stations'); //Stations Firebase
	var urlEmptyStations = new Firebase('https://wingaminglounge.firebaseio.com/wingaminglounge/emptyStations')//Empty Stations Firebase
	//collects the info from the database for use.
	$scope.stations = angularFireCollection(urlStations);
	$scope.emptyStations = angularFireCollection(urlEmptyStations);

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
            console.log('new station');
        }
        else if(typeof $scope.selectStations !== 'undefined')
        {   //If not new station, form will validate instead.
           $scope.stations.update($scope.stationInfos.$id);
            console.log('update');
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