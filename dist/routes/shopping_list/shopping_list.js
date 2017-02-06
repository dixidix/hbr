function shoppingListController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('shoppingListCtrl', shoppingListCtrl);
    shoppingListCtrl.$inject = ['$http', '$filter', '$state', '$scope', '$rootScope', '$uibModal', 'authenticationService'];

    app.controller('modalMoreInfoCtrl', modalMoreInfoCtrl);
    modalMoreInfoCtrl.$inject = ['$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', '$rootScope', 'items', 'venta', '$http'];

    function shoppingListCtrl($http, $filter, $state, $scope, $rootScope, $uibModal, authenticationService) {
        var self = this; //jshint ignore:line

        function pay(venta) {
            $state.go('dashboard.checkout', { paymentGatewayUrl: venta.paymentGatewayUrl, reload: true });
        }

        function downloadBill(bill) {

        }

        function openModal(size, items) {
            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                controller: 'modalMoreInfoCtrl',
                controllerAs: 'seeMore',
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

        function moreInfo(items) {
            openModal('md', items);
        }

        function init() {
            $rootScope.showSpinner = true;
            self.ventas = [];
            authenticationService.checkAuth().success(function (response) {
                $http.get('./hbr-selfie/dist/php/get_batch.php', { params: { action: "getByUserId", id: response.uid } })
                    .success(function (response) {
                        if(response.ventas.length){
                        angular.forEach(response.ventas, function(venta){
                            venta.timestamp = new Date(parseInt(venta.timestamp));
                        });

                        self.ventas = response.ventas;
                        }
                        self.moreInfo = moreInfo;
                        self.downloadBill = downloadBill;
                        self.pay = pay;
                        $rootScope.showSpinner = false;
                    });
            });
        }

        init();
    }

    function modalMoreInfoCtrl($scope, $state, $filter, $uibModalInstance, $sce, $compile, $rootScope, items, venta, $http) {
        var self = this;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        function init() {
            self.bills = items;
            self.venta = venta[0];
            self.cancel = cancel;
            console.log(self.bills);
        }

        init();
    }
}
module.exports = shoppingListController;