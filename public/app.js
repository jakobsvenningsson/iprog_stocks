(function(){
  var app = angular.module("trade", [
  'ngRoute',
  'tradeControllers',
  'ui.bootstrap'
  ]);

  app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/main', {
        templateUrl: 'main.html',
        controller: 'mainController'
      }).
      otherwise({
        redirectTo: '/main'
      });
  }]);
})();
