function productController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('productCtrl', productCtrl);
    productCtrl.$inject = ['usersService', 'productService', '$http', '$filter', '$state', '$scope', '$uibModal', 'productService'];

    app.controller('modalAddproductCtrl', modalAddproductCtrl);
    modalAddproductCtrl.$inject = ['productService', 'categoryService', '$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', '$rootScope', '$http'];

    app.controller('modalEditproductCtrl', modalEditproductCtrl);
    modalEditproductCtrl.$inject = ['categoryService', 'productService', '$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', '$rootScope', 'product', '$http', 'productService'];

    app.controller('modalDeleteproductCtrl', modalDeleteproductCtrl);
    modalDeleteproductCtrl.$inject = ['productService', '$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', '$rootScope', 'product', '$http', 'productService'];

    app.controller('modalChangeprivilegesCtrl', modalChangeprivilegesCtrl);
    modalChangeprivilegesCtrl.$inject = ['productService', '$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', '$rootScope', 'product', '$http', 'productService'];


    function productCtrl(usersService, productService, $http, $filter, $state, $scope, $uibModal) {

        var self = this; //jshint ignore:line


        function newproduct() {
            var modalInstance = $uibModal.open({
                templateUrl: './hbr-selfie/dist/routes/products/modals/addproducts.template.html',
                controller: 'modalAddproductCtrl',
                controllerAs: 'modalAddproduct',
                size: 'md'
            });
        }

        function editproduct(product) {
            var modalInstance = $uibModal.open({
                templateUrl: './hbr-selfie/dist/routes/products/modals/editproducts.template.html',
                controller: 'modalEditproductCtrl',
                controllerAs: 'modalEditproduct',
                size: 'md',
                resolve: {
                    product: function () {
                        return product;
                    }
                }
            });
        }

        function removeproduct(product) {
            var modalInstance = $uibModal.open({
                templateUrl: './hbr-selfie/dist/routes/products/modals/deleteproducts.template.html',
                controller: 'modalDeleteproductCtrl',
                controllerAs: 'modalDeleteproduct',
                size: 'md',
                resolve: {
                    product: function () {
                        return product;
                    }
                }
            });
        }

        function changeprivileges(product) {
            var modalInstance = $uibModal.open({
                templateUrl: './hbr-selfie/dist/routes/products/modals/changeprivileges.template.html',
                controller: 'modalChangeprivilegesCtrl',
                controllerAs: 'modalChangeprivileges',
                size: 'md',
                resolve: {
                    product: function () {
                        return product;
                    }
                }
            });
        }

        function init() {

            productService
                .get_products()
                .then(function (res) {
                    self.products = res.data.products;
                })
                .error(function (error) {
                    console.log(error);
                });
            self.newproduct = newproduct;
            self.editproduct = editproduct;
            self.removeproduct = removeproduct;
            self.changeprivileges = changeprivileges;
        }

        init();
    }

    function modalAddproductCtrl(productService, categoryService, $scope, $state, $filter, $uibModalInstance, $sce, $compile, $rootScope) {
        var self = this;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        function addproduct() {
            productService
                .add_product(self.product)
                .then(function (response) {
                    if (!response.data.errors) {
                        $uibModalInstance.dismiss('cancel');
                        $state.go('dashboard.products', {}, {reload: true});
                    }
                });
        };
        function init() {

            categoryService
                .get_categories()
                .then(function (res) {
                    self.categories = res.data.categories;
                })
                .error(function (error) {
                    console.log(error);
                });
            self.categories = {};
            self.product = {};
            self.cancel = cancel;
            self.addproduct = addproduct;
        }

        init();
    }

    function modalEditproductCtrl(categoryService, productService, $scope, $state, $filter, $uibModalInstance, $sce, $compile, $rootScope, product, $http) {
        var self = this;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        function editproduct() {
            productService
                .edit_product(self.product)
                .then(function (response) {
                    if (!response.data.errors) {
                        $uibModalInstance.dismiss('cancel');
                        $state.go('dashboard.products', {}, {reload: true});
                    }
                });
        };

        function init() {

            categoryService
                .get_categories()
                .then(function (res) {
                    self.categories = res.data.categories;
                    product.category_id = $filter('filter')(self.categories, { category_id: product.category_id })[0];
                })
                .error(function (error) {
                    console.log(error);
                });

            self.product = product;
            self.cancel = cancel;
            self.editproduct = editproduct;
        }

        init();
    }

    function modalDeleteproductCtrl(productService, $scope, $state, $filter, $uibModalInstance, $sce, $compile, $rootScope, product, $http) {
        var self = this;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        function deleteproduct() {
            productService
                .delete_product(self.product)
                .then(function (response) {
                    if (!response.data.errors) {
                        $uibModalInstance.dismiss('cancel');
                        $state.go('dashboard.products', {}, {reload: true});
                    }
                });
        };

        function init() {
            self.product = product;
            self.cancel = cancel;
            self.deleteproduct = deleteproduct;
        }

        init();
    }

    function modalChangeprivilegesCtrl(productService, $scope, $state, $filter, $uibModalInstance, $sce, $compile, $rootScope, product, $http) {
        var self = this;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        function changeprivileges() {
            productService
                .changeprivileges(self.product)
                .then(function (response) {
                    if (!response.data.errors) {
                        $uibModalInstance.dismiss('cancel');
                        $state.go('dashboard.products', {}, {reload: true});
                    }
                });
        };

        function init() {
            self.product = product;
            if (product.isPremium == 1) {
                self.action = "quitar premium";
            } else {
                self.action = "hacer premium";
            }
            self.cancel = cancel;
            self.changeprivileges = changeprivileges;
        }

        init();
    }
}
module.exports = productController;