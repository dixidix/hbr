function airwayListController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('airwayListCtrl', airwayListCtrl);

    airwayListCtrl.$inject = ['$http', '$state', 'airwayService', '$filter', '$scope', '$uibModal', '$sce', '$compile', '$rootScope', 'authenticationService'];

    app.controller('airwayListModalCtrl', airwayListModalCtrl);
    airwayListModalCtrl.$inject = ['$scope', '$state', '$filter', '$uibModalInstance', '$uibModal', '$sce', '$compile', '$rootScope', 'awb', 'products', '$http', 'airwayService', '$q'];

    function airwayListCtrl($http, $state, airwayService, $filter, $scope, $uibModal, $sce, $compile, $rootScope, authenticationService) {
        var self = this; //jshint ignore:line

        function openModal(size, awb, products) {
            var modalInstance = $uibModal.open({
                templateUrl: 'airway-desc.html',
                backdrop: 'static',
                keyboard: false,
                controller: 'airwayListModalCtrl',
                controllerAs: 'airwaybill_desc',
                size: size,
                resolve: {
                    awb: function() {
                        return awb;
                    },
                    products: function() {
                        return products;
                    },
                }
            });
        }

        function seeMore(awb, products) {
            openModal('md', awb, products);
        }

        function init() {
            $rootScope.showSpinner = true;
            authenticationService.checkAuth()
                .then(function(response) {
                    self.uid = response.data.uid;
                    airwayService.get_finished_airwaybillsByUserId(self.uid)
                        .then(function success(response) {
                            self.guides = response.data.guideBatch;

                            angular.forEach(self.guides, function(guide) {
                                if (guide.paymentButton) {
                                    guide.paymentButton = $sce.trustAsHtml(guide.paymentButton);
                                }
                            });
                            $rootScope.showSpinner = false;
                        });
                });
            self.seeMore = seeMore;
        }
        init();

        setTimeout(setLink, 300);

        function setLink() {
            $('[rel="payment_button"]')
                .find('a')
                .each(function(index, link) {
                    $(link).attr('target', '_blank');
                });
        }
    }


    function airwayListModalCtrl($scope, $state, $filter, $uibModalInstance, $uibModal, $sce, $compile, $rootScope, awb, products, $http, airwayService, $q) {

        var self = this;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };



        function init() {
            self.cancel = cancel;
            self.awb = awb;
            console.log(self.awb);
            self.products = products;
        }
        init();
    }
}
module.exports = airwayListController;