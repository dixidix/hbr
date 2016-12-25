function shoppingListController(angular, app) {
  'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('shoppingListCtrl', shoppingListCtrl);
    shoppingListCtrl.$inject = ['$http','$filter','$state','$scope','$uibModal'];

    app.controller('modalMoreInfoCtrl', modalMoreInfoCtrl);
    modalMoreInfoCtrl.$inject = ['$scope','$state','$filter','$uibModalInstance','$sce','$compile','$rootScope','items','venta', '$http'];

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
              },
                venta: function () {
                    return self.ventas;
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
              response.data.ventas.timestamp = new Date(response.data.ventas.timestamp);
            self.ventas = response.data.ventas;


            self.moreInfo = moreInfo;
            self.downloadBill = downloadBill;
            self.pay = pay;
          });
        }
        init();
      }
      function modalMoreInfoCtrl($scope,$state,$filter, $uibModalInstance,$sce,$compile,$rootScope,items, venta, $http){
        var self = this;        
        function cancel () {
          $uibModalInstance.dismiss('cancel');
        };
        function init(){
          self.products = items;
          self.venta = venta[0];
          self.wh_entry_fare = parseFloat(14.00).toFixed(2);
          self.aditional_charges = parseFloat(0).toFixed(2);
          self.aditional_weight = 0;
          self.shipment_value = 35;
          self.total_shipment = parseFloat(self.venta.total_quantity * self.shipment_value).toFixed(2);
          if (self.venta.peso_total > 5) {
              self.aditional_weight = parseFloat((self.venta.peso_total - 5) * 2.80).toFixed(2);
          }
          self.total_warehouse_price = (parseFloat(self.wh_entry_fare) + parseFloat(self.aditional_weight) + parseFloat(self.aditional_charges)).toFixed(2);
          self.cancel = cancel;
          self.total_sale = (parseFloat(self.total_warehouse_price) + parseFloat(self.total_shipment)).toFixed(2);
        }
        init();
      }
    }
    module.exports = shoppingListController;