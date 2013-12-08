wingaming.controller('Login', ['$scope', '$routeParams', '$location', 'angularFireCollection', 'angularFireAuth','$rootScope','angularFire', function mtCtrl($scope, $routeParams, $location, angularFireCollection, angularFireAuth,$rootScope,angularFire){

	var theUser;
	
    $scope.$on("angularFireAuth:login", function(evt, user) {
        if (user.provider == "facebook") {            
            theUser = user;

            var urlUser = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/users/"+theUser.id);
            
            var usersCollection = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/users/");
            
            $scope.users = angularFireCollection(usersCollection);

            $rootScope.user = {};
            angularFire(urlUser, $rootScope, 'user').then(function()
            {
                if (Object.keys($rootScope.user).length === 0) {
                    console.log("User does not exist, adding " + theUser.email + " to the database.");

                    var picurl = "http://graph.facebook.com/" + theUser.username + "/picture?type=small";
                    var picurlLarge = "http://graph.facebook.com/" + theUser.username + "/picture?type=large";


                    $rootScope.user = {"displayName": theUser.name, "email": theUser.email, "profilePic": picurl, "profilePicLarge": picurlLarge, "userType": "Gamer"};


                    $location.path('/game_page');
                } else {
                    console.log("User does exist, not adding " + theUser.email + " to the database");
                    console.log('$rootScope..userType',$rootScope.user.userType);
                    if ($rootScope.user.userType == "Gamer") {
                        $scope.userType = false;
                        $location.path("/game_page");
                        $scope.statement = false_statement;
                    } else if ($rootScope.user.userType == "Admin") {
                        $scope.userType = true;
                        $location.path("/gts");
                        $scope.statement = true_statement;
                    };
                }
            })




        } else {
	        console.log("Login other then the facebook service");
        }
    });

    $scope.login = function() {
		angularFireAuth.login("facebook", {
			scope: "email"			
		});
    };
    
    $scope.logout = function() {
        angularFireAuth.logout();
        $location.path('/');
    };
    
    var false_statement = "<h1>Your not an Admin</h1>";
    var true_statement = "<a class='right-off-canvas-toggle'><i class='fa fa-bars mobile-bar'></i></a>";
    
    $scope.render = function(condition) {        
	    return condition ? true_statement : false_statement;
	};
	
	//Filter gamer search and select to input
    $scope.limit = 5;
    $scope.setGamer = function (gamer) {
        $scope.displayName = gamer; };
    // pull selected city using {{selected | json}}

}])