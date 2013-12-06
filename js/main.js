var wingaming = angular.module('wingaming', ['firebase', 'crudControllers']);

wingaming.run(['angularFireAuth', '$rootScope', function(angularFireAuth, $rootScope){
    var url = new Firebase("https://wingaminglounge.firebaseio.com/");
    angularFireAuth.initialize(url, {scope: $rootScope, name: "user",path: '/'});

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);

wingaming.config(function ($routeProvider){
    $routeProvider
        .when("/" , {
            title: 'Home',
            controller: "Login",
            templateUrl:"views/home.html"
        })
        .when("/under_construction", {
            title: 'Work in progress',
            authRequired: false,
            templateUrl:"views/under_construction.html"
        })
        .when("/gts", {
            title: 'Gamer Tracking System',
            authRequired: true,
            templateUrl:"views/gts.html"
        })
        .when("/crud_testing", {
            title: 'Crud Testing',
            authRequired: true,
            templateUrl:"views/crud_testing.html"
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






