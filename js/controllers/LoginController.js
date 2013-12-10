wingaming.controller('Login', ['$scope', '$routeParams', '$location', 'angularFireCollection', 'angularFireAuth','$rootScope','angularFire', function mtCtrl($scope, $routeParams, $location, angularFireCollection, angularFireAuth,$rootScope,angularFire){

	var theUser;
	
	//Testing 
	var false_desktop_statement = "You are not an Admin";           
    var true_desktop_statement = "<li><a href=\"#gts\">- GTS</a></li><li><a href=\"#staff\">- Staff</a></li><li><a href=\"#stations\">- Stations</a></li><li><a href=\"#systems\">- Systems</a></li><li><a href=\"#games\">- Games</a></li>";
            
    var false_mobile_statement = "You are not an Admin";
    var true_mobile_statement = "<a class='right-off-canvas-toggle'><i class='fa fa-bars mobile-bar'></i></a>";
    
    
	
    $scope.$on("angularFireAuth:login", function(evt, user) {
        if (user.provider == "facebook") {            
            theUser = user;

            var urlUser = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/users/"+theUser.id);
            
            //Testing
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
                    if ($rootScope.user.userType == "Gamer") {
                        $scope.userType = false;
                        $scope.mobileStatement = false_mobile_statement;
                        $scope.desktopStatement = false_desktop_statement;
                        $location.path("/game_page");                        
                    } else if ($rootScope.user.userType == "Admin") {
                        $scope.userType = true;
                        $scope.mobileStatement = true_mobile_statement;
                        $scope.desktopStatement = true_desktop_statement;
                        $location.path("/gts");                        
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
    
    /*
	pass in the condition, and what to return whether its false or true
    $scope.render = function(condition, false_statement, true_statement) {        
	    return condition ? true_statement : false_statement;
	};
	*/
	
	//Filter gamer search and select to input
    $scope.limit = 5;
    $scope.setGamer = function (gamer) {
        $scope.displayName = gamer; };
    // pull selected city using {{selected | json}}

}])