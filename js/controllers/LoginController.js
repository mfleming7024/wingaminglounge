wingaming.controller('Login', ['$scope', '$routeParams', '$location', 'angularFireCollection', 'angularFireAuth','$rootScope','angularFire', function mtCtrl($scope, $routeParams, $location, angularFireCollection, angularFireAuth,$rootScope,angularFire){

    var usersCollection = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/users/");
    $scope.users = angularFireCollection(usersCollection);

    $scope.init=function() {
        if ($rootScope.loginInit==true) return;
        $rootScope.loginInit=true;

        var theUser;

        var true_desktop_statement = "<li><a href=\"#gts\"> Gamer Track System</a></li>" +
            "<li><a href=\"#users\"> Users</a></li>" +
            "<li><a href=\"#stations\"> Stations</a></li>" +
            "<li><a href=\"#games\"> Games</a></li>";
        var true_mobile_statement = "<a class='right-off-canvas-toggle'><i class='fa fa-bars mobile-bar'></i></a>";

        $scope.$on("angularFireAuth:login", function(evt, user) {
            if (user.provider == "facebook") {
                theUser = user;

                $scope.user = true;
                $rootScope.displayName = user.displayName;
                $scope.profilePic = "http://graph.facebook.com/" + user.username + "/picture?type=large";

                var urlUser = new Firebase("https://wingaminglounge.firebaseio.com/wingaminglounge/users/"+theUser.id);

                $rootScope.user = {};

                angularFire(urlUser, $rootScope, 'user').then(function(dis)
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

                    dis();

                    /*console.log($scope.users);*/
                });//end angularFire
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

    }

    var id;

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

        console.log(id);

    };
    //Filter user types for staff
    $scope.staffFilter = function(staff){
        return (staff.userType == 'Admin' || staff.userType == 'Staff');

    }

    $scope.updatePermission = function(info){
        console.log(info);
        $scope.users.update($scope.userInfos);
//        $scope.users.update(info);

//         $rootScope.userInfos = $scope.users[info];
//        console.log(angular.fromJson(angular.toJson($scope.users[info])));
    }


    $scope.init();
}]);