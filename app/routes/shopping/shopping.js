function shoppingController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('shoppingCtrl', shoppingCtrl);

    shoppingCtrl.$inject = ['categoryService', 'productService', '$http', '$state', 'uploadService', '$timeout', '$filter'];

    function shoppingCtrl(categoryService, productService, $http, $state, uploadService, $timeout, $filter) {
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

        // function finish() {
        //     self.spinner = true;
        //     angular.forEach(self.purchase.products, function(k, v) {
        //         k.category = parseInt(k.category.category_id);
        //     });
        //     $http.post('./hbr-selfie/dist/php/shopping.php', {
        //             peso_excedente: self.purchase.peso_excedente,
        //             parcial_price: self.purchase.parcial_price,
        //             peso_total: self.purchase.peso_total,
        //             tasas: self.purchase.tasas,
        //             total: self.purchase.total,
        //             total_quantity: self.purchase.total_quantity,
        //             transporte: self.purchase.transporte,
        //             userId: self.purchase.user.id,
        //             method: "POST"
        //         })
        //         .then(function success(response) {
        //             if (response.data.success) {

        //                 uploadService.uploadProducts(self.purchase.products, response.data.ventaId, (new Date).getTime());
        //                 // .then(function uploaded(response){
        //                 $http.post('./hbr-selfie/dist/php/solicitud_venta.php', {
        //                     lote: response.data.lote,
        //                     date: response.data.date,
        //                     email: response.data.email,
        //                     name: response.data.name + " " + response.data.lastname
        //                 }).then(function success(response) {
        //                     $state.go('dashboard.shopping_list', { reload: true });
        //                     self.spinner = false;
        //                 });
        //             }
        //         });
        // }

        // function add_purchase() {
        //     if (self.purchase.data.bill) {
        //         self.purchase.data.price = self.purchase.data.quantity * self.purchase.data.price;
        //         if (self.purchase.data.weight > 0 && self.purchase.data.weight !== null && self.purchase.data.weight !== undefined) {
        //             self.purchase.data.weight = (self.purchase.data.quantity * self.purchase.data.weight);
        //         } else {
        //             self.purchase.data.weight = 0;
        //         }
        //         self.purchase.products.push(self.purchase.data);
        //         self.purchase.parcial_price = self.purchase.parcial_price + self.purchase.data.price;
        //         self.purchase.total_quantity = parseInt(self.purchase.total_quantity) + parseInt(self.purchase.data.quantity);
        //         self.purchase.peso_total = self.purchase.peso_total + self.purchase.data.weight;
        //         self.purchase.total = 0;
        //         self.purchase.total = self.purchase.parcial_price;
        //         $('#bill').val("");
        //         $('#products').val("");
        //         $('#categories').val("");
        //         self.purchase.data = {};
        //         self.product_description = "";
        //         self.shoppingForm_purchase.$valid = true;
        //         self.shoppingForm_purchase.$setPristine();
        //         self.shoppingForm_purchase.$submitted = false;
        //     } else {
        //         self.shoppingForm_purchase.$valid = false;
        //         self.shoppingForm_purchase.$setPristine();
        //         self.shoppingForm_purchase.$submitted = false;
        //     }
        // }

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
            if (self.bill.establishment.length && self.bill.number.length && self.bill.tracking_number.length && self.bill.prestador.length) {
                self.bill_error = "";
                self.shoppingForm_purchase.name.$invalid = false;
                if (Object.keys(self.aux_product).length) {
                    self.product_error = "";
                    self.aux_product.total_weight = (parseFloat(self.aux_product.weight) * parseInt(self.aux_product.quantity)).toFixed(2);
                    self.aux_product.total_price = (parseFloat(self.aux_product.price) * parseInt(self.aux_product.quantity)).toFixed(2);
                    self.bill.products.push(self.aux_product);
                    self.bill.total_price = (parseFloat(parseFloat(self.bill.total_price) + parseFloat(self.aux_product.price) * parseInt(self.aux_product.quantity)).toFixed(2)) || 0.00;
                    self.bill.total_weight = (parseFloat(parseFloat(self.bill.total_weight) + (parseFloat(self.aux_product.weight) * parseInt(self.aux_product.quantity))).toFixed(2)) || 0.00;
                    self.bill.quantity = (parseFloat(parseFloat(self.bill.quantity) + parseFloat(self.aux_product.quantity)).toFixed(2)) || 0;
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
        }

        function add_bill() {
            if (self.bill.establishment.length && self.bill.number.length && self.bill.tracking_number.length && self.bill.prestador.length) {
                self.bill_error = "";
                self.lote.total_price = parseFloat(parseFloat(self.lote.total_price) + parseFloat(self.bill.total_price)).toFixed(2);
                self.lote.total_weight = parseFloat(parseFloat(self.lote.total_weight) + parseFloat(self.bill.total_weight)).toFixed(2);
                self.lote.total_quantity = parseInt(parseInt(self.lote.total_quantity) + parseInt(self.bill.quantity));

                self.lote.bills.push(self.bill);
                $('#bill_file').val("");

                self.bill = {
                    products: [],
                    number: '',
                    tracking: '',
                    prestador: '',
                    establishment: '',
                    bill_file: {},
                    total_price: 0
                };

                self.aux_product = {};

                console.log(self.lote);

                self.shoppingForm_purchase.$valid = true;
                self.shoppingForm_purchase.$submitted = false;
                self.shoppingForm_purchase.$setPristine();
                self.shoppingForm_purchase.$setUntouched();
                
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

            self.bill = {
                products: [],
                number: '',
                tracking_number: '',
                prestador: '',
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