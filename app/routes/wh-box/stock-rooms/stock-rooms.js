function stockRoomsController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('stockRoomsCtrl', stockRoomsCtrl);
    stockRoomsCtrl.$inject = ['$filter', '$http', 'boxService', '$uibModal', '$state'];

    app.controller('modalAddBoxCtrl', modalAddBoxCtrl);
    modalAddBoxCtrl.$inject = ['boxService', 'authenticationService', '$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', 'box', 'isEditing', '$rootScope', '$http'];

    function stockRoomsCtrl($filter, $http, boxService, $uibModal, $state) {
        var self = this; //jshint ignore:line

        function setFilter(query, title) {
            self.filterName = title;
            self.filterQuery = query;

            if (self.filterQuery === 'ageGreater' || self.filterQuery === 'ageLess') {
                self.filterQueryCondition = self.filterQuery;
                self.filterQuery = 'age';
            }
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
                    if (filter.filterQuery === 'age') {
                        if (self.filterQueryCondition === 'ageGreater') {
                            if (parseInt(box[filter.filterQuery]) >= parseInt(filter.searchBy)) {
                                return box;
                            }
                        } else if (self.filterQueryCondition === 'ageLess') {
                            if (parseInt(box[filter.filterQuery]) <= parseInt(filter.searchBy)) {
                                return box;
                            }
                        }
                    }
                    if (filter.filterQuery !== 'company_name' && filter.filterQuery !== 'warehouse_name' && filter.filterQuery !== 'age' && filter.filterQuery !== 'id') {
                        if (box[filter.filterQuery].toString().toLowerCase().includes(filter.searchBy.toLowerCase())) {
                            return box;
                        }
                    } else if (filter.filterQuery === 'company_name') {
                        if (box.user[filter.filterQuery].toString().toLowerCase().includes(filter.searchBy.toLowerCase())) {
                            return box;
                        }
                    } else if (filter.filterQuery === 'warehouse_name') {
                        if (box.warehouse['name'].toString().toLowerCase().includes(filter.searchBy.toLowerCase())) {
                            return box;
                        }
                    } else if (filter.filterQuery === 'id') {
                        if (box[filter.filterQuery] == filter.searchBy) {
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

        function add(box) {
            box = box || {};
            var modalInstance = $uibModal.open({
                templateUrl: './hbr-selfie/dist/routes/wh-box/stock-rooms/modals/add-box.template.html',
                controller: 'modalAddBoxCtrl',
                controllerAs: 'modalAddBox',
                size: 'sm',
                resolve: {
                    box: box,
                    isEditing: self.isEditing
                }
            });
        }

        function addBox() {
            add();
        }

        function editBox(box) {
            self.isEditing = true;
            add(box);
        }

        function deleteBox(index, boxToDelete) {
            boxService._deleteBox(boxToDelete).then(function() {
                angular.element('.footer')[0].click();
                self.filteredBoxes.splice(index, 1);
                self.boxes.filter(function(box) {
                    if (box.id === boxToDelete.id) {
                        self.boxes.splice(box, 1);
                    }
                })
            });
            console.log(self.boxes, self.filteredBoxes);
        }

        function cancelDeleteBox() {
            angular.element('.footer')[0].click();
        }


        function getAllBoxes(isAdmin) {
            if (isAdmin == 1) {
                boxService._getAllBoxes().then(function(response) {
                        self.boxes = response.data.boxes;
                        self.boxes.forEach(function(box) {
                            var created = moment(new Date(parseInt(box.created)));
                            box.age = moment().diff(created, 'days');;
                        });
                        self.filteredBoxes = angular.copy(self.boxes);
                        self.room = boxService.calculate_room(self.filteredBoxes);
                        if ($state.params.boxId) {
                            setFilter('id', self.lang.room.filter.list.box_id);
                            self.searchBy = $state.params.boxId;
                            applyFilter();
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
            } else {
                boxService._getBoxesByUserId().then(function(response) {
                        self.boxes = response.data.boxes;
                        self.boxes.forEach(function(box) {
                            var created = moment(new Date(parseInt(box.created)));
                            box.age = moment().diff(created, 'days');;
                        });
                        self.filteredBoxes = angular.copy(self.boxes);
                        self.room = boxService.calculate_room(self.filteredBoxes);
                        if ($state.params.boxId) {
                            setFilter('id', self.lang.room.filter.list.box_id);
                            self.searchBy = $state.params.boxId;
                            applyFilter();
                        }
                        if ($state.params.tracking) {
                            setFilter('id', self.lang.room.filter.list.box_id);
                            self.searchBy = "1";
                            applyFilter();
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
            }
        }


        function init() {
            self.isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            boxService._getLang().then(function(lang) {
                self.lang = lang;
                self.filterName = self.lang.room.filter.default;
            });
            self.isEditing = false;
            self.boxes = [];
            self.multipleFilter = [];
            self.room = {};
            self.removeFilter = removeFilter;
            self.searchBy = "";
            self.filterQuery = "";
            self.setFilter = setFilter;
            self.applyFilter = applyFilter;
            self.filteredBoxes = [];
            self.addBox = addBox;
            self.editBox = editBox;
            self.deleteBox = deleteBox;
            self.cancelDeleteBox = cancelDeleteBox;
            getAllBoxes(self.isAdmin);
        }
        init();
    }

    function modalAddBoxCtrl(boxService, authenticationService, $scope, $state, $filter, $uibModalInstance, $sce, $compile, box, isEditing, $rootScope, $http) {
        var self = this;

        function cancel() {
            self.spinner = false;
            $uibModalInstance.dismiss('cancel');
        };

        function addBox() {
            self.spinner = true;
            if (!isEditing) {
                boxService._addBox(self.box).then(function(res) {
                    if (res.data.success) {
                        self.spinner = false;
                        $state.go('dashboard.stock_rooms', {}, { reload: true });
                        $uibModalInstance.dismiss('cancel');
                    }
                });
            } else {
                boxService._editBox(self.box).then(function(res) {
                    if (res.data.success) {
                        self.spinner = false;
                        $state.go('dashboard.stock_rooms', {}, { reload: true });
                        $uibModalInstance.dismiss('cancel');
                    }
                });
            }
        };

        function init() {
            self.box = box;
            self.cancel = cancel;
            self.addBox = addBox;
            self.spinner = false;
            self.isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            boxService._getLang(self.isAdmin).then(function(lang) {
                self.lang = lang;
                if (Object.keys(box).length) {
                    self.box.box_value = parseFloat(box.box_value);
                    self.box.box_stock = parseInt(box.box_stock);
                    self.box.box_weight = parseFloat(box.box_weight);
                    self.box.whId = box.warehouse;
                    self.lang.form.title = self.lang.form.edit.title;
                } else {
                    self.lang.form.title = self.lang.form.add.title;
                }
                $http.get('./hbr-selfie/dist/php/warehouse.php', {
                    params: {
                        action: 'getAll'
                    }
                }).then(function(response) {
                    self.warehouses = response.data.warehouses;
                });
            });
        }

        init();
    }
}
module.exports = stockRoomsController;