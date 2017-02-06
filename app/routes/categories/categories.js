function categoryController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('categoryCtrl', categoryCtrl);
    categoryCtrl.$inject = ['categoryService', '$uibModal'];

    app.controller('modalAddcategoryCtrl', modalAddcategoryCtrl);
    modalAddcategoryCtrl.$inject = ['categoryService', '$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', '$rootScope', '$http'];

    app.controller('modalEditcategoryCtrl', modalEditcategoryCtrl);
    modalEditcategoryCtrl.$inject = ['categoryService', '$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', '$rootScope', 'category', '$http'];

    app.controller('modalDeletecategoryCtrl', modalDeletecategoryCtrl);
    modalDeletecategoryCtrl.$inject = ['categoryService', '$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', '$rootScope', 'category', '$http'];

    function categoryCtrl(categoryService, $uibModal) {
        var self = this; //jshint ignore:line


        function newcategory() {
            var modalInstance = $uibModal.open({
                templateUrl: './hbr-selfie/dist/routes/categories/modals/addcategories.template.html',
                controller: 'modalAddcategoryCtrl',
                controllerAs: 'modalAddcategory',
                size: 'md'
            });
        }

        function editcategory(category) {
            var modalInstance = $uibModal.open({
                templateUrl: './hbr-selfie/dist/routes/categories/modals/editcategories.template.html',
                controller: 'modalEditcategoryCtrl',
                controllerAs: 'modalEditcategory',
                size: 'md',
                resolve: {
                    category: function () {
                        return category;
                    }
                }
            });
        }

        function removecategory(category) {
            var modalInstance = $uibModal.open({
                templateUrl: './hbr-selfie/dist/routes/categories/modals/deletecategories.template.html',
                controller: 'modalDeletecategoryCtrl',
                controllerAs: 'modalDeletecategory',
                size: 'md',
                resolve: {
                    category: function () {
                        return category;
                    }
                }
            });
        }

        function init() {
            categoryService
                .get_categories()
                .success(function (data) {
                    self.categories = data.categories;
                })
                .error(function (error) {
                    console.log(error);
                });
            self.newcategory = newcategory;
            self.editcategory = editcategory;
            self.removecategory = removecategory;
        }

        init();
    }


    function modalAddcategoryCtrl(categoryService, $scope, $state, $filter, $uibModalInstance, $sce, $compile, $rootScope) {
        var self = this;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        function addcategory() {
            categoryService
                .add_category(self.category)
                .then(function (response) {
                    if (!response.data.errors) {
                        $uibModalInstance.dismiss('cancel');
                        $state.go('dashboard.categories', {}, {reload: true});
                    } else {
                        self.error_msgs = response.data.errors;
                    }
                });
        };
        function init() {
            self.category = {};
            self.cancel = cancel;
            self.addcategory = addcategory;
            self.error_msgs = [];
        }

        init();
    }

    function modalEditcategoryCtrl(categoryService, $scope, $state, $filter, $uibModalInstance, $sce, $compile, $rootScope, category, $http) {
        var self = this;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        function editcategory() {
            if (self.old_name !== self.category.name) {
                categoryService
                    .edit_category(self.category)
                    .then(function (response) {
                        if (!response.data.errors) {
                            $uibModalInstance.dismiss('cancel');
                            $state.go('dashboard.categories', {}, {reload: true});
                        } else {
                            self.error_msgs = response.data.errors;
                        }
                    });
            } else {
                cancel();
            }
        };

        function init() {
            self.category = category;
            self.old_name = self.category.name;
            self.cancel = cancel;
            self.editcategory = editcategory;
        }

        init();
    }

    function modalDeletecategoryCtrl(categoryService, $scope, $state, $filter, $uibModalInstance, $sce, $compile, $rootScope, category, $http) {
        var self = this;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        function deletecategory() {
            categoryService
                .delete_category(self.category)
                .then(function (response) {
                    if (!response.data.errors) {
                        $uibModalInstance.dismiss('cancel');
                        $state.go('dashboard.categories', {}, {reload: true});
                    }
                });
        };

        function init() {
            $scope.filtered = [];
            self.category = category;
            self.cancel = cancel;
            self.deletecategory = deletecategory;

                $scope.totalItems = Object.keys(self.category).length;
                $scope.currentPage = 1;
                $scope.itemsPerPage = 5;
                $scope.maxSize = 5;
                $scope.setPage = function(pageNo) {
                    $scope.currentPage = pageNo;
                };
                $scope.pageChanged = function() {

                };
                $scope.$watch('search', function(term) {
                    var obj = term;
                    $scope.filtered = $filter('filter')(self.category, obj);
                    $scope.currentPage = 1;
                });
        }

        init();
    }
}
module.exports = categoryController;