var wingaming = angular.module('wingaming', ['firebase']);

/*
wingaming.run(['angularFireAuth', '$rootScope', function(angularFireAuth, $rootScope){
    var url = new Firebase("https://wingaminglounge.firebaseio.com/");
    angularFireAuth.initialize(url, {scope: $rootScope, name: "user",path: '/home'});

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);
*/

wingaming.config(function ($routeProvider){
    $routeProvider
        .when("/",{
            title: 'Home',
/*             controller:"Login", */
            templateUrl:"views/home.html"
        })
        .when("/under_construction", {
            title: 'Work in progress',
            templateUrl:"views/under_construction.html"
        })
        .when("/gts", {
            title: 'Gamer Tracking System',
            templateUrl:"views/gts.html"
        })
        .when("/gts_add_gamer/:user/:stationId", {
            controller:"UserCrud",
            templateUrl:"views/gts_add_gamer.html",
            authRequired: true
        })
        .otherwise({redirectTo:"/"});
        
}).directive('autoComplete', function($timeout) {
        return function(scope, iElement, iAttrs) {
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select: function() {
                    $timeout(function() {
                        iElement.trigger('input');
                    }, 0);
                }
            });
        };
    });


/*
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
                console.log("No game title given");
            } else if ($scope.game.gameArtUrl == "" || $scope.game.gameArtUrl == null) { // Game Box Art
                console.log("No game art url given");
            } else if ($scope.game.gameQuantity == "" || $scope.game.gameQuantity == null) { //Quantity
                console.log("No game quantity given");
            } else {
                $scope.games.add($scope.game); //Adds to Firebase
            }
        }//end if else
    }//end addGame
}//end gameCRUD

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
        }//end if else
    }//end addStaff
}//end staffCRUD

function systemsCRUD($scope, angularFireCollection){

	//url to the data needed
    var urlSystem = new Firebase('https://wingaminglounge.firebaseio.com/wingaminglounge/systems');

    //collects the info from the database for use.
    $scope.systems = angularFireCollection(urlSystem);
 
    //create a system and adds it to the database
    $scope.addSystem = function(){
        if ($scope.system == "" || $scope.system == null) {
            console.log("game does not exist");
        } else {
            if ($scope.system.systemName == "" || $scope.system.systemName == null) { //System Name
                console.log("No System Name Given");
            } else if ($scope.system.systemSerial == "" || $scope.system.systemSerial == null) { //System Serial
                console.log("No System Serial Given");
            } else if ($scope.system.systemStation == "" || $scope.system.systemStation == null) { //Systems Assigned Station
                console.log("Please select a station or None");
            } else {
                $scope.systems.add($scope.system); // Add to Firebase
            }
        }//end if else
    }//end addSystem
}//end systemsCRUD

function stationsCRUD($scope, angularFireCollection){

     //urls to the data needed
    var urlStations = new Firebase('https://wingaminglounge.firebaseio.com/wingaminglounge/stations'); //Stations Firebase

    //collects the info from the database for use.
    $scope.stations = angularFireCollection(urlStations);

    //create a system and adds it to the database
    $scope.addStation = function(){
        if ($scope.station == "" || $scope.station == null) {
            console.log("Station does not exist");
        } else {
            if ($scope.station.stationNumber == "" || $scope.station.stationNumber == null) { //Station Number
                console.log("No Station chosen");
            } else if ($scope.station.stationSystem == "" || $scope.station.stationSystem == null) { // The Station System
                console.log("No SystemTV given");
            } else if ($scope.station.stationTV == "" || $scope.station.stationTV == null) { //Station TV
                console.log("Please enter a TV");
            } else if ($scope.station.stationTVSerial == "" || $scope.station.stationTVSerial == null) { //TV's Serial
                console.log("Please enter a TV Serial");
            } else {
                $scope.stations.add($scope.station);
            }
        }//end if else
    }//end addStation
}//end systemsCRUD
*/




