function shoppingController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('shoppingCtrl', shoppingCtrl);

    shoppingCtrl.$inject = ['$scope', 'categoryService', 'productService', '$uibModal', '$rootScope', '$http', '$state', 'uploadService', '$timeout', '$filter', '$q'];

    function shoppingCtrl($scope, categoryService, productService, $uibModal, $rootScope, $http, $state, uploadService, $timeout, $filter, $q) {
        'use strict';
        var self = this; //jshint ignore:line
        function get_userdata() {
            $http.get('./hbr-selfie/dist/php/users.php', {
                params: {
                    sskey: sessionStorage.getItem('sskey'),
                    action: "getUserBySskey"
                }
            })
                .then(function (response) {
                    self.lote.user = response.data;
                });
        }

        function finish() {
            var requests = [];
            var whEmail = [];
            self.spinner = true;
            self.lote.total_price = 0.00;
            self.lote.parcial_price = 0.00;
            self.lote.total_weight = 0.00;
            self.lote.total_quantity = 0;
            self.lote.venta_state = 1;
            angular.forEach(self.lote.bills, function (k, v) {
                self.lote.total_price = parseFloat(self.lote.total_price) + parseFloat(k.total_price);
                self.lote.parcial_price = parseFloat(self.lote.parcial_price) + parseFloat(k.total_price);
                self.lote.total_weight = parseFloat(self.lote.total_weight) + parseFloat(k.total_weight);
                self.lote.total_quantity = parseInt(self.lote.total_quantity) + parseInt(k.quantity);
                angular.forEach(k.products, function (key, val) {
                    key.categoryId = parseInt(key.category.category_id);
                });
            });

            $http
                .post('./hbr-selfie/dist/php/shopping.php', {
                    peso_excedente: self.lote.peso_excedente,
                    id: self.lote.id || null,
                    parcial_price: self.lote.total_price,
                    total_weight: self.lote.total_weight,
                    total: self.lote.total_price,
                    total_quantity: self.lote.total_quantity,
                    userId: self.lote.user.id,
                    timestamp: new Date().getTime(),
                    venta_state: self.lote.venta_state,
                    method: "POST"
                })
                .success(function (response) {
                    if (response.success) {
                        self.response = response;
                        var sequence = $q.defer();
                        sequence.resolve();
                        sequence = sequence.promise;
                        angular.forEach(self.lote.bills, function (bill) {
                            if (whEmail.indexOf(bill.warehouse.email) == -1) {
                                whEmail.push(bill.warehouse.email);
                            }
                            sequence = sequence.then(function () {
                                return uploadService.uploadBills(bill, response.ventaId, self.lote.user.id, new Date().getTime())
                                    .success(function (response) {
                                        angular.forEach(bill.products, function (product) {
                                            product.bill_id = response.bill_id;
                                            product.userId = self.lote.user.id;
                                            uploadService.uploadProducts(product);
                                        });
                                    });
                            });
                        });
                        $q.all(sequence).then(function () {
                            $http.post('./hbr-selfie/dist/php/solicitud_venta.php', {
                                lote: self.response.lote,
                                date: self.response.date,
                                email: self.response.email,
                                name: self.response.name + " " + self.response.lastname,
                                whEmail: whEmail
                            }).success(function (response) {
                                setTimeout(function () {
                                    $state.go('dashboard.shopping_list', {}, { reload: true });
                                    self.spinner = false;
                                }, 2000);
                            });
                        });
                    }
                });
        }
        function confirmUpdate() {
            var title = "Continuar Luego";
            var msg = "Recuerde que tiene 7 dias para seguir comprando dentro de este lote de compra. A la vez hasta que el lote no este cerrado sus envíos no serán despachados a su domicilio. Ante la necesidad de despachar el lote puede optar por finalizar la compra e iniciar una compra nueva.";
            confirm(title, msg);
        }
        function confirmFinish() {
            var title = "Finalizar Compra";
            var msg = "Esta seguro que desea finalizar la compra? al finalizar la compra ya no podrá seguir agregando facturas al lote de compras.";
            confirm(title, msg);
        }
        function updateSave() {
            var requests = [];
            var whEmail = [];
            self.spinner = true;
            self.lote.total_price = 0.00;
            self.lote.parcial_price = 0.00;
            self.lote.total_weight = 0.00;
            self.lote.total_quantity = 0;
            self.lote.venta_state = 0;
            angular.forEach(self.lote.bills, function (k, v) {
                k.bill_state = 1;
                self.lote.total_price = parseFloat(self.lote.total_price) + parseFloat(k.total_price);
                self.lote.parcial_price = parseFloat(self.lote.parcial_price) + parseFloat(k.total_price);
                self.lote.total_weight = parseFloat(self.lote.total_weight) + parseFloat(k.total_weight);
                self.lote.total_quantity = parseInt(self.lote.total_quantity) + parseInt(k.quantity);
                angular.forEach(k.products, function (key, val) {
                    key.categoryId = parseInt(key.category.category_id);
                });
            });

            $http
                .post('./hbr-selfie/dist/php/shopping.php', {
                    peso_excedente: self.lote.peso_excedente,
                    id: self.lote.id || null,
                    parcial_price: self.lote.total_price,
                    total_weight: self.lote.total_weight,
                    total: self.lote.total_price,
                    total_quantity: self.lote.total_quantity,
                    userId: self.lote.user.id,
                    timestamp: new Date().getTime(),
                    venta_state: self.lote.venta_state,
                    method: "POST"
                })
                .success(function (response) {
                    if (response.success) {
                        self.response = response;
                        var sequence = $q.defer();
                        sequence.resolve();
                        sequence = sequence.promise;
                        angular.forEach(self.lote.bills, function (bill) {
                            if (whEmail.indexOf(bill.warehouse.email) == -1) {
                                whEmail.push(bill.warehouse.email);
                            }
                            sequence = sequence.then(function () {
                                return uploadService.uploadBills(bill, response.ventaId, self.lote.user.id, new Date().getTime())
                                    .success(function (response) {
                                        angular.forEach(bill.products, function (product) {
                                            product.bill_id = response.bill_id;
                                            product.userId = self.lote.user.id;
                                            uploadService.uploadProducts(product);
                                        });
                                    });
                            });
                        });
                        $q.all(sequence).then(function () {
                            $http.post('./hbr-selfie/dist/php/solicitud_venta.php', {
                                lote: self.response.lote,
                                date: self.response.date,
                                email: self.response.email,
                                name: self.response.name + " " + self.response.lastname,
                                whEmail: whEmail
                            }).success(function (response) {
                                setTimeout(function () {
                                    $state.go('dashboard.shopping_list', {}, { reload: true });
                                    self.spinner = false;
                                }, 2000);
                            });
                        });
                    }
                });
        }

        function confirm(title, msg) {
            self.confirmModal = $uibModal.open({
                templateUrl: 'confirm-modal.html',
                backdrop: 'static',
                keyboard: false,
                scope: $scope,
                size: 'sm'
            });
            $scope.title = title;
            $scope.msg = msg;
        }

        $scope.confirmAccept = function () {
            self.confirmModal.dismiss('cancel');
        }

        $scope.confirmCancel = function () {
            self.confirmModal.dismiss('cancel');
        }
        function get_categories() {
            categoryService
                .get_categories()
                .success(function (data) {
                    self.categories = data.categories;

                    if (self.lote.bills.length > 0) {
                        angular.forEach(self.lote.bills, function (bill) {
                            if (bill.products.length > 0) {
                                angular.forEach(bill.products, function (product) {
                                    product.category = $filter('filter')(self.categories, { category_id: product.category_id })[0];
                                });
                            }
                        });
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        }

        function get_warehouses() {
            $http.get('./hbr-selfie/dist/php/warehouse.php', {
                params: {
                    action: 'getAll'
                }
            }).then(function (response) {
                self.warehouses = response.data.warehouses;
            });
        }

        function add_product() {
            if (self.bill.establishment.length && self.bill.number.length && self.bill.tracking_number.length && self.bill.provider.length) {
                self.bill_error = "";
                self.shoppingForm_purchase.name.$invalid = false;
                if (Object.keys(self.aux_product).length) {
                    self.product_error = "";
                    self.aux_product.total_weight = (parseFloat(self.aux_product.weight || 0) * parseInt(self.aux_product.quantity)).toFixed(2);
                    self.aux_product.total_price = (parseFloat(self.aux_product.price) * parseInt(self.aux_product.quantity)).toFixed(2);
                    self.bill.products.push(self.aux_product);
                    self.bill.total_price = (parseFloat(parseFloat(self.bill.total_price) + parseFloat(self.aux_product.price) * parseInt(self.aux_product.quantity)).toFixed(2)) || 0.00;
                    self.bill.total_weight = (parseFloat(parseFloat(self.bill.total_weight || 0) + (parseFloat(self.aux_product.weight || 0) * parseInt(self.aux_product.quantity))).toFixed(2)) || 0.00;
                    self.bill.quantity = parseInt(parseInt(self.bill.quantity) + parseInt(self.aux_product.quantity)) || 0;
                    self.aux_product = {};
                    self.shoppingForm_purchase.$valid = true;
                    self.shoppingForm_purchase.$setUntouched();
                    self.shoppingForm_purchase.$setPristine();
                    self.shoppingForm_purchase.$submitted = false;

                    self.bill.total_price = 0.00;
                    self.bill.total_weight = 0.00;
                    self.bill.quantity = 0;
                    angular.forEach(self.bill.products, function (product) {
                        self.bill.total_price = (parseFloat(parseFloat(self.bill.total_price) + parseFloat(product.price) * parseInt(product.quantity)).toFixed(2)) || 0.00;
                        self.bill.total_weight = (parseFloat(parseFloat(self.bill.total_weight || 0) + (parseFloat(product.weight || 0) * parseInt(product.quantity))).toFixed(2)) || 0.00;
                        self.bill.quantity = parseInt(parseInt(self.bill.quantity) + parseInt(product.quantity)) || 0;
                    });

                } else {
                    self.product_error = "Debe completar la información de producto para continuar";
                }
            } else {
                self.bill_error = "Debe completar la información de factura para continuar";
                self.shoppingForm_purchase.$submitted = true;
            }
        }

        function removeProduct(product, index) {
            self.bill.products.splice(index, 1);
            self.bill.total_price = 0;
            self.bill.total_weight = 0;
            self.bill.quantity = 0;
            angular.forEach(self.bill.products, function (item, index) {
                self.bill.total_price = parseFloat(parseFloat(self.bill.total_price) + (parseFloat(item.price) * parseInt(item.quantity))).toFixed(2) || 0.00;
                self.bill.total_weight = (parseFloat(parseFloat(self.bill.total_weight || 0) + (parseFloat(item.weight || 0) * parseInt(item.quantity))).toFixed(2)) || 0.00;
                self.bill.quantity = parseInt(parseInt(self.bill.quantity) + parseInt(item.quantity)) || 0;
            });
        }

        function add_bill() {
            if (self.bill.establishment.length && self.bill.number.length && self.bill.tracking_number.length && self.bill.provider.length) {
                self.bill_error = "";
                self.lote.total_price = parseFloat(parseFloat(self.lote.total_price) + parseFloat(self.bill.total_price)).toFixed(2);
                self.lote.total_weight = parseFloat(parseFloat(self.lote.total_weight || 0) + parseFloat(self.bill.total_weight || 0)).toFixed(2);
                self.lote.total_quantity = parseInt(parseInt(self.lote.total_quantity) + parseInt(self.bill.quantity));
                self.bill.warehouse = self.bill.whId;
                self.bill.whId = self.bill.whId.id;
                self.bill.bill_state = 0;
                self.lote.bills.push(self.bill);
                $('#bill_file').val("");

                self.bill = {
                    products: [],
                    number: '',
                    tracking_number: '',
                    provider: '',
                    establishment: '',
                    bill_file: {},
                    total_price: 0.00,
                    total_weight: 0.00,
                    quantity: 0,
                    whId: {}
                };

                self.aux_product = {};
                $('.notification').show();
                setTimeout(function () {
                    $('.notification').hide();
                }, 3500);

                self.shoppingForm_purchase.$valid = true;
                self.shoppingForm_purchase.$submitted = false;
                self.shoppingForm_purchase.$setPristine();
                self.shoppingForm_purchase.$setUntouched();
                $('html, body').animate({
                    scrollTop: $("#product-info").offset().top
                }, 100);
            } else {
                self.bill_error = "Debe completar la información de factura para continuar";
                self.shoppingForm_purchase.$submitted = true;
            }
        }

        function closeNotification() {
            console.log("removes");
            $('.notification').removeClass('notification-in');
            $('.notification').addClass('notification-out');
        }

        function showEditBill(bill, products, index) {
            $scope.editBill = true;
            self.aux_product = {};
            self.bill = bill;
            self.bill.whId = bill.warehouse[0] || bill.warehouse;

            angular.forEach(bill.products, function (key, val) {
                key.category = $filter('filter')(self.categories, { category_id: key.category_id })[0];
                key.total_weight = (parseFloat(key.weight) * parseInt(key.quantity));
                key.total_price = (parseFloat(key.price) * parseInt(key.quantity));
            });
            self.collapse_purchase = false;
            setTimeout(function () {
                $('html, body').animate({ scrollTop: $("#product-info").offset().top }, 100);
            });
        }

        function showEditProduct(product, index) {
            self.oldProduct = {};
            $scope.editProduct = true;
            product.quantity = parseInt(product.quantity);
            product.price = parseFloat(product.price);
            product.weight = parseFloat(product.weight);
            self.aux_product = product;
            self.oldProduct = angular.copy(product);
        }

        function showBills() {
            self.collapse_list = false;
            setTimeout(function () {
                $('html, body').animate({ scrollTop: $("#billList").offset().top }, 100);
            }, 200);
        }

        function edit_product() {
            if (self.bill.establishment.length && self.bill.number.length && self.bill.tracking_number.length && self.bill.provider.length) {
                self.bill_error = "";
                self.shoppingForm_purchase.name.$invalid = false;
                if (Object.keys(self.aux_product).length) {
                    self.product_error = "";
                    self.aux_product.total_weight = (parseFloat(self.aux_product.weight || 0) * parseInt(self.aux_product.quantity)).toFixed(2);
                    self.aux_product.total_price = (parseFloat(self.aux_product.price) * parseInt(self.aux_product.quantity)).toFixed(2);
                    self.bill.total_price = 0.00;
                    self.bill.total_weight = 0.00;
                    self.bill.quantity = 0;
                    angular.forEach(self.bill.products, function (product) {
                        if (product.product_id === self.aux_product.product_id) {
                            product = self.aux_product;
                        }
                        self.bill.total_price = (parseFloat(parseFloat(self.bill.total_price) + parseFloat(product.price) * parseInt(product.quantity)).toFixed(2)) || 0.00;
                        self.bill.total_weight = (parseFloat(parseFloat(self.bill.total_weight || 0) + (parseFloat(product.weight || 0) * parseInt(product.quantity))).toFixed(2)) || 0.00;
                        self.bill.quantity = parseInt(parseInt(self.bill.quantity) + parseInt(product.quantity)) || 0;
                    });

                    self.aux_product = {};
                    self.shoppingForm_purchase.$valid = true;
                    self.shoppingForm_purchase.$setUntouched();
                    self.shoppingForm_purchase.$setPristine();
                    self.shoppingForm_purchase.$submitted = false;
                } else {
                    self.product_error = "Debe completar la información de producto para continuar";
                }
            } else {
                self.bill_error = "Debe completar la información de factura para continuar";
                self.shoppingForm_purchase.$submitted = true;
            }

            self.lote.total_price = 0.00;
            self.lote.total_weight = 0.00;
            self.lote.total_quantity = 0;

            angular.forEach(self.lote.bills, function (bill) {
                if (bill.bill_id === self.bill.bill_id) {
                    bill = self.bill;
                }
                self.lote.total_price = (parseFloat(self.lote.total_price) + parseFloat(bill.total_price)).toFixed(2);
                self.lote.total_quantity = parseInt(self.lote.total_quantity) + parseInt(bill.quantity);
                self.lote.total_weight = (parseFloat(self.lote.total_weight) + parseFloat(bill.total_weight)).toFixed(2);
            });
            $scope.editProduct = false;
        }

        function delete_bill(bill, $index) {
            self.lote.bills.splice($index, 1);
            self.lote.total_price = 0.00;
            self.lote.total_quantity = 0;
            self.lote.total_weight = 0.00;
            angular.forEach(self.lote.bills, function (bill) {
                self.lote.total_price = (parseFloat(self.lote.total_price) + parseFloat(bill.total_price)).toFixed(2);
                self.lote.total_quantity = parseInt(self.lote.total_quantity) + parseInt(bill.quantity);
                self.lote.total_weight = (parseFloat(self.lote.total_weight) + parseFloat(bill.total_weight)).toFixed(2);
            });
        }

        function edit_bill() {
            self.bill.warehouse = self.bill.whId;
            self.bill.whId = self.bill.whId.id;
            uploadService.edit_bill(self.bill)
                .then(function (response) {
                    if (response.data.success) {
                        angular.forEach(self.bill.products, function (product) {
                            product.bill_id = self.bill.bill_id;
                            product.userId = self.bill.userId;
                            return uploadService.edit_product(product);
                        });
                    }
                })
                .finally(function () {
                    self.bill = {
                        products: [],
                        number: '',
                        tracking_number: '',
                        provider: '',
                        establishment: '',
                        bill_file: {},
                        total_price: 0.00,
                        total_weight: 0.00,
                        quantity: 0,
                        whId: {}
                    };
                    $scope.editBill = false;
                });
        }

        function init() {
            $('.notification').hide();
            $scope.editBill = false;
            $scope.editProduct = false;
            get_categories();
            get_warehouses();
            self.lote = $state.params.venta || { user: {}, bills: [], total_weight: 0, total_price: 0.00, total_quantity: 0 };

            if (self.lote.bills.length > 0) {
                self.lote.total_price = 0.00;
                self.lote.total_weight = 0.00;
                self.lote.total_quantity = 0;
                angular.forEach(self.lote.bills, function (bill) {
                    self.lote.total_price = (parseFloat(self.lote.total_price) + parseFloat(bill.total_price)).toFixed(2);
                    self.lote.total_quantity = parseInt(self.lote.total_quantity) + parseInt(bill.quantity);
                    self.lote.total_weight = (parseFloat(self.lote.total_weight) + parseFloat(bill.total_weight)).toFixed(2);
                });
            }

            self.get_warehouses = get_warehouses;
            self.get_categories = get_categories;
            self.collapse_personal = true;
            self.collapse_purchase = true;
            self.collapse_list = true;
            self.add_bill = add_bill;
            self.add_product = add_product;
            self.spinner = false;
            self.aux_product = {};
            self.removeProduct = removeProduct;
            self.updateSave = updateSave;
            self.finish = finish;
            self.oldProduct = {};
            self.bill = {
                products: [],
                number: '',
                tracking_number: '',
                provider: '',
                establishment: '',
                bill_file: {},
                total_price: 0.00,
                total_weight: 0.00,
                quantity: 0,
                whId: {}
            };
            self.addshoping_response = {};
            get_userdata();
            self.closeNotification = closeNotification;
            self.showBills = showBills;
            self.showEditBill = showEditBill;
            self.showEditProduct = showEditProduct;
            self.edit_product = edit_product;
            self.edit_bill = edit_bill;
            self.delete_bill = delete_bill;
            self.confirmUpdate = confirmUpdate;
            self.confirmFinish = confirmFinish;
        }

        init();
    }
}
module.exports = shoppingController;