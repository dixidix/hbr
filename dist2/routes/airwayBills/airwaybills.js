function airwayController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('airwayCtrl', airwayCtrl);

    airwayCtrl.$inject = ['$http', '$state', 'airwayService', 'usersService', '$filter', '$scope', '$uibModal', '$sce', '$compile'];

    app.controller('ProcessModalCtrl', ProcessModalCtrl);
    ProcessModalCtrl.$inject = ['$scope', '$state', '$filter', '$uibModalInstance', '$uibModal', '$sce', '$compile', '$rootScope', 'awb', 'products', '$http', 'airwayService', '$q'];

    function airwayCtrl($http, $state, airwayService, usersService, $filter, $scope, $uibModal, $sce, $compile) {
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
                    awb: function () {
                        return awb;
                    },
                    products: function () {
                        return products;
                    },
                }
            });
        }

        function processAirwayBill(awb, products) {
            openModal('md', awb, products);
        }

        function init() {
            $scope.filtered = [];
            self.guides = [];
            var clientType = sessionStorage.getItem('clientType');
            var isAdmin = sessionStorage.getItem('isAdmin');
            airwayService.get_finished_airwaybills().then(function success(response) {

                angular.forEach(response.data.guideBatch, function (guide) {
                    console.log(guide);
                    guide.username = guide.user[0].name + " " + guide.user[0].lastname;
                    guide.warehousename = guide.warehouse[0].name;
                });

                self.guideBatch = response.data.guideBatch;
                if (isAdmin == 0 && clientType == 2) {
                    self.isWh = true;
                    usersService.getPremium().then(function (response) {
                        var temp = [];
                        angular.forEach(self.guideBatch, function (guide) {
                            if (guide.warehouse[0].id == response.data.id) {
                                temp.push(guide);
                            }
                        });
                        self.guides = temp || [];
                    })
                        .catch(function (err) {
                            console.log(err);
                        })
                } else {
                    self.guides = self.guideBatch;
                }

                $scope.totalItems = self.guides.length;
                $scope.currentPage = 1;
                $scope.itemsPerPage = 5;
                $scope.maxSize = 5;
                $scope.setPage = function (pageNo) {
                    $scope.currentPage = pageNo;
                };
                $scope.pageChanged = function () {

                };
                $scope.$watch('search', function (term) {
                    var obj = term;
                    $scope.filtered = $filter('filter')(self.guides, obj);
                    $scope.currentPage = 1;
                });
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
                    self.batch.successUrl = "https://tucourier.com.ar/hbr-selfie/dashboard/shopping/checkout/success/" + response.data;
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
            if (parseFloat(warehouse) > 0.00 && parseFloat(flete) > 0.00) {
                $scope.noCalculated = false;
            }
        }

        function calcTaxes() {
            angular.forEach(self.awb.products, function (value) { self.totalBatchTaxes = (parseFloat(value.total_taxes) + parseFloat(self.totalBatchTaxes)).toFixed(2); });
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
            $rootScope.showSpinner = true;
            self.awb.arrivalDate = new Date(self.batch.arrivalDate).getTime() / 1000;
            self.awb.leaveDate = new Date(self.batch.leaveDate).getTime() / 1000;
            self.awb.estimatedArrivalDate = new Date(self.batch.estimatedArrivalDate).getTime() / 1000;
            self.awb.hbr_tracking = self.batch.hbr_tracking || null;
            self.awb.hbr_postal_provider = self.batch.hbr_postal_provider || null;
            if (self.batch.paymentStatus) {
                self.awb.state = 3;
                if (self.totalWarehouse > 0 && self.totalFlete > 0) {
                    airwayService.updateGuide(self.awb).then(function success(response) {
                        $http.post('./hbr-selfie/dist/php/notifications/payment_success.php', {
                            hbr_tracking: self.awb.hbr_tracking  || null,
                            ventaId: self.awb.ventaId,
                            guide_number: self.awb.number  || null,
                            arrivalDate: self.awb.arrivalDate || null,
                            estimatedArrivalDate: self.awb.estimatedArrivalDate  || null,
                            leaveDate: self.awb.leaveDate  || null,
                            hbr_postal_provider: self.awb.hbr_postal_provider  || null,
                            email: self.awb.user[0].email  || null
                        }).then(function success(response) {
                            $rootScope.showSpinner = false;
                            $uibModalInstance.dismiss('cancel');
                            $state.go($state.current, {}, { reload: true });
                        });
                    });
                }
            }
        }

        function sendPaymentMethod() {
            $rootScope.showSpinner = true;
            self.batch.transfer_total = parseFloat(self.totalButton).toFixed(2);
            self.awb.paymentMethod = self.batch.paymentMethod.value;
            self.awb.transfer_account_number = self.batch.transfer_account_number;
            self.awb.transfer_account_holder_name = self.batch.transfer_account_holder_name;
            self.awb.transfer_bank_name = self.batch.transfer_bank_name;
            self.awb.transfer_cbu = self.batch.transfer_cbu;
            self.awb.transfer_cuit = self.batch.transfer_cuit;
            self.awb.paymentDesc = self.batch.paymentDesc;
            self.awb.billing_total = self.batch.transfer_total;
            self.awb.state = 2;
            self.awb.successUrl = self.batch.successUrl || null;
            self.awb.paymentButton = self.batch.paymentButton || null;
            if (self.awb.paymentMethod && (self.awb.transfer_account_number && self.awb.transfer_account_holder_name && self.awb.transfer_bank_name && self.awb.transfer_cbu && self.awb.transfer_cuit && self.awb.billing_total) || (self.awb.successUrl && self.awb.paymentButton)) {
                airwayService.updateGuide(self.awb)
                    .then(function success(response) {
                        $http.post('./hbr-selfie/dist/php/notifications/payment_method.php', {
                            paymentMethod: self.awb.paymentMethod,
                            ventaId: self.awb.ventaId,
                            guide_number: self.awb.number,
                            paymentButton: String(self.awb.paymentButton),
                            transfer_account_number: self.awb.transfer_account_number,
                            transfer_account_holder_name: self.awb.transfer_account_holder_name,
                            transfer_bank_name: self.awb.transfer_bank_name,
                            transfer_cbu: self.awb.transfer_cbu,
                            transfer_cuit: self.awb.transfer_cuit,
                            paymentDesc: self.awb.paymentDesc,
                            name: self.awb.user.name + " " + self.awb.user.lastname,
                            total: parseFloat(self.totalButton).toFixed(2),
                            email: self.awb.user[0].email
                        }).then(function success(response) {
                            $rootScope.showSpinner = false;
                            $uibModalInstance.dismiss('cancel');
                            $state.go($state.current, {}, { reload: true });
                        });
                    });
            } else if (self.awb.paymentMethod == 3) {
                airwayService.updateGuide(self.awb)
                    .then(function success(response) {
                        $http.post('./hbr-selfie/dist/php/notifications/payment_method.php', {
                            paymentMethod: self.awb.paymentMethod,
                            ventaId: self.awb.ventaId,
                            guide_number: self.awb.number,
                            paymentButton: String(self.awb.paymentButton),
                            transfer_account_number: self.awb.transfer_account_number,
                            transfer_account_holder_name: self.awb.transfer_account_holder_name,
                            transfer_bank_name: self.awb.transfer_bank_name,
                            transfer_cuit: self.awb.transfer_cuit,
                            transfer_cbu: self.awb.transfer_cbu,
                            paymentDesc: self.awb.paymentDesc,
                            name: self.awb.user.name + " " + self.awb.user.lastname,
                            total: parseFloat(self.totalButton).toFixed(2),
                            email: self.awb.user.email
                        }).then(function success(response) {
                            $rootScope.showSpinner = false;
                            $uibModalInstance.dismiss('cancel');
                            $state.go($state.current, {}, { reload: true });
                        });
                    });
            }
        }

        function updateArrivalDate() {
            $rootScope.showSpinner = true;
            self.awb.arrivalDate = new Date(self.batch.arrivalDate).getTime() / 1000;
            self.awb.leaveDate = new Date(self.batch.leaveDate).getTime() / 1000;
            self.awb.state = 3;
            airwayService.updateGuide(self.awb).then(function success(response) {
                $http.post('./hbr-selfie/dist/php/notifications/update_dates.php', {
                    ventaId: self.awb.ventaId,
                    guide_number: self.awb.number,
                    arrivalDate: self.awb.arrivalDate,
                    leaveDate: self.awb.leaveDate,
                    estimatedArrivalDate: self.awb.estimatedArrivalDate,
                    email: self.awb.user.email
                }).then(function success(response) {
                    $rootScope.showSpinner = false;
                    $uibModalInstance.dismiss('cancel');
                    $state.go($state.current, {}, { reload: true });
                });
            });
        }

        function checkIsWh() {
            var clientType = sessionStorage.getItem('clientType');
            var isAdmin = sessionStorage.getItem('isAdmin');
            self.isWh = isAdmin == 0 && clientType == 2 ? true : false;
        }

        function updateWhLeaveDate() {
            $rootScope.showSpinner = true;
            self.awb.wh_leave_date = new Date(self.batch.wh_leave_date).getTime() / 1000;
            console.log(self.awb);
            airwayService.updateGuide(self.awb).then(function success(response) {
                $http.post('./hbr-selfie/dist/php/notifications/wh_notifications.php', {
                    ventaId: self.awb.ventaId,
                    guide_number: self.awb.number,
                    wh_leave_date: self.awb.wh_leave_date,
                    email: self.awb.warehouse[0].email,
                    name: self.awb.warehouse[0].name,
                    user: self.awb.user[0].name + " "+self.awb.user[0].lastname,
                    action: 'whLeaveDate'
                }).then(function success(response) {
                    $http.post('./hbr-selfie/dist/php/notifications/wh_notifications_user.php', {
                        ventaId: self.awb.ventaId,
                        guide_number: self.awb.number,
                        wh_leave_date: self.awb.wh_leave_date,
                        name: self.awb.warehouse[0].name,
                        email: self.awb.user[0].email,
                        action: 'whLeaveDate'
                    }).then(function(){
                        $rootScope.showSpinner = false;
                        $uibModalInstance.dismiss('cancel');
                        $state.go($state.current, {}, { reload: true });
                    });
                });
            });
        }

        function saveDates () {
            $rootScope.showSpinner = true;
            self.awb.arrivalDate = new Date(self.batch.arrivalDate).getTime() / 1000;
            self.awb.leaveDate = new Date(self.batch.leaveDate).getTime() / 1000;
             airwayService.updateGuide(self.awb).then(function success(response) {
                $rootScope.showSpinner = false;
                $uibModalInstance.dismiss('cancel');
                $state.go($state.current, {}, { reload: true });
             }).catch(function(err){
                 console.log(err);
             });
        }

        function markAsDelivered () {
            $rootScope.showSpinner = true;
            self.awb.arrivalDate = new Date(self.batch.arrivalDate).getTime() / 1000;
            self.awb.leaveDate = new Date(self.batch.leaveDate).getTime() / 1000;
            self.awb.estimatedArrivalDate = new Date(self.batch.estimatedArrivalDate).getTime() / 1000;
            self.awb.state = 4;
            airwayService.updateGuide(self.awb).then(function success(response) {
                $http.post('./hbr-selfie/dist/php/notifications/update_dates.php', {
                    ventaId: self.awb.ventaId,
                    guide_number: self.awb.number,
                    arrivalDate: self.awb.arrivalDate,
                    leaveDate: self.awb.leaveDate,
                    estimatedArrivalDate: self.awb.estimatedArrivalDate,
                    email: self.awb.user.email,
                    state: self.awb.state,
                }).then(function success(response) {
                    $rootScope.showSpinner = false;
                    $uibModalInstance.dismiss('cancel');
                    $state.go($state.current, {}, { reload: true });
                });
            });
        }

        function init() {
            checkIsWh();
            self.saveDates = saveDates;
            self.updateWhLeaveDate = updateWhLeaveDate;
            self.markAsDelivered = markAsDelivered;
            self.cancel = cancel;
            $rootScope.showSpinner = false;
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
            self.batch.hbr_tracking = self.awb.hbr_tracking;
            self.batch.hbr_postal_provider = self.awb.hbr_postal_provider;
            self.updateArrivalDate = updateArrivalDate;
            self.batch.paymentButton = $sce.trustAsHtml(self.awb.paymentButton);
            self.batch.successUrl = self.awb.successUrl;
            $scope.noCalculated = true;
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            if(self.awb.arrivalDate){
                self.batch.arrivalDate = new Date(self.awb.arrivalDate * 1000);
            }
            if(self.awb.leaveDate){
                self.batch.leaveDate = new Date(self.awb.leaveDate  * 1000);
            }
            if(self.awb.estimatedArrivalDate){
                self.batch.estimatedArrivalDate = new Date(self.awb.estimatedArrivalDate * 1000);
            }
            if(self.awb.wh_leave_date){
                self.batch.wh_leave_date = new Date(self.awb.wh_leave_date * 1000);
            }
            self.batch.paymentStatus = self.awb.state == 3 || self.awb.state == 4 ? true : false;

            self.calcWarehouse = calcWarehouse;
            self.calcFlete = calcFlete;
            self.calcButton = calcButton;
            self.saveShipment = saveShipment;
            self.saveWarehouse = saveWarehouse;
            self.finishAwb = finishAwb;
            calcButton(self.totalWarehouse, self.totalFlete);
            calcTaxes();
            self.paymentMethods = [
                { value: 0, name: '-- Select Payment Method --' },
                { value: 1, name: 'Todo Pago' },
                { value: 2, name: 'Bank Transfer' },
                { value: 3, name: 'Cash' }
            ];
            self.sendPaymentMethod = sendPaymentMethod;
            self.batch.paymentMethod = {}

            self.batch.paymentMethod.value = parseInt(self.awb.paymentMethod) || 0;
            self.batch.transfer_account_number = self.awb.transfer_account_number;
            self.batch.transfer_account_holder_name = self.awb.transfer_account_holder_name;
            self.batch.transfer_bank_name = self.awb.transfer_bank_name;
            self.batch.transfer_cbu = self.awb.transfer_cbu;
            self.batch.transfer_cuit = self.awb.transfer_cuit;
            self.batch.paymentDesc = self.awb.paymentDesc;
        }
        init();
    }
}
module.exports = airwayController;