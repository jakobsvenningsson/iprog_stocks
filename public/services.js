(function() {

  angular.module('trade')
  .factory('securityService', function($http) {

    var securityService = {};

    securityService.getSecurities = function(){
      return $http.get('/API/securities');
    };

    securityService.addSecurity = function(security){
      return $http.post("/API/security/submit", {securityName: security});
    };

    return securityService;
  })

  .factory('orderService', function($http) {

    var orderService = {};

    orderService.addOrder = function(order){
      return $http.post("/API/order/submit", order);
    };

    orderService.getOrders = function(security){
      return $http.get("/API/orders/" + security);
    };

    return orderService;

  })

  .factory('tradeService', function($http) {
    var tradeService = {};

    tradeService.getTrades = function(security) {
      return $http.get('/API/trades/' + security);
    };

    return tradeService;

  });


})();
