function shoppingListController(angular, app) {
  'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('shoppingListCtrl', shoppingListCtrl);
    shoppingListCtrl.$inject = ['$http','$filter','$state','$scope','$uibModal'];

    app.controller('modalMoreInfoCtrl', modalMoreInfoCtrl);
    modalMoreInfoCtrl.$inject = ['$scope','$state','$filter','$uibModalInstance','$sce','$compile','$rootScope','items','$http'];

    function shoppingListCtrl($http, $filter, $state, $scope,$uibModal){
        var self = this; //jshint ignore:line

        function pay(venta){
          $state.go('dashboard.checkout',{paymentGatewayUrl: venta.paymentGatewayUrl, reload:true});
        }
        function downloadBill(bill){

        }
        function openModal(size, items){
          var modalInstance = $uibModal.open({
            templateUrl: 'myModalContent.html',
            controller: 'modalMoreInfoCtrl',
            controllerAs:'seeMore',
            size: size,
            resolve: {
              items: function () {
                return items;
              }
            }
          });
        }
        function moreInfo(items){
          openModal('md', items);
        }
        function init() {
          $http.get('./hbr-selfie/dist/php/shopping.php', { params: { action: "getAll" } })
          .then(function(response){
            self.ventas = response.data.ventas;
            console.log(response.data);
            self.moreInfo = moreInfo;
            self.downloadBill = downloadBill;
            self.pay = pay;
          });
        }
        init();
      }
      function modalMoreInfoCtrl($scope,$state,$filter, $uibModalInstance,$sce,$compile,$rootScope,items,$http){
        var self = this;        
        function cancel () {
          $uibModalInstance.dismiss('cancel');
        };
        function init(){
          self.products = items;
          self.cancel = cancel;
        }
        init();
      }
    }
    module.exports = shoppingListController;