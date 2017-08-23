function stockRoomsController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('stockRoomsCtrl', stockRoomsCtrl);
    stockRoomsCtrl.$inject = ['$filter', '$http', 'boxService', '$uibModal'];

    app.controller('modalAddBoxCtrl', modalAddBoxCtrl);
    modalAddBoxCtrl.$inject = ['boxService', '$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', '$rootScope', '$http'];

    function stockRoomsCtrl($filter, $http, boxService, $uibModal) {
        var self = this; //jshint ignore:line

        function setFilter(query, title) {
            self.filterName = title;
            self.filterQuery = query;
        }

        function applyFilter() {
            if (self.searchBy && self.filterQuery) {
                self.multipleFilter.push({
                    filterQuery: self.filterQuery,
                    filterName: self.filterName,
                    searchBy: self.searchBy
                });

                self.searchBy = "";
                self.filterQuery = "";
                self.searchBy = "";
                self.filterName = self.lang.room.filter.default;
                filterBoxes();
            }
        }

        function filterBoxes() {
            self.multipleFilter.forEach(function(filter) {
                self.filteredBoxes = self.filteredBoxes.filter(function(box) {
                    if (filter.filterQuery !== 'company_name' && filter.filterQuery !== 'warehouse_name') {
                        if (box[filter.filterQuery].toString().toLowerCase().includes(filter.searchBy.toLowerCase())) {
                            return box;
                        }
                    } else if (filter.filterQuery === 'company_name') {
                        if (box.user[filter.filterQuery].toString().toLowerCase().includes(filter.searchBy.toLowerCase())) {
                            return box;
                        }
                    } else if (filter.filterQuery === 'warehouse_name') {
                        if (box.warehouse[filter.filterQuery].toString().toLowerCase().includes(filter.searchBy.toLowerCase())) {
                            return box;
                        }
                    }
                });
            });
            self.room = boxService.calculate_room(self.filteredBoxes);
        }

        function removeFilter(index) {
            self.multipleFilter.splice(index, 1);
            self.filteredBoxes = self.boxes;
            filterBoxes();
        }

        function add() {
            var modalInstance = $uibModal.open({
                templateUrl: './hbr-selfie/dist/routes/wh-box/stock-rooms/modals/add-box.template.html',
                controller: 'modalAddBoxCtrl',
                controllerAs: 'modalAddBox',
                size: 'sm'
            });
        }

        function addBox() {
            add();
        }

        function getAllBoxes() {
            boxService._getAllBoxes().then(function(response) {
                    self.boxes = response.data.boxes;
                    self.filteredBoxes = angular.copy(self.boxes);
                    self.room = boxService.calculate_room(self.filteredBoxes);
                })
                .catch(function(err) {
                    console.log(err);
                })
        }


        function init() {
            boxService._getLang(self.isAdmin).then(function(lang) {
                self.lang = lang;
                self.filterName = self.lang.room.filter.default;
            });
            self.boxes = [];
            self.multipleFilter = [];
            self.room = {};
            self.removeFilter = removeFilter;
            self.searchBy = "";
            self.filterQuery = "";
            self.setFilter = setFilter;
            self.applyFilter = applyFilter;
            self.filteredBoxes = [];
            self.isAdmin = 0;
            self.filteredBoxes = [];
            self.addBox = addBox;
            getAllBoxes();
        }
        init();
    }

    function modalAddBoxCtrl(boxService, $scope, $state, $filter, $uibModalInstance, $sce, $compile, $rootScope, $http) {
        var self = this;

        function cancel() {
            self.spinner = false;
            $uibModalInstance.dismiss('cancel');
        };

        function addBox() {
            self.spinner = true;
            boxService._addBox(box).then(function() {
                self.spinner = false;
                $uibModalInstance.dismiss('cancel');
            });
        };

        function init() {
            self.box = {};
            self.cancel = cancel;
            self.addBox = addBox;
            self.spinner = false;
            self.isAdmin = 0;
            boxService._getLang(self.isAdmin).then(function(lang) {
                self.lang = lang;
            });
            $http.get('./hbr-selfie/dist/php/warehouse.php', {
                params: {
                    action: 'getAll'
                }
            }).then(function(response) {
                self.warehouses = response.data.warehouses;
            });
        }

        init();
    }
}
module.exports = stockRoomsController;