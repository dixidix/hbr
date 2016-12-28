function processPaymentsController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('processPaymentsCtrl', processPaymentsCtrl);
    processPaymentsCtrl.$inject = ['$http', '$filter', '$state', '$scope', '$uibModal'];

    app.controller('modaProcessCtrl', modaProcessCtrl);
    modaProcessCtrl.$inject = ['$scope', '$state', '$filter', '$uibModalInstance', '$uibModal', '$sce', '$compile', '$rootScope', 'venta', 'products', '$http'];

    function processPaymentsCtrl($http, $filter, $state, $scope, $uibModal) {
        var self = this; //jshint ignore:line

        function openModal(size, venta, products) {
            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                controller: 'modaProcessCtrl',
                controllerAs: 'modaProcess',
                size: size,
                resolve: {
                    venta: function () {
                        return venta;
                    },
                    products: function () {
                        return products;
                    },
                }
            });
        }

        function processPayment(venta, products) {
            openModal('md', venta, products);
        }

        function init() {
            $http.get('./hbr-selfie/dist/php/shopping.php', {params: {action: "getAll"}})
                .then(function (response) {
                    self.ventas = response.data.ventas;
                    self.processPayment = processPayment;
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
            $http.post('./hbr-selfie/dist/php/encrypt.php', {timestamp: Math.round((new Date()).getTime() / 1000)})
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
        }

        function init() {
            self.venta = venta;
            self.products = products;
            $http.get('./hbr-selfie/dist/php/users.php', {params: {action: "getUserById", id: self.venta.uid}})
                .then(function (response) {
                    self.user = response.data;
                });
            self.cancel = cancel;
            self.send = send;
            self.showProductInfo = false;
            self.generateToken = generateToken;
            self.processProduct = processProduct;
            self.calcProduct = calcProduct;
            self.calcRights = calcRights
            self.calcBaseIva = calcBaseIva;
        }

        init();
    }
}
module.exports = processPaymentsController;