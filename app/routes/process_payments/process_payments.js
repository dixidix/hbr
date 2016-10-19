function processPaymentsController(angular, app) {
  'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('processPaymentsCtrl', processPaymentsCtrl);
    processPaymentsCtrl.$inject = ['$http','$filter','$state','$scope','$uibModal'];

    app.controller('modaProcessCtrl', modaProcessCtrl);
    modaProcessCtrl.$inject = ['$scope','$state','$filter','$uibModalInstance','$sce','$compile','$rootScope','venta','products','$http'];

    function processPaymentsCtrl($http, $filter, $state, $scope,$uibModal){
        var self = this; //jshint ignore:line

        function openModal(size, venta, products){
          var modalInstance = $uibModal.open({
            templateUrl: 'myModalContent.html',
            controller: 'modaProcessCtrl',
            controllerAs:'modaProcess',
            size: size,
            resolve: {
              venta: function () {
                return venta;
              },
              products: function () {
                return products;
              },
            }
          });
        }
        function processPayment(venta, products){
          openModal('md', venta, products);
        }
        function init() {
          $http.get('./dist/php/shopping.php', { params: { action: "getAll" } })
          .then(function(response){
            self.ventas = response.data.ventas;
            self.processPayment = processPayment;
          });
        }
        init();
      }
      function modaProcessCtrl($scope,$state,$filter, $uibModalInstance,$sce,$compile,$rootScope,venta, products ,$http){
        var self = this;        
        function cancel () {
          $uibModalInstance.dismiss('cancel');
        };
        function generateToken () {
          $http.post('./dist/php/encrypt.php', { timestamp: Math.round((new Date()).getTime() / 1000) })
          .then(function success(response){
             self.successUrl = "http://tucourier.com.ar/myhbr/dashboard/shopping/checkout/success/" + response.data;
             self.token = response.data;
          });            
        }
        function send () {
          $http.put('./dist/php/shopping.php', { paymentGatewayUrl: self.paymentGatewayUrl, id: self.venta.id, token: self.token })
          .then(function success(response){
            $state.reload();
            $uibModalInstance.dismiss('cancel');
          });
          
        };
        function init(){
          self.venta = venta;
          self.products = products;
          $http.get('./dist/php/users.php', { params: { action: "getUserById", id: self.venta.uid } })
          .then(function(response){
            self.user = response.data;
          });
          self.cancel = cancel;
          self.send = send;
          self.generateToken  = generateToken;
        }
        init();
      }
    }
    module.exports = processPaymentsController;