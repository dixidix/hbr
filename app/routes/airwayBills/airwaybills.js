function airwayController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('airwayCtrl', airwayCtrl);

    airwayCtrl.$inject = ['$http', '$state', 'airwayService', '$filter', '$scope', '$uibModal', '$sce', '$compile'];

    app.controller('ProcessModalCtrl', ProcessModalCtrl);
    ProcessModalCtrl.$inject = ['$scope', '$state', '$filter', '$uibModalInstance', '$uibModal', '$sce', '$compile', '$rootScope', 'awb', 'products', '$http', 'airwayService', '$q'];

    function airwayCtrl($http, $state, airwayService, $filter, $scope, $uibModal, $sce, $compile) {
        var self = this; //jshint ignore:line

        function openModal(size, awb, products) {
            var modalInstance = $uibModal.open({
                templateUrl: 'process-airway.html',
                backdrop: 'static',
                keyboard: false,
                controller: 'ProcessModalCtrl',
                controllerAs: 'airwaybill',
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

        function processAirwayBill(awb, products) {
            openModal('md', awb, products);
        }

        function init() {

            airwayService.get_finished_airwaybills().then(function success(response) {
                self.guides = response.data.guideBatch;
            });

            self.processAirwayBill = processAirwayBill;
        }
        init();
    }


    function ProcessModalCtrl($scope, $state, $filter, $uibModalInstance, $uibModal, $sce, $compile, $rootScope, awb, products, $http, airwayService, $q) {

        var self = this;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        function finish() {
            console.log("saving");
        };

        function generateToken() {
            $http.post('./hbr-selfie/dist/php/encrypt.php', { timestamp: Math.round((new Date()).getTime() / 1000) })
                .then(function success(response) {
                    self.batch.successUrl = "http://tucourier.com.ar/hbr-selfie/dashboard/shopping/checkout/success/" + response.data;
                    self.batch.token = response.data;
                });
        }


        function calcWarehouse() {
            self.totalWarehouse = (parseFloat(self.batch.wh_entry) + parseFloat(self.batch.adic_kg) + parseFloat(self.batch.adic_charges)).toFixed(2);
            calcButton(self.totalWarehouse, self.totalFlete);
        }

        function calcFlete() {
            self.totalFlete = (parseFloat(self.batch.flete_internacional) * parseFloat(self.awb.weight)).toFixed(2);
            calcButton(self.totalWarehouse, self.totalFlete);
        }

        function calcButton(warehouse, flete) {
            self.totalButton = (parseFloat(warehouse) + parseFloat(flete)).toFixed(2);
        }

        function calcTaxes() {
            angular.forEach(self.awb.products, function(value) { self.totalBatchTaxes = (parseFloat(value.total_taxes) + parseFloat(self.totalBatchTaxes)).toFixed(2); });
        }

        function saveShipment() {

            self.awb.shipment_international = self.batch.flete_internacional || null;
            self.awb.shipment_total = self.totalFlete || null;
            self.awb.state = 1;
            $scope.shipmentSave = "";
            airwayService.updateGuide(self.awb).then(function success(response) {
                $scope.shipmentSave = "Saved";
            });
        }

        function saveWarehouse() {

            self.awb.warehouse_enter = self.batch.wh_entry || null;
            self.awb.warehouse_aditional_weight = self.batch.adic_kg || null;
            self.awb.warehouse_aditional_charges = self.batch.adic_charges || null;
            self.awb.warehouse_total = self.totalWarehouse || null;
            self.awb.state = 1;
            $scope.warehouseSave = "";
            airwayService.updateGuide(self.awb).then(function success(response) {
                $scope.warehouseSave = "Saved";
            });

        }

        function finishAwb() {

            self.awb.arrivalDate = new Date(self.batch.arrivalDate).getTime() / 1000;
            self.awb.paymentGatewayUrl = self.batch.paymentGatewayUrl || null;
            self.awb.token = self.batch.token || null;
            self.awb.successUrl = self.batch.successUrl || null;
            self.awb.billing_total = self.totalButton || null;
            self.awb.hbr_tracking = self.batch.hbr_tracking || null;
            self.awb.hbr_postal_provider = self.batch.hbr_postal_provider || null;
            self.awb.state = 2;

            if (self.totalWarehouse > 0 && self.totalFlete > 0) {
                airwayService.updateGuide(self.awb).then(function success(response) {
                    $uibModalInstance.dismiss('cancel');
                    $state.go($state.current, {}, { reload: true });
                });
            }
        }

        function init() {
            console.log(awb);
            self.cancel = cancel;
            self.awb = awb;
            self.products = products;
            self.collapsedWarehouse = true;
            self.collapsedFlete = true;
            self.generateToken = generateToken;
            $scope.shipmentSave = "";
            $scope.warehouseSave = "";
            self.batch = {};
            self.awb.weight = parseFloat(self.awb.weight).toFixed(2);
            self.awb.price = parseFloat(self.awb.price).toFixed(2);
            self.totalTax = [];
            self.totalWarehouse = parseFloat(self.awb.warehouse_total).toFixed(2);
            self.totalFlete = parseFloat(self.awb.shipment_total).toFixed(2);
            self.totalButton = parseFloat(self.awb.billing_total).toFixed(2);
            self.batch.wh_entry = parseFloat(self.awb.warehouse_enter).toFixed(2);
            self.batch.adic_kg = parseFloat(self.awb.warehouse_aditional_weight).toFixed(2);
            self.batch.adic_charges = parseFloat(self.awb.warehouse_aditional_charges).toFixed(2);
            self.batch.flete_internacional = parseFloat(self.awb.shipment_international).toFixed(2);

            self.batch.successUrl = self.awb.successUrl;
            console.log(self.awb);
            self.batch.paymentGatewayUrl = self.awb.paymentGatewayUrl;
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            d.setUTCSeconds(self.awb.arrivalDate);
            self.batch.arrivalDate = d;

            self.calcWarehouse = calcWarehouse;
            self.calcFlete = calcFlete;
            self.calcButton = calcButton;
            self.saveShipment = saveShipment;
            self.saveWarehouse = saveWarehouse;
            self.finishAwb = finishAwb;
            calcButton(self.totalWarehouse, self.totalFlete);
            calcTaxes();
        }
        init();
    }
}
module.exports = airwayController;