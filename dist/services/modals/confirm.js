function confirmModalService(angular, app) {

    app.service('confirmModalService', confirmModalService);

    confirmModalService.$inject = ['$http'];

    function confirmModalService($http) {

        this.show = function () {

            var modalInstance = $uibModal.open({
                templateUrl: 'processPayment.html',
                backdrop: 'static',
                keyboard: false,
                controller: 'modaProcessCtrl',
                controllerAs: 'modaProcess',
                size: size,
                resolve: {
                    venta: function () {
                        return venta;
                    },
                    bills: function () {
                        return bills;
                    },
                }
            });
        }
    }
}
module.exports = confirmModalService;