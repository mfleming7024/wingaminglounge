wingaming.controller('Login', ['$scope', '$routeParams', '$location', 'angularFireCollection', 'angularFireAuth', function mtCtrl($scope, $routeParams, $location, angularFireCollection, angularFireAuth){

	var theUser;

    var urlUsers = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/users");
	//collects the info from the database for use.
	$scope.users = angularFireCollection(urlUsers);
	
    $scope.$on("angularFireAuth:login", function(evt, user) {
    	console.log(user);
    	console.log(user.email);
        if (user.provider == "facebook") {
            var picurl = "http://graph.facebook.com/" + user.username + "/picture?type=small";
            var picurlLarge = "http://graph.facebook.com/" + user.username + "/picture?type=large";
            $scope.users.add({"displayName": user.name, "email": user.email, "profilePic": picurl, "profilePicLarge": picurlLarge});
            $location.path('/gts');
        } else {
	        console.log("Login other then facebook");
        }
    });

    $scope.login = function() {
		angularFireAuth.login("facebook", {
			scope: "email"			
		});
    };
    
    $scope.logout = function() {
        angularFireAuth.logout();
        $location.path('/')
    };

}])