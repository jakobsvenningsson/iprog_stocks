/* jslint esversion: 6 */

var tradeControllers = angular.module('tradeControllers', []);

tradeControllers.controller('mainController', ['$scope','securityService', 'orderService','tradeService',
  function($scope, securityService, orderService, tradeService) {

    var socket = io().connect();

    $scope.selectedSecurity = "";
    $scope.status = "";
    $scope.securities = [];
    $scope.trades = [];
    $scope.orders = [];

    // Populate security dropdown.
    securityService.getSecurities().success(function(data){
      console.log(data);
        $scope.securities = data;
    });

    // Populate history window
    $scope.getTrades = function(){

      $scope.trades = [];
      $scope.orders = [];

      tradeService.getTrades($scope.selectedSecurity).success(function(data){
        console.log(data);
        $scope.trades = data;
      });

      orderService.getOrders($scope.selectedSecurity).success(function(data){
        $scope.orders = data;
      });
    };

    $scope.securityName = "";
    $scope.addSecurity = function(){
      securityService.addSecurity($scope.securityName).success(function(res){
        console.log(res);
        $scope.status = `The security ${res} was added successfully`;
        $scope.securityName = "";
        securityService.getSecurities().success(function(data){
          $scope.securities = data;
        });
      });
    };

    $scope.order = {name:"", type:"", price:"", amount:"", uid:""};

    $scope.addOrder = function(){
      console.log("add Order");
      orderService.addOrder($scope.order).success(function(res){
        console.log(res);
        $scope.status = res;
        $scope.order = {};
      });
    };

    // WebSocket listeners.

    socket.on('newTrade',function(data){
      console.log("newTrade");
      if(data.name === $scope.selectedSecurity){
        $scope.trades.push(data);
        $scope.$apply();
      }
    });

    socket.on('newOrder',function(data){
      console.log("newOrder");
      if(data.name === $scope.selectedSecurity){
          $scope.orders.push(data);
          $scope.$apply();
        }
        console.log($scope.orders);
    });

    socket.on('removeOrder', function(id){
      console.log('removeOrder');
        for(var i = 0; i < $scope.orders.length; ++i){
          if(id === $scope.orders[i].id){
            $scope.orders.splice(i, 1);
            break;
          }
        }
        $scope.$apply();
    });

    socket.on('updateOrder', function(id){
      console.log('updateORder');
      console.log(id);
        for(var i = 0; i < $scope.orders.length; ++i){
          if(id.id === $scope.orders[i].id){
            $scope.orders[i] = id;
            break;
          }
        }
        $scope.$apply();
    });
  }
]);


tradeControllers.controller('navigationController', ['$scope',  '$location',
  function($scope,  $location) {
    $scope.location = $location.path();
    // // This function should direct the user to the wanted page
    $scope.redirect = function(address) {
      $location.hash("");
      $location.path('/' + address);
      $scope.location = $location.path();
      console.log("location = " + $scope.location);
    };

  }
]);
