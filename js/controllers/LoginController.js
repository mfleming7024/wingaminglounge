wingaming.controller('Login', ['$scope', '$routeParams', '$location', 'angularFireCollection', 'angularFireAuth', function mtCtrl($scope, $routeParams, $location, angularFireCollection, angularFireAuth){

	var theUser;

    var urlUsers = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/users");

	$scope.users = angularFireCollection(urlUsers);
	
    $scope.$on("angularFireAuth:login", function(evt, user) {
        if (user.provider == "facebook") {            
            theUser = user;
        } else {
	        console.log("Login other then the facebook service");
        }
    });

    $scope.login = function() {
		angularFireAuth.login("facebook", {
			scope: "email"			
		}).then(function(){	
			var userExists;		
            for (var i = 0, max = $scope.users.length; i<max; i++) {
                if ($scope.users[i].email != theUser.email) {
                	userExists = false;
                } else {
                	userExists = true;
                    break;
                }
            }
            
            if (!userExists) {
	            console.log("User does not exist, adding " + theUser.email + " to the database.");
	            
	            var picurl = "http://graph.facebook.com/" + theUser.username + "/picture?type=small";
		        var picurlLarge = "http://graph.facebook.com/" + theUser.username + "/picture?type=large";
				
				$scope.users.add({"displayName": theUser.name, "email": theUser.email, "profilePic": picurl, "profilePicLarge": picurlLarge});
				$location.path('/gts');
            } else {
	            console.log("User does exist, not adding " + theUser.email + " to the database");
            }
			
		});		
    };
    
    $scope.logout = function() {
        angularFireAuth.logout();
        $location.path('/');
    };

}])