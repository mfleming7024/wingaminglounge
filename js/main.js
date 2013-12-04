var wingaminglounge = angular.module('crud', ['firebase']);

function gameCRUD($scope, angularFireCollection){

	var urlGames = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/games");

    //collects the info from the database for use.
    $scope.games = angularFireCollection(urlGames);
    //create a game and adds it to the database
    $scope.addGame = function(){
        if ($scope.game == "" || $scope.game == null) {
            console.log("game does not exist");
        } else {
            //error checking for if fields are null
            if ($scope.game.gameSystem == "" || $scope.game.gameSystem == null) { //System
                console.log("No game system given");
            } else if ($scope.game.gameTitle == "" || $scope.game.gameTitle == null) { //Game Title
                console.log("No game name given");
            } else if ($scope.game.gameArtUrl == "" || $scope.game.gameArtUrl == null) { // Game Box Art
                console.log("No game art url given");
            } else if ($scope.game.gameQuantity == "" || $scope.game.gameQuantity == null) { //Quantity
                console.log("No game quantity given");
            } else {
                $scope.games.add($scope.game); //Adds to Firebase
            }
        }
    }
}

function staffCRUD($scope, angularFireCollection){

	//url to the data needed
    var urlStaff = new Firebase('https://wingaminglounge.firebaseio.com/wingaminglounge/staff');

    //collects the info from the database for use.
    $scope.allStaff = angularFireCollection(urlStaff);

    //create a staff member and adds it to the staff database
    $scope.addStaff = function(){
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
        } 
    }
}

