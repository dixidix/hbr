function processPaymentsController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('processPaymentsCtrl', processPaymentsCtrl);
    processPaymentsCtrl.$inject = ['$http', '$filter', '$state', '$scope', '$uibModal'];

    app.controller('modaProcessCtrl', modaProcessCtrl);
    modaProcessCtrl.$inject = ['$scope', '$state', '$filter', '$uibModalInstance', '$uibModal', '$sce', '$compile', '$rootScope', 'venta', 'products', '$http'];

    app.controller('makeGuidesModalCtrl', makeGuidesModalCtrl);
    makeGuidesModalCtrl.$inject = ['$scope', '$state', '$filter', '$uibModalInstance', '$uibModal', '$sce', '$compile', '$rootScope', 'venta', 'products', '$http'];

    function processPaymentsCtrl($http, $filter, $state, $scope, $uibModal) {
        var self = this; //jshint ignore:line

        function processPaymentModal(size, venta, products) {
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
                    products: function() {
                        return products;
                    },
                }
            });
        }


        function makeGuidesModal(size, venta, products) {
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
                    products: function() {
                        return products;
                    },
                }
            });
        }

        function processPayment(venta, products) {
            processPaymentModal('md', venta, products);
        }

        function setGuides(venta, products) {
            makeGuidesModal('md', venta, products);
        }

        function init() {
            $http.get('./hbr-selfie/dist/php/shopping.php', { params: { action: "getAll" } })
                .then(function(response) {
                    angular.forEach(response.data.ventas, function(value, key) {
                        response.data.ventas[key].parcial_price = parseFloat(value.parcial_price).toFixed(2);
                        response.data.ventas[key].total = parseFloat(value.total).toFixed(2);
                        response.data.ventas[key].peso_total = parseFloat(value.peso_total).toFixed(2);
                        response.data.ventas[key].totalWarehouse = "0";
                        response.data.ventas[key].guide_amount = "2";
                        response.data.ventas[key].totalFlete = "0";
                        response.data.ventas[key].totalImpuestos = "0";
                    });

                    self.ventas = response.data.ventas;
                    self.processPayment = processPayment;
                    self.setGuides = setGuides;
                });
        }

        init();
    }

    function modaProcessCtrl($scope, $state, $filter, $uibModalInstance, $uibModal, $sce, $compile, $rootScope, venta, products, $http) {
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
            console.log(product);
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
            self.products = products;
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

    function makeGuidesModalCtrl($scope, $state, $filter, $uibModalInstance, $uibModal, $sce, $compile, $rootScope, venta, products, $http) {
        var self = this;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
            $state.go('dashboard.process_payments', { reload: true });
        };

        function new_guide() {
            self.guideNumber++;
            self.guideBatch.push({ number: self.guideNumber, products: [], quantity: '', guide_weight: '', guide_price: '' });
        }

        function addToGuide(product, guideNumber, amount) {
            angular.forEach(self.guideBatch, function(guide) {
                angular.forEach(self.products, function(value) {
                    if (value.id == product.id) {
                        if (value.quantity > 0) {
                            if (guide.number === guideNumber) {
                                product.guide_amount = amount;
                                value.quantity = parseInt(value.quantity) - parseInt(amount);
                                guide.products.push(product);
                                guide.total_quantity = parseInt(guide.total_quantity || 0) + parseInt(amount || 0);
                                guide.guide_total_weight = (parseFloat(guide.guide_total_weight || 0) + parseFloat(parseFloat(product.partial_weight || 0) * amount));
                                guide.guide_total_price = (parseFloat(guide.guide_total_price || 0) + parseFloat(parseFloat(product.partial_price || 0) * amount));
                                if (guide.guide_total_weight > 40 || guide.guide_total_price > 900) {
                                    $('#guide_list_' + guideNumber).addClass('row-warning');
                                    self.danger_msg = "";
                                    if (guide.guide_total_weight > 50 || guide.guide_total_weight == 50 || guide.guide_total_price > 1000 || guide.guide_total_price == 1000) {
                                        $('#guide_list_' + guideNumber).removeClass('row-warning');
                                        $('#guide_list_' + guideNumber).addClass('row-danger');
                                        self.danger_msg = "Has Excedido el limite de 50 Kg o U$D 1,000.00";
                                    }
                                } else {
                                    self.danger_msg = "";
                                    $('#guide_list_' + guideNumber).removeClass('row-warning');
                                    $('#guide_list_' + guideNumber).removeClass('row-danger');
                                }
                            }
                        }
                    }
                });
                if (self.products.length == 0) {
                    self.hideTable = true;
                } else {
                    self.hideTable = false;
                }
            });
            self.selectedGuide = null;
            self.selectedQuantity = null;

        }

        function removeProduct(product, guide) {
            angular.forEach(self.products, function(value) {
                console.log(value.id, product.id);
                if (value.id == product.id) {
                    value.quantity = parseInt(value.quantity) + parseInt(product.guide_amount);
                }
            });
            angular.forEach(guide.products, function(value, index) {
                if (value.id == product.id) {
                    guide.products.splice(index, 1);
                    guide.total_quantity = parseInt(guide.total_quantity) - parseInt(product.guide_amount);
                    guide.guide_total_weight = parseFloat(guide.guide_total_weight) - (parseFloat(product.partial_weight) * product.guide_amount);
                    guide.guide_total_price = parseFloat(guide.guide_total_price) - (parseFloat(product.partial_price) * product.guide_amount);
                }
            });
        }

        function init() {
            self.cancel = cancel;
            self.venta = venta;
            self.guideNumber = 0;
            self.products = products;
            self.new_guide = new_guide;
            self.addToGuide = addToGuide;
            self.removeProduct = removeProduct;
            self.guideBatch = [];
            self.hideTable = false;
        }

        init();
    }
}
module.exports = processPaymentsController;