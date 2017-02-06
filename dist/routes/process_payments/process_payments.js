function processPaymentsController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('processPaymentsCtrl', processPaymentsCtrl);
    processPaymentsCtrl.$inject = ['$http', '$filter', '$state', '$scope', '$uibModal', '$rootScope','authenticationService'];

    app.controller('modaProcessCtrl', modaProcessCtrl);
    modaProcessCtrl.$inject = ['$scope', '$state', '$filter', '$uibModalInstance', '$uibModal', '$sce', '$compile', '$rootScope', 'venta', 'bills', '$http'];

    app.controller('makeGuidesModalCtrl', makeGuidesModalCtrl);
    makeGuidesModalCtrl.$inject = ['$scope', '$state', '$filter', '$uibModalInstance', '$uibModal', '$sce', '$compile', '$rootScope', 'venta', 'bills', '$http', 'airwayService', '$q'];

    function processPaymentsCtrl($http, $filter, $state, $scope, $uibModal, $rootScope,authenticationService) {
        var self = this; //jshint ignore:line

        function processPaymentModal(size, venta, bills) {
            var modalInstance = $uibModal.open({
                templateUrl: 'processPayment.html',
                backdrop: 'static',
                keyboard: false,
                controller: 'modaProcessCtrl',
                controllerAs: 'modaProcess',
                size: size,
                resolve: {
                    venta: function() {
                        return venta;
                    },
                    bills: function() {
                        return bills;
                    },
                }
            });
        }


        function makeGuidesModal(size, venta, bills) {
            var modalInstance = $uibModal.open({
                templateUrl: 'makeGuides.html',
                backdrop: 'static',
                keyboard: false,
                controller: 'makeGuidesModalCtrl',
                controllerAs: 'guides',
                size: size,
                resolve: {
                    venta: function() {
                        return venta;
                    },
                    bills: function() {
                        return bills;
                    },
                }
            });
        }

        function processPayment(venta, bills) {
            processPaymentModal('md', venta, bills);
        }

        function setGuides(venta, bills) {
            makeGuidesModal('md', venta, bills);
        }

        function init() {
            $rootScope.showSpinner = true;
             self.ventas = [];
             authenticationService.checkAuth().then(function(response) {
                 if(response.data.isAdmin == 1){
                    $http.get('./hbr-selfie/dist/php/get_batch.php', { params: { action: "getAll" } })
                        .then(function(response) {
                            angular.forEach(response.data.ventas, function(value, key) {
                                response.data.ventas[key].parcial_price = parseFloat(value.parcial_price).toFixed(2);
                                response.data.ventas[key].total = parseFloat(value.total).toFixed(2);
                                response.data.ventas[key].peso_total = parseFloat(value.peso_total).toFixed(2);
                                response.data.ventas[key].totalWarehouse = "0";
                                response.data.ventas[key].totalFlete = "0";
                                response.data.ventas[key].totalImpuestos = "0";
                                $rootScope.showSpinner = false;
                            });

                            self.ventas = response.data.ventas;
                            self.processPayment = processPayment;
                            self.setGuides = setGuides;
                        });
                 } else {
                     if(response.data.client_type){
                        $http.get('./hbr-selfie/dist/php/get_batch.php', { params: { action: "getByWhId", whId: response.data.uid} })
                        .then(function(response) {
                            angular.forEach(response.data.ventas, function(value, key) {
                                response.data.ventas[key].parcial_price = parseFloat(value.parcial_price).toFixed(2);
                                response.data.ventas[key].total = parseFloat(value.total).toFixed(2);
                                response.data.ventas[key].peso_total = parseFloat(value.peso_total).toFixed(2);
                                response.data.ventas[key].totalWarehouse = "0";
                                response.data.ventas[key].totalFlete = "0";
                                response.data.ventas[key].totalImpuestos = "0";
                                $rootScope.showSpinner = false;
                            });

                            angular.forEach(response.data.ventas, function(venta){
                                if(venta.bills.length){
                                    self.ventas.push(venta);
                                }
                            });
                            self.processPayment = processPayment;
                            self.setGuides = setGuides;
                        });
                     }
                 }
                });
        }

        init();
    }

    function modaProcessCtrl($scope, $state, $filter, $uibModalInstance, $uibModal, $sce, $compile, $rootScope, venta, bills, $http) {
        var self = this;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        function generateToken() {
            $http.post('./hbr-selfie/dist/php/encrypt.php', { timestamp: Math.round((new Date()).getTime() / 1000) })
                .then(function success(response) {
                    self.successUrl = "http://tucourier.com.ar/hbr-selfie/dashboard/shopping/checkout/success/" + response.data;
                    self.token = response.data;
                });
        }

        function send() {
            $http.put('./hbr-selfie/dist/php/shopping.php', {
                    paymentGatewayUrl: self.paymentGatewayUrl,
                    id: self.venta.id,
                    token: self.token
                })
                .then(function success(response) {
                    $http.post('./hbr-selfie/dist/php/cargar_venta.php', {
                        lote: self.venta.id,
                        name: self.user.name + " " + self.user.lastname,
                        email: self.user.email
                    }).then(function success(response) {
                        $state.reload();
                        $uibModalInstance.dismiss('cancel');
                    });
                });

        };

        function processProduct(product) {
            self.currentProduct = {};
            self.currentProduct.id = product.id;
            self.currentProduct.category = product.category_name;
            self.currentProduct.product_name = product.product_name;
            self.currentProduct.price = parseFloat(product.price / product.quantity).toFixed(2);
            self.currentProduct.flete = parseFloat((Math.ceil((product.weight / product.quantity) * 2) / 2) * 2.80).toFixed(2);
            self.currentProduct.seguro = parseFloat(10).toFixed(2);
            self.currentProduct.derecho = parseFloat(0).toFixed(2);
            self.currentProduct.derecho_percent = parseFloat(0).toFixed(2);
            self.currentProduct.estadistica = parseFloat(0).toFixed(2);
            self.currentProduct.estadistica_percent = parseFloat(0.50).toFixed(2);
            self.currentProduct.base_iva = parseFloat(0).toFixed(2);
            self.currentProduct.documentacion = parseFloat(0).toFixed(2);
            self.currentProduct.iva_percent = parseFloat(21).toFixed(2);
            self.currentProduct.iva_adic_percent = parseFloat(0).toFixed(2);
            self.currentProduct.iva_adic = parseFloat(0).toFixed(2);
            self.currentProduct.total_iva = parseFloat(0).toFixed(2);
            calcProduct();
            self.showProductInfo = true;
        }

        function calcProduct() {
            self.currentProduct.price = parseFloat(self.currentProduct.price).toFixed(2);
            self.currentProduct.flete = parseFloat(self.currentProduct.flete).toFixed(2);
            self.currentProduct.seguro = parseFloat(self.currentProduct.seguro).toFixed(2);
            self.currentProduct.cif = parseFloat(self.currentProduct.cif).toFixed(2);

            self.currentProduct.cif = (parseFloat(self.currentProduct.price) + parseFloat(self.currentProduct.flete) + parseFloat(self.currentProduct.seguro)).toFixed(2);
            calcRights();
            calcBaseIva();
        }

        function calcRights() {
            self.currentProduct.derecho_percent = parseFloat(self.currentProduct.derecho_percent).toFixed(2);
            self.currentProduct.estadistica_percent = parseFloat(self.currentProduct.estadistica_percent).toFixed(2);
            if (self.currentProduct.derecho_percent > 0) {
                self.currentProduct.derecho = ((parseFloat(self.currentProduct.cif) * parseFloat(self.currentProduct.derecho_percent)) / 100).toFixed(2);
            }
            if (self.currentProduct.estadistica_percent > 0) {
                self.currentProduct.estadistica = ((parseFloat(self.currentProduct.cif) * parseFloat(self.currentProduct.estadistica_percent)) / 100).toFixed(2);
            }

            if (self.currentProduct.derecho && self.currentProduct.estadistica) {
                self.currentProduct.total_derechos = (parseFloat(self.currentProduct.derecho) + parseFloat(self.currentProduct.estadistica)).toFixed(2);
                calcBaseIva();
            }
        }

        function calcBaseIva() {
            self.currentProduct.base_iva = parseFloat(self.currentProduct.base_iva).toFixed(2);
            self.currentProduct.iva = parseFloat(self.currentProduct.iva).toFixed(2);
            self.currentProduct.iva_percent = parseFloat(self.currentProduct.iva_percent).toFixed(2);

            self.currentProduct.base_iva = (parseFloat(self.currentProduct.cif) + parseFloat(self.currentProduct.total_derechos) + parseFloat(self.currentProduct.documentacion)).toFixed(2);
            if (self.currentProduct.base_iva > 0 && self.currentProduct.iva_percent > 0) {
                self.currentProduct.iva = parseFloat((parseFloat(self.currentProduct.iva_percent) * parseFloat(self.currentProduct.base_iva)) / 100).toFixed(2);
            }

            if (self.currentProduct.base_iva > 0 && self.currentProduct.iva_adic_percent > 0) {
                self.currentProduct.iva_adic = parseFloat((parseFloat(self.currentProduct.iva_adic_percent) * parseFloat(self.currentProduct.base_iva)) / 100).toFixed(2);
            }

            self.currentProduct.total_iva = (parseFloat(self.currentProduct.iva) + parseFloat(self.currentProduct.iva_adic)).toFixed(2);
            self.currentProduct.total = (parseFloat(self.currentProduct.base_iva) + parseFloat(self.currentProduct.total_iva)).toFixed(2);
            angular.forEach(self.products, function(key, value) {
                if (key.id == self.currentProduct.id) {
                    self.products[value].total_taxes = self.currentProduct.total;
                }
            });
        }

        function calcWarehouse() {
            self.totalWarehouse = (parseFloat(self.batch.wh_entry) + parseFloat(self.batch.adic_kg) + parseFloat(self.batch.adic_charges)).toFixed(2);
            calcButton(self.totalWarehouse, self.totalFlete);
        }

        function calcFlete() {
            self.totalFlete = (parseFloat(self.batch.flete_internacional) * parseFloat(self.venta.peso_total)).toFixed(2);
            calcButton(self.totalWarehouse, self.totalFlete);
        }

        function calcButton(warehouse, flete) {
            self.totalButton = (parseFloat(warehouse) + parseFloat(flete)).toFixed(2);
        }

        function calcTaxes() {
            angular.forEach(self.products, function(product) {
                processProduct(product);
            });
            self.showProductInfo = false;
            angular.forEach(self.products, function(value) { self.totalBatchTaxes = (parseFloat(value.total_taxes) + parseFloat(self.totalBatchTaxes)).toFixed(2); });
        }


        function init() {
            self.venta = venta;
            self.bills = bills;
            self.batch = {};
            self.venta.peso_total = parseFloat(self.venta.peso_total).toFixed(2);
            self.venta.parcial_price = parseFloat(self.venta.parcial_price).toFixed(2);
            $http.get('./hbr-selfie/dist/php/users.php', { params: { action: "getUserById", id: self.venta.uid } })
                .then(function(response) {
                    self.user = response.data;
                });
            self.totalTax = [];
            self.cancel = cancel;
            self.collapsedWarehouse = true;
            self.collapsedFlete = true;
            self.send = send;
            self.totalBatchTaxes = parseFloat(0).toFixed(2);
            self.showProductInfo = false;
            self.generateToken = generateToken;
            self.processProduct = processProduct;
            self.calcProduct = calcProduct;
            self.calcRights = calcRights;
            self.calcBaseIva = calcBaseIva;
            self.totalWarehouse = parseFloat(0).toFixed(2);
            self.totalFlete = parseFloat(0).toFixed(2);
            self.totalButton = parseFloat(0).toFixed(2);
            self.batch.wh_entry = parseFloat(0).toFixed(2);
            self.batch.adic_kg = parseFloat(0).toFixed(2);
            self.batch.adic_charges = parseFloat(0).toFixed(2);
            self.batch.guide_amount = parseInt(0);
            self.batch.flete_internacional = parseFloat(0).toFixed(2);
            self.calcWarehouse = calcWarehouse;
            self.calcFlete = calcFlete;
            self.calcButton = calcButton;
            calcTaxes();
        }

        init();
    }

    function makeGuidesModalCtrl($scope, $state, $filter, $uibModalInstance, $uibModal, $sce, $compile, $rootScope, venta, bills, $http, airwayService, $q) {
        var self = this;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        function selectBill(bill) {

            angular.forEach(self.bills, function(bills) {
                if (bill.bill_id !== bills.bill_id) {
                    bills.isOpen = false;
                }
            });

            bill.isOpen = !bill.isOpen;

            self.selectedBill = bill.isOpen ? bill : {};

        }

        function new_guide() {
            if (!self.guideBatch.length) {
                self.guideNumber++;
                self.guideBatch.push({ number: self.guideNumber, products: [], quantity: '', weight: '', price: '' });
            } else {
                self.guideNumber = parseInt(self.guideBatch.length) + 1;
                self.guideBatch.push({ number: self.guideNumber, products: [], quantity: '', weight: '', price: '' });
            }
        }

        function addToGuide(product, bill, guideNumber, amount) {

            self.venta.total_remaining_quantity = parseInt(parseInt(self.venta.total_remaining_quantity) - parseInt(amount));
            var ExceedAmount = 0;
            angular.forEach(self.guideBatch, function(guide) {
                angular.forEach(bill.products, function(value) {
                    if (value.product_id == product.product_id) {
                        if (value.quantity > 0) {
                            if (guide.number === guideNumber) {
                                var tmp_prod = angular.copy(value);

                                //check if product is already on the list								
                                tmp_prod.exist = $filter('filter')(guide.products, { product_id: tmp_prod.product_id })[0] !== undefined ? true : false;

                                if (!tmp_prod.exist) {
                                    tmp_prod.quantity = parseInt(amount);
                                    guide.products.push(tmp_prod);
                                    value.remaining_quantity = parseInt(value.remaining_quantity) - parseInt(amount);
                                    bill.remaining_quantity = parseInt(bill.remaining_quantity) - parseInt(amount);
                                } else {
                                    var filteredProduct = $filter('filter')(guide.products, { product_id: tmp_prod.product_id })[0];
                                    filteredProduct.quantity = parseInt(parseInt(filteredProduct.quantity) + parseInt(amount));
                                    value.remaining_quantity = parseInt(value.remaining_quantity) - parseInt(amount);
                                    bill.remaining_quantity = parseInt(bill.remaining_quantity) - parseInt(amount);
                                }
                                guide.quantity = parseInt(guide.quantity || 0) + parseInt(amount || 0);
                                guide.weight = parseFloat(parseFloat(guide.weight || 0) + parseFloat(parseFloat(product.real_weight || product.weight || 0) * amount)).toFixed(2);
                                guide.price = parseFloat(parseFloat(guide.price || 0) + parseFloat(parseFloat(product.price || 0) * amount)).toFixed(2);
                                guide.ventaId = self.venta.id;
                                guide.whId = bill.whId;
                                if (guide.weight > 40 || guide.price > 900) {
                                    $('#guide_list_' + guide.number).addClass('row-warning');
                                    self.danger_msg = "";
                                    if (guide.weight >= 50 || guide.price >= 1000) {
                                        $('#guide_list_' + guide.number).removeClass('row-warning');
                                        $('#guide_list_' + guide.number).addClass('row-danger');
                                        ExceedAmount = ++ExceedAmount;

                                    }
                                } else {
                                    $('#guide_list_' + guide.number).removeClass('row-warning');
                                    $('#guide_list_' + guide.number).removeClass('row-danger');
                                }
                            }
                        }
                    }
                });
            });
            self.danger_msg = ExceedAmount > 0 ? "Has Excedido el limite de 50 Kg o U$D 1,000.00" : "";
            if (bill.products.length == 0) {
                self.hideTable = true;
            } else {
                self.hideTable = false;
            }
            self.selectedGuide = null;
            self.selectedQuantity = null;
        }

        function removeProduct(product, guide) {
            angular.forEach(self.bills, function(bill) {
                angular.forEach(bill.products, function(value) {
                    if (value.product_id == product.product_id) {
                        value.remaining_quantity = parseInt(parseInt(value.remaining_quantity) + parseInt(product.quantity));
                        bill.remaining_quantity = parseInt(parseInt(bill.remaining_quantity) + parseInt(product.quantity));
                        self.venta.total_remaining_quantity = parseInt(parseInt(self.venta.total_remaining_quantity) + parseInt(product.quantity));
                        self.venta.guide_amount = self.guideBatch.length;
                        airwayService.updateProduct(value);
                        airwayService.updateBill(bill);
                        airwayService.updateVenta(self.venta);
                    }
                });
            });
            angular.forEach(guide.products, function(value, index) {
                if (value.product_id == product.product_id) {

                    guide.products.splice(index, 1);
                    guide.quantity = parseInt(parseInt(guide.quantity) - parseInt(product.quantity));
                    guide.weight = parseFloat(parseFloat(guide.weight) - (parseFloat(product.real_weight) * product.quantity)).toFixed(2);
                    guide.price = parseFloat(parseFloat(guide.price) - (parseFloat(product.price) * product.quantity)).toFixed(2);
                    if (!self.deleted) {
                        $http.post('./hbr-selfie/dist/php/delete_product_guide.php', { id: product.awb_productId })
                            .then(function() {
                                airwayService.save(guide);
                            });
                    }
                }
            });
            var ExceedAmount = 0;
            if (guide.weight > 40 || guide.price > 900) {
                $('#guide_list_' + guide.number).addClass('row-warning');
                self.danger_msg = "";
                if (guide.weight > 50 || guide.weight == 50 || guide.price > 1000 || guide.price == 1000) {
                    if (guide.state == 0) {
                        $('#guide_list_' + guide.number).removeClass('row-warning');
                        $('#guide_list_' + guide.number).addClass('row-danger');
                        ExceedAmount = ++ExceedAmount;
                    }
                }
            } else {
                $('#guide_list_' + guide.number).removeClass('row-warning');
                $('#guide_list_' + guide.number).removeClass('row-danger');
            }
            self.danger_msg = ExceedAmount > 0 ? "Has Excedido el limite de 50 Kg o U$D 1,000.00" : "";
        }

        function setRealWeight(product, index) {
            if (product.remaining_quantity > 0) {
                self.activeEditing = !self.activeEditing;
                $scope.realWeight = angular.copy(product.real_weight || product.weight || 0);
                $scope.RealWeightProduct = product;
            }
        }

        function saveRealWeight(weight) {
            self.activeEditing = false;
            var product = "";
            var guideProduct = "";
            var ventaTotalWeight = 0.00;
            angular.forEach(self.bills, function(bill) {
                bill.total_weight = 0.00;
                product = $filter('filter')(bill.products, { product_id: $scope.RealWeightProduct.product_id })[0];
                if (product !== undefined) {
                    product.real_weight = weight;
                    product.total_weight = parseFloat(parseFloat(product.real_weight) * parseInt(product.quantity));
                    angular.forEach(self.guideBatch, function(guide) {
                        guideProduct = $filter('filter')(guide.products, { product_id: product.product_id })[0];
                        if (guideProduct) {
                            guideProduct.real_weight = parseFloat(product.real_weight).toFixed(2);
                            guideProduct.total_weight = parseFloat(parseFloat(guideProduct.real_weight) * parseInt(guideProduct.quantity));

                            airwayService.addProductToAwb(guideProduct);
                        }
                    });
                }

                angular.forEach(bill.products, function(product) {
                    bill.total_weight = parseFloat(parseFloat(bill.total_weight) + parseFloat(product.total_weight));
                });
                airwayService.updateBill(bill);

                ventaTotalWeight = parseFloat(parseFloat(ventaTotalWeight) + parseFloat(bill.total_weight));
            });
            if (product) {
                airwayService.updateProduct(product);
            }
            self.venta.total_weight = ventaTotalWeight;
            airwayService.updateVenta(self.venta);

        }

        function deleteGuide(guide, $index) {
            var guideNumber = 0;
            var sequence = $q.defer();
            sequence.resolve();
            sequence = sequence.promise;
            self.guideBatch.splice($index, 1);
            angular.forEach(guide.products, function(product) {
                sequence = sequence.then(function() {
                    $http.post('./hbr-selfie/dist/php/delete_product_guide.php', { id: product.awb_productId })
                        .then(function() {
                            self.deleted = true;
                            removeProduct(product, guide);
                        });
                });
            });

            $http.post('./hbr-selfie/dist/php/delete_guide.php', { id: guide.airwayId })
                .success(function success() {
                    var sequence2 = $q.defer();
                    sequence2.resolve();
                    sequence2 = sequence2.promise;
                    var ExceedAmount = 0;
                    angular.forEach(self.guideBatch, function(batchGuide) {
                        batchGuide.number = ++guideNumber;
                        sequence2 = sequence2
                            .then(function() {
                                return airwayService.updateGuide(batchGuide);
                            })
                            .then(function() {
                                if (batchGuide.weight > 40 || batchGuide.price > 900) {
                                    $('#guide_list_' + batchGuide.number).addClass('row-warning');
                                    self.danger_msg = "";
                                    if (batchGuide.weight >= 50 || batchGuide.price >= 1000) {
                                        $('#guide_list_' + batchGuide.number).removeClass('row-warning');
                                        $('#guide_list_' + batchGuide.number).addClass('row-danger');
                                        ExceedAmount = ++ExceedAmount;

                                    }
                                } else {
                                    $('#guide_list_' + batchGuide.number).removeClass('row-warning');
                                    $('#guide_list_' + batchGuide.number).removeClass('row-danger');
                                }
                            })
                    });
                });

            self.danger_msg = ExceedAmount > 0 ? "Has Excedido el limite de 50 Kg o U$D 1,000.00" : "";
        }

        function save() {

            var requests = [];
            if (self.venta.remaining_quantity === 0) {
                self.guideBatch.finished = true;
            }
            var sequence = $q.defer();
            sequence.resolve();
            sequence = sequence.promise;

            angular.forEach(self.guideBatch, function(awb) {
                if (awb.products.length > 0) {
                    sequence = sequence.then(function() {
                        return airwayService.save(awb).success(function(response) {
                            angular.forEach(awb.products, function(product) {
                                product.airwayId = response.airwayId;
                                airwayService.addProductToAwb(product)
                            });
                        });
                    });
                }
            });
            updateVenta();
        }

        function updateVenta() {
            var sequence = $q.defer();
            sequence.resolve();
            sequence = sequence.promise;
            var ventaQuantity = 0;
            angular.forEach(self.venta.bills, function(bill) {
                var billQuantity = 0;
                angular.forEach(bill.products, function(product) {
                    billQuantity = parseInt(parseInt(billQuantity) + parseInt(product.remaining_quantity));
                });

                bill.remaining_quantity = billQuantity;
                sequence = sequence.then(function() {
                    return airwayService.updateBill(bill).success(function(response) {
                        angular.forEach(bill.products, function(product) {
                            airwayService.updateProduct(product);
                        });
                    });
                });

                ventaQuantity = parseInt(parseInt(ventaQuantity) + parseInt(bill.remaining_quantity));
            });
            self.venta.total_remaining_quantity = ventaQuantity;
            console.log(self.venta.total_remaining_quantity);
            self.venta.guide_amount = self.guideBatch.length;
            airwayService.updateVenta(self.venta).success(function(response) {
                $uibModalInstance.dismiss('cancel');
                $state.go('dashboard.process_payments', { reload: true });
            });
        }

        function finishGuide(guide, index) {
            self.tempFinishGuide = guide;
            self.tempFinishGuideIndex = index;
            confirm();
        }

        function confirm() {
            self.confirmModal = $uibModal.open({
                templateUrl: 'confirm-modal.html',
                backdrop: 'static',
                keyboard: false,
                scope: $scope,
                size: 'sm'
            });
            $scope.tempFinishGuide = self.tempFinishGuide;
        }

        $scope.confirmAccept = function() {
            self.tempFinishGuide.state = 1;
            airwayService.updateGuide(self.tempFinishGuide);
            self.confirmModal.dismiss('cancel');
        }

        $scope.confirmCancel = function() {
            self.confirmModal.dismiss('cancel');
        }

        function init() {
            self.cancel = cancel;
            self.venta = venta;
            self.guideNumber = 0;
            self.bills = bills;
            self.confirmModal = null;
            angular.forEach(self.bills, function(bill) {
                bill.isOpen = false;
            });
            self.deleted = false;
            self.new_guide = new_guide;
            self.addToGuide = addToGuide;
            self.removeProduct = removeProduct;
            self.guideBatch = [];
            self.hideTable = false;
            self.activeEditing = false;
            self.selectedBill = {};
            self.selectBill = selectBill;
            self.setRealWeight = setRealWeight;
            self.saveRealWeight = saveRealWeight;
            self.save = save;
            self.venta.total_remaining_quantity = angular.copy(self.venta.total_remaining_quantity);
            self.deleteGuide = deleteGuide;
            self.danger_msg = "";
            self.finishGuide = finishGuide;
            self.tempFinishGuide = {};
            self.tempFinishGuideIndex = 0;
            airwayService.get_airwayBills(self.venta.id, null)
                .success(function(response) {
                    self.guideBatch = response.guideBatch;

                    var ExceedAmount = 0;
                    angular.forEach(self.guideBatch, function(guide) {
                        if (guide.weight > 40 || guide.price > 900) {
                            $('#guide_list_' + guide.number).addClass('row-warning');
                            self.danger_msg = "";
                            if (guide.weight > 50 || guide.weight == 50 || guide.price > 1000 || guide.price == 1000) {
                                if (guide.state == 0) {
                                    $('#guide_list_' + guide.number).removeClass('row-warning');
                                    $('#guide_list_' + guide.number).addClass('row-danger');
                                    ExceedAmount = ++ExceedAmount;
                                }
                            }
                        } else {
                            $('#guide_list_' + guide.number).removeClass('row-warning');
                            $('#guide_list_' + guide.number).removeClass('row-danger');
                        }
                    });
                    self.danger_msg = ExceedAmount > 0 ? "Has Excedido el limite de 50 Kg o U$D 1,000.00" : "";
                })
                .error(function(err) {
                    console.log(err);
                });

        }

        init();
    }
}
module.exports = processPaymentsController;