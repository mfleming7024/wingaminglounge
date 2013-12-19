wingaming.controller('Login', ['$scope', '$routeParams', '$location', 'angularFireCollection', 'angularFireAuth','$rootScope','angularFire', function mtCtrl($scope, $routeParams, $location, angularFireCollection, angularFireAuth,$rootScope,angularFire){

    var usersCollection = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/users/");
    $scope.users = angularFireCollection(usersCollection);
    
    //init to restrict the controller from running multiple times
    $scope.init=function() {
        if ($rootScope.loginInit==true) return;
        $rootScope.loginInit=true;

        var theUser;
        
        //premade html for mobile admin nav
        var true_desktop_statement = "<li><a href=\"#gts\"> Gamer Track System</a></li>" +
            "<li><a href=\"#users\"> Users</a></li>" +
            "<li><a href=\"#stations\"> Stations</a></li>" +
            "<li><a href=\"#games\"> Games</a></li>";
        var true_mobile_statement = "<a class='right-off-canvas-toggle'><i class='fa fa-bars mobile-bar'></i></a>";
        
        //angular fire on login event
        $scope.$on("angularFireAuth:login", function(evt, user) {
            if (user.provider == "facebook") {
                theUser = user;
                
                //setting a few scope variables for our user navigation
                $scope.user = true;
                $rootScope.displayName = user.displayName;
                $scope.profilePic = "http://graph.facebook.com/" + user.username + "/picture?type=large";

                var urlUser = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/users/"+theUser.id);
                
                //sets the user object into the rootscope
                $rootScope.user = {};

                angularFire(urlUser, $rootScope, 'user').then(function()
                {
                    //if nothing is returned in the object then it adds to the database with profile pictures
                    if (Object.keys($rootScope.user).length === 0) {
                        console.log("User does not exist, adding " + theUser.email + " to the database.");

                        var picurl = "http://graph.facebook.com/" + theUser.username + "/picture?type=small";
                        var picurlLarge = "http://graph.facebook.com/" + theUser.username + "/picture?type=large";

                        $rootScope.user = {"displayName": theUser.name, "email": theUser.email, "profilePic": picurl, "profilePicLarge": picurlLarge, "userType": "Admin","id": theUser.id};
                        
                        $scope.userType = true;
                        $scope.mobileStatement = true_mobile_statement;
                        $scope.desktopStatement = true_desktop_statement;
                        
                        $location.path('/game_page');

                    } else {
                        //if user exists then it determines what to display based on userType
                        if ($rootScope.user.userType == "Gamer") {
                            $scope.userType = false;
                        } else if ($rootScope.user.userType == "Admin") {
                            $scope.userType = true;
                            $scope.mobileStatement = true_mobile_statement;
                            $scope.desktopStatement = true_desktop_statement;
                        };//end usertype loop
                    };//end else
                    //dis();
                });//end angularFire
            } else {
                console.log("Login other then the facebook service");
            };//end if else
        });//end scope.on angularfirelogin

        //login function
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
        
        //logout event
        $scope.$on("angularFireAuth:logout", function(evt, user) {
            $scope.user = false;
        });

    }

    var id;

    //auto complete 
    $scope.typing = false;
    //Filter user search and select to input
    $scope.limit = 5;
    $scope.selectUser = function (gamer) {
        id = gamer.$id;
        ref = gamer.$ref;
        $scope.userInfos = angular.fromJson(angular.toJson(gamer));
        $scope.userInfos.$id = id;
        $scope.userInfos.$ref = ref;
        $scope.typing = false;
    };
    //Filter user types for staff
    $scope.staffFilter = function(staff){
        return (staff.userType == 'Admin' || staff.userType == 'Staff');
    }
    
    $scope.updatePermission = function(info){
        $scope.users.update($scope.userInfos);
    }
    //runs the init function
    $scope.init();
}]);