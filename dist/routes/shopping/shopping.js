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
                    self.purchase.user = response.data;
                });
        }

        function finish() {
            angular.forEach(self.purchase.products, function(k,v){
               k.category = parseInt(k.category.category_id );
            });
            $http.post('./hbr-selfie/dist/php/shopping.php', {
                peso_excedente: self.purchase.peso_excedente,
                parcial_price: self.purchase.parcial_price,
                peso_total: self.purchase.peso_total,
                tasas: self.purchase.tasas,
                total: self.purchase.total,
                total_quantity: self.purchase.total_quantity,
                transporte: self.purchase.transporte,
                userId: self.purchase.user.id,
                method: "POST"
            })
                .then(function success(response) {
                    if (response.data.success) {

                        uploadService.uploadProducts(self.purchase.products, response.data.ventaId, (new Date).getTime());
                        // .then(function uploaded(response){
                        $http.post('./hbr-selfie/dist/php/solicitud_venta.php', {
                            lote: response.data.lote,
                            date: response.data.date,
                            email: response.data.email,
                            name: response.data.name + " " + response.data.lastname
                        }).then(function success(response) {
                            $state.go('dashboard.shopping_list', {reload: true});
                        });
                    }
                });
        }

        function add_purchase() {
            if (self.purchase.data.bill) {
                self.purchase.data.price = self.purchase.data.quantity * self.purchase.data.price;
                self.purchase.data.weight = self.purchase.data.quantity * self.purchase.data.weight;
                self.purchase.products.push(self.purchase.data);
                self.purchase.parcial_price = self.purchase.parcial_price + self.purchase.data.price;
                self.purchase.total_quantity = parseInt(self.purchase.total_quantity) + parseInt(self.purchase.data.quantity);
                self.purchase.peso_total = self.purchase.peso_total + self.purchase.data.weight;
                self.purchase.total = 0;
                self.purchase.total = self.purchase.parcial_price;
                $('#bill').val("");
                $('#products').val("");
                $('#categories').val("");
                self.purchase.data = {};
                self.product_description = "";
                self.shoppingForm_purchase.$valid = true;
                self.shoppingForm_purchase.$setPristine();
                self.shoppingForm_purchase.$submitted = false;
            } else {
                self.shoppingForm_purchase.$valid = false;
                self.shoppingForm_purchase.$setPristine();
                self.shoppingForm_purchase.$submitted = false;
            }
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

        function init() {
            get_categories();
            self.purchase = {
                user: {},
                data: {},
                products: [],
                parcial_price: 0.00,
                peso_total: 0,
                peso_excedente: 0,
                transporte: 0,
                tasas: 0,
                total: 0.00,
                total_quantity: 0
            };
            self.excedente_peso = "";
            self.get_categories = get_categories;
            self.collapse_personal = true;
            self.collapse_purchase = true;
            self.collapse_list = true;
            self.add_purchase = add_purchase;
            self.finish = finish;
            get_userdata();

        }

        init();
    }
}
module.exports = shoppingController;