function warehouseController(angular, app) {
  'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('warehouseCtrl', warehouseCtrl);
    warehouseCtrl.$inject = ['$http','$filter','$state','$scope','$uibModal','warehouseService'];

    app.controller('modalAddWarehouseCtrl', modalAddWarehouseCtrl);
    modalAddWarehouseCtrl.$inject = ['warehouseService','$scope','$state','$filter','$uibModalInstance','$sce','$compile','$rootScope','$http'];

    app.controller('modalEditWarehouseCtrl', modalEditWarehouseCtrl);
    modalEditWarehouseCtrl.$inject = ['warehouseService', '$scope','$state','$filter','$uibModalInstance','$sce','$compile','$rootScope','warehouse','$http','warehouseService'];

    app.controller('modalDeleteWarehouseCtrl', modalDeleteWarehouseCtrl);
    modalDeleteWarehouseCtrl.$inject = ['warehouseService', '$scope','$state','$filter','$uibModalInstance','$sce','$compile','$rootScope','warehouse','$http','warehouseService'];

    function warehouseCtrl($http, $filter, $state, $scope, $uibModal){
        var self = this; //jshint ignore:line

        function add(size){
          var modalInstance = $uibModal.open({
            templateUrl: './hbr-selfie/dist/routes/warehouse/addwarehouse.template.html',
            controller: 'modalAddWarehouseCtrl',
            controllerAs:'modalAddWarehouse',
            size: size
          });
        }

        function edit(size, warehouse){
          var modalInstance = $uibModal.open({
            templateUrl: './hbr-selfie/dist/routes/warehouse/editwarehouse.template.html',
            controller: 'modalEditWarehouseCtrl',
            controllerAs:'modalEditWarehouse',
            size: size,
            resolve: {
              warehouse: function () {
                return warehouse;
              }
            }
          });
        }
        function deleteWarehouse(size, warehouse){
          var modalInstance = $uibModal.open({
            templateUrl: './hbr-selfie/dist/routes/warehouse/deletewarehouse.template.html',
            controller: 'modalDeleteWarehouseCtrl',
            controllerAs:'modalDeleteWarehouse',
            size: size,
            resolve: {
              warehouse: function () {
                return warehouse;
              }
            }
          });
        }

        function newWarehouse () {
          add('md');
        }

        function editWarehouse (warehouse) {
          edit('md', warehouse);
        }

        function removeWarehouse (warehouse) {
          deleteWarehouse('md', warehouse);
        }

        function init() {
          $http.get('./hbr-selfie/dist/php/warehouse.php', {
            params: {
              action: 'getAll'
            }
          }).then(function(response){
            self.warehouses = response.data.warehouses;
          });
          self.newWarehouse = newWarehouse;
          self.editWarehouse = editWarehouse;
          self.removeWarehouse = removeWarehouse;
        }
        init();
      }
      function modalAddWarehouseCtrl(warehouseService, $scope, $state, $filter, $uibModalInstance, $sce, $compile, $rootScope){
        var self = this;        
        function cancel () {         
          $uibModalInstance.dismiss('cancel');
        };

        function addWarehouse () {
          warehouseService.add_warehouse(self.warehouse)
          .then(function(response){
            if(!response.data.errors){
             $uibModalInstance.dismiss('cancel');
             $state.go('dashboard.warehouse',{},{reload: true});
           } else {
            if(response.data.errors.existingEmail){
              self.existingEmail = response.data.errors.existingEmail;
              self.registerForm.email.$invalid = true;
              self.registerForm.$invalid = true;
            } else {
              self.existingEmail = false;
              self.registerForm.email.$invalid = false;
              self.registerForm.email.$valid = true;
            }
            if(response.data.errors.passwordError){
              self.passwordError = response.data.errors.passwordError;
              self.registerForm.password.$invalid = true;
              self.registerForm.password2.$invalid = true;
              self.registerForm.$invalid = true;
            } else {
              self.passwordError  = false;
              self.registerForm.password.$invalid = false;
              self.registerForm.password.$valid = true;
              self.registerForm.password2.$invalid = false;
              self.registerForm.password2.$valid = true;
            }
            if(response.data.errors.telError){
              self.telError = response.data.errors.telError;
              self.registerForm.tel.$invalid = true;
              self.registerForm.cel.$invalid = true;
              self.registerForm.$invalid = true;

            } else {
              self.telError = false;
              self.registerForm.tel.$invalid = false;
              self.registerForm.tel.$valid = true;
              self.registerForm.cel.$invalid = false;
              self.registerForm.cel.$valid = true;
            }
          }
        });
        };
        function init(){
          self.warehouse = {};

          self.cancel = cancel;
          self.addWarehouse = addWarehouse;
        }
        init();
      }
      function modalEditWarehouseCtrl(warehouseService, $scope,$state,$filter, $uibModalInstance,$sce,$compile,$rootScope,warehouse,$http){
        var self = this;        
        function cancel () {
          $uibModalInstance.dismiss('cancel');
        };
        function editWarehouse () {
          warehouseService.editWarehouse(self.warehouse)
          .then(function(response){
            if(!response.data.errors){
              $uibModalInstance.dismiss('cancel');
              $state.go('dashboard.warehouse',{},{reload: true});
            }
          });
        };
        function init(){
          self.warehouse = warehouse;
          self.previousEmail = warehouse.email;
          self.cancel = cancel;
          self.editWarehouse = editWarehouse;
        }
        init();
      }
      function modalDeleteWarehouseCtrl(warehouseService, $scope,$state,$filter, $uibModalInstance,$sce,$compile,$rootScope,warehouse,$http){
        var self = this;        
        function cancel () {
          $uibModalInstance.dismiss('cancel');
        };
        function deleteWarehouse () {
          warehouseService.deleteWarehouse(self.warehouse)
          .then(function(response){
            if(!response.data.errors){
              $uibModalInstance.dismiss('cancel');
              $state.go('dashboard.warehouse',{},{reload: true});
            }
          });
        };
        function init(){
          self.warehouse = warehouse;
          self.cancel = cancel;
          self.deleteWarehouse = deleteWarehouse;
        }
        init();
      }
    }
    module.exports = warehouseController;