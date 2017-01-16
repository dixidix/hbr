function shoppingController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('shoppingCtrl', shoppingCtrl);

    shoppingCtrl.$inject = ['categoryService', 'productService', '$http', '$state', 'uploadService', '$timeout', '$filter', '$q'];

    function shoppingCtrl(categoryService, productService, $http, $state, uploadService, $timeout, $filter, $q) {
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
            self.spinner = true;
            angular.forEach(self.lote.bills, function (k, v) {
                angular.forEach(k.products, function (key, val) {
                    key.category = parseInt(key.category.category_id);
                });
            });

            $http
                .post('./hbr-selfie/dist/php/shopping.php', {
                    peso_excedente: self.lote.peso_excedente,
                    parcial_price: self.lote.total_price,
                    total_weight: self.lote.total_weight,
                    total: self.lote.total_price,
                    total_quantity: self.lote.total_quantity,
                    userId: self.lote.user.id,
                    method: "POST"
                })
                .then(function success(response) {
                    if (response.data.success) {
                        var billId = [];
                        angular.forEach(self.lote.bills, function (bill) {
                            var deferred = $q.defer();
                            requests.push(deferred.promise);
                            uploadService.uploadBills(bill, response.data.ventaId, self.lote.user.id, (new Date).getTime())
                                .then(function success(response) {
                                    angular.forEach(bill.products, function (product) {
                                        console.log(response);
                                        product.bill_id = response.data.bill_id;
                                        product.userId = self.lote.user.id;
                                        uploadService.uploadProducts(product);
                                    });
                                    deferred.resolve();
                                });
                        });
                        $q.all(requests).then(function () {
                            $http.post('./hbr-selfie/dist/php/solicitud_venta.php', {
                                lote: response.data.lote,
                                date: response.data.date,
                                email: response.data.email,
                                name: response.data.name + " " + response.data.lastname
                            }).then(function success(response) {
                                $state.go('dashboard.shopping_list', { reload: true });
                                self.spinner = false;
                            });
                        });
                    }
                });
        }

        function get_categories() {
            categoryService
                .get_categories()
                .success(function (data) {
                    self.categories = data.categories;
                })
                .error(function (error) {
                    console.log(error);
                });
        }

        function add_product() {
            if (self.bill.establishment.length && self.bill.number.length && self.bill.tracking_number.length && self.bill.provider.length) {
                self.bill_error = "";
                self.shoppingForm_purchase.name.$invalid = false;
                if (Object.keys(self.aux_product).length) {
                    self.product_error = "";
                    self.aux_product.total_weight = (parseFloat(self.aux_product.weight) * parseInt(self.aux_product.quantity)).toFixed(2);
                    self.aux_product.total_price = (parseFloat(self.aux_product.price) * parseInt(self.aux_product.quantity)).toFixed(2);
                    self.bill.products.push(self.aux_product);
                    self.bill.total_price = (parseFloat(parseFloat(self.bill.total_price) + parseFloat(self.aux_product.price) * parseInt(self.aux_product.quantity)).toFixed(2)) || 0.00;
                    self.bill.total_weight = (parseFloat(parseFloat(self.bill.total_weight) + (parseFloat(self.aux_product.weight) * parseInt(self.aux_product.quantity))).toFixed(2)) || 0.00;
                    self.bill.quantity = parseInt(parseInt(self.bill.quantity) + parseInt(self.aux_product.quantity)) || 0;
                    self.aux_product = {};
                    self.shoppingForm_purchase.$valid = true;
                    self.shoppingForm_purchase.$setUntouched();
                    self.shoppingForm_purchase.$setPristine();
                    self.shoppingForm_purchase.$submitted = false;
                    console.log(self.bill);

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
                self.bill.total_weight = (parseFloat(parseFloat(self.bill.total_weight) + (parseFloat(item.weight) * parseInt(item.quantity))).toFixed(2)) || 0.00;
                self.bill.quantity = parseInt(parseInt(self.bill.quantity) + parseInt(item.quantity)) || 0;
            });
        }

        function add_bill() {
            if (self.bill.establishment.length && self.bill.number.length && self.bill.tracking_number.length && self.bill.provider.length) {
                self.bill_error = "";
                self.lote.total_price = parseFloat(parseFloat(self.lote.total_price) + parseFloat(self.bill.total_price)).toFixed(2);
                self.lote.total_weight = parseFloat(parseFloat(self.lote.total_weight) + parseFloat(self.bill.total_weight)).toFixed(2);
                self.lote.total_quantity = parseInt(parseInt(self.lote.total_quantity) + parseInt(self.bill.quantity));

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
                    quantity: 0
                };

                self.aux_product = {};

                console.log(self.lote);

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

        function init() {
            get_categories();

            self.lote = {
                user: {},
                bills: [],
                total_weight: 0,
                total_price: 0.00,
                total_quantity: 0
            };

            self.get_categories = get_categories;
            self.collapse_personal = true;
            self.collapse_purchase = true;
            self.collapse_list = true;
            self.add_bill = add_bill;
            self.add_product = add_product;
            self.spinner = false;
            self.aux_product = {};
            self.removeProduct = removeProduct;
            self.finish = finish;
            self.bill = {
                products: [],
                number: '',
                tracking_number: '',
                provider: '',
                establishment: '',
                bill_file: {},
                total_price: 0.00,
                total_weight: 0.00,
                quantity: 0
            };

            get_userdata();

        }

        init();
    }
}
module.exports = shoppingController;