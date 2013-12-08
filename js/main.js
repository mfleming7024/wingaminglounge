var wingaming = angular.module('wingaming', ['firebase', 'crudControllers']);

wingaming.run(['angularFireAuth', '$rootScope', function(angularFireAuth, $rootScope){
    var url = new Firebase("https://wingaminglounge.firebaseio.com/");
    angularFireAuth.initialize(url, {scope: $rootScope, name: "fb_user",path: '/'});

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;        
    });
}]);

wingaming.config(function ($routeProvider){
    $routeProvider
        .when("/" , {
            title: 'Home',
            controller: "Login",
            templateUrl:"partials/home.html"
        })
        .when("/under_construction", {
            title: 'Work in progress',
            authRequired: false,
            templateUrl:"partials/under_construction.html"
        })
        .when("/gts", {
            title: 'Gamer Tracking System',
            authRequired: true,
            templateUrl:"partials/gts.html",
            resolve:{
                factory: checkPermission
            }
        })
        .when("/crud_testing", {
            title: 'Crud Testing',
            authRequired: true,
            templateUrl:"partials/crud_testing.html"
        })
        .when("/game_page", {
            title: 'Your a gamer!',
            authRequired: true,
            templateUrl:"partials/gamer_page.html"
        })
        .otherwise({
        	redirectTo:"/",
        	title: "Home"
        });
        
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

var checkPermission = function ($q, $rootScope, $location){
    console.log('$rootScope.user',$rootScope.user);
    if(!$rootScope.user || $rootScope.user.userType == 'Gamer'){
        $location.path('/')

    }
}






