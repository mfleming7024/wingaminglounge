wingaming.controller('Login', ['$scope', '$routeParams', '$location', 'angularFireCollection', 'angularFireAuth', function mtCtrl($scope, $routeParams, $location, angularFireCollection, angularFireAuth){

    var theUser;
    //****** Facebook Login
    //Checks if the user is login
    $scope.$on("angularFireAuth:login", function(evt, user) {
        if (user.provider == "facebook") {
            $scope.picurl = "http://graph.facebook.com/" + user.username + "/picture?type=small";
            $scope.displayName = user.displayName;

            theUser = user;
        } else {

        }
    })
    // Login With Faceook
    $scope.login = function() {
        // when the user login successfully then run the following function
        angularFireAuth.login('facebook').then(function() {
            // If the user login successfully it will take them to admin page

            user = theUser;

            $location.path('/admin');
            if (user) {
                //checks the database against what user email is passed in to see if it
                //exists then sets a boolean to say so
                var userExists = false;
                for (var i = 0, max = $scope.users.length; i<max; i++) {
                    if ($scope.users[i].email != user.email) {
                        userExists = false;
                    } else {
                        userExists = true;
                        break;
                    }
                }
                if (userExists) {
                    //user exists
                } else {
                    //FB profile image
                    var picurl = "http://graph.facebook.com/" + user.username + "/picture?type=small";
                    var picurlLarge = "http://graph.facebook.com/" + user.username + "/picture?type=large";
                    //creates a user object from all of the fields and pushes it to the firebase table
                    $scope.users.add({"displayName": user.name, "email": user.email, "profilePic": picurl, "profilePicLarge": picurlLarge, "facebook": true});
                }
            } else {
                //visual feedback of error
            }
        });
    }
    //Logs out of Facebook
    $scope.logout = function() {
        angularFireAuth.logout();
        $location.path('/home')
    };

}])