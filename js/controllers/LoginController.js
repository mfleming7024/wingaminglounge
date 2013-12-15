wingaming.controller('Login', ['$scope', '$routeParams', '$location', 'angularFireCollection', 'angularFireAuth','$rootScope','angularFire', function mtCtrl($scope, $routeParams, $location, angularFireCollection, angularFireAuth,$rootScope,angularFire){

	var theUser;
	      
    var true_desktop_statement = "<li><a href=\"#gts\">- GTS</a></li>" +
        "<li><a href=\"#users\">- Users</a></li>" +
        "<li><a href=\"#stations\">- Stations</a></li>" +
        "<li><a href=\"#games\">- Games</a></li>";
    var true_mobile_statement = "<a class='right-off-canvas-toggle'><i class='fa fa-bars mobile-bar'></i></a>";

    var usersCollection = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/users/");
    $scope.users = angularFireCollection(usersCollection);

    $scope.$on("angularFireAuth:login", function(evt, user) {
        if (user.provider == "facebook") {            
            theUser = user;

            $scope.user = true;

            var urlUser = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/users/"+theUser.id);

            $rootScope.user = {};
            angularFire(urlUser, $rootScope, 'user').then(function()
            {
                if (Object.keys($rootScope.user).length === 0) {
                    console.log("User does not exist, adding " + theUser.email + " to the database.");

                    var picurl = "http://graph.facebook.com/" + theUser.username + "/picture?type=small";
                    var picurlLarge = "http://graph.facebook.com/" + theUser.username + "/picture?type=large";

                    $rootScope.user = {"displayName": theUser.name, "email": theUser.email, "profilePic": picurl, "profilePicLarge": picurlLarge, "userType": "Gamer","id": theUser.id};

                    $location.path('/game_page');


                } else {
                    console.log("User does exist, not adding " + theUser.email + " to the database");
                    if ($rootScope.user.userType == "Gamer") {
                        $scope.userType = false;                
                    } else if ($rootScope.user.userType == "Admin") {
                        $scope.userType = true;
                        $scope.mobileStatement = true_mobile_statement;
                        $scope.desktopStatement = true_desktop_statement;                       
                    };//end usertype loop
                };//end else
            });//end angularFire
            console.log($scope.users[0].$id);
        } else {
	        console.log("Login other then the facebook service");
        };//end if else
    });//end scope.on angularfirelogin

    $scope.login = function() {
		angularFireAuth.login("facebook", {
			scope: "email"			
		});
    };
    //logout function
    $scope.logout = function() {
        angularFireAuth.logout();
        $location.path('/');
    };
    
    $scope.$on("angularFireAuth:logout", function(evt, user) {
        $scope.user = false;
    });

    $scope.typing = false;
	//Filter user search and select to input
    $scope.limit = 5;
    $scope.selectUser = function (gamer) {

        $scope.userInfos = angular.fromJson(angular.toJson(gamer));
        $scope.typing = false;

    };
    //Filter user types for staff
    $scope.staffFilter = function(staff){
        return (staff.userType == 'Admin' || staff.userType == 'Staff');

    }

    $scope.updatePermission = function(info){
//        $scope.users.update($scope.userInfos);
        console.log('clicked', info);

    }

}])