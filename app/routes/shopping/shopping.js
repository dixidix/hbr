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
                .then(function(response) {
                    self.lote.user = response.data;
                });
        }

        function finish() {
            var requests = [];
            self.spinner = true;
            angular.forEach(self.lote.bills, function(k, v) {
                angular.forEach(k.products, function(key, val) {
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
                .success(function(response) {
                    if (response.success) {
                        var sequence = $q.defer();
                        sequence.resolve();
                        sequence = sequence.promise;
                        angular.forEach(self.lote.bills, function(bill) {
                            sequence = sequence.then(function() {
                                return uploadService.uploadBills(bill, response.ventaId, self.lote.user.id, (new Date).getTime())
                                    .success(function(response) {
                                        angular.forEach(bill.products, function(product) {
                                            product.bill_id = response.bill_id;
                                            product.userId = self.lote.user.id;
                                            uploadService.uploadProducts(product);
                                        });
                                    });
                            });
                        });
                    }
                    $http.post('./hbr-selfie/dist/php/solicitud_venta.php', {
                        lote: response.lote,
                        date: response.date,
                        email: response.email,
                        name: response.name + " " + response.lastname
                    }).then(function success(response) {
                        $state.go('dashboard.shopping_list', { reload: true });
                        self.spinner = false;
                    });
                });
        }

        function get_categories() {
            categoryService
                .get_categories()
                .success(function(data) {
                    self.categories = data.categories;
                })
                .error(function(error) {
                    console.log(error);
                });
        }

        function get_warehouses() {
            $http.get('./hbr-selfie/dist/php/warehouse.php', {
                params: {
                    action: 'getAll'
                }
            }).then(function(response) {
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
            angular.forEach(self.bill.products, function(item, index) {
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
                self.bill.whId = self.bill.whId.id;
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
                    whId:''
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
            get_warehouses();
            self.lote = {
                user: {},
                bills: [],
                total_weight: 0,
                total_price: 0.00,
                total_quantity: 0
            };
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
            self.addshoping_response = {};
            get_userdata();

        }

        init();
    }
}
module.exports = shoppingController;