function stockRoomsController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('stockRoomsCtrl', stockRoomsCtrl);
    stockRoomsCtrl.$inject = ['$filter', '$http', 'boxService', '$uibModal', '$state', 'authenticationService'];

    app.controller('modalAddBoxCtrl', modalAddBoxCtrl);
    modalAddBoxCtrl.$inject = ['boxService', 'authenticationService', 'awbboxService', '$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', 'box', 'isEditing', '$rootScope', '$http'];

    function stockRoomsCtrl($filter, $http, boxService, $uibModal, $state, authenticationService) {
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
                    if (filter.filterQuery !== 'company_name' && filter.filterQuery !== 'warehouse_name' && filter.filterQuery !== 'age' && filter.filterQuery !== 'status' && filter.filterQuery !== 'id') {
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
                    } else if (filter.filterQuery === 'status') {
                        if (filter.searchBy == 'Completo' || filter.searchBy == 'Completed') {
                            if (box['status'] == 1) {
                                return box;
                            }
                        }
                        if (filter.searchBy == 'En progreso' || filter.searchBy == 'In Progress') {
                            if (box['status'] == 0) {
                                return box;
                            }
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
            self.isEditing = false;
            add();
        }

        function editBox(box) {
            self.isEditing = true;
            add(box);
        }

        function deleteBox(index, boxToDelete) {
            boxToDelete.remaining = parseInt(boxToDelete.remaining) + parseInt(boxToDelete.quantity);
            boxService._deleteEnterBox(boxToDelete).then(function() {
                angular.element('.footer')[0].click();
                boxService.calculate_room();
                self.filteredBoxes.splice(index, 1);
                self.boxes.filter(function(box) {
                    if (box.id === boxToDelete.id) {
                        self.boxes.splice(box, 1);
                    }
                })
            });
        }

        function finishBox(index, boxToUpdate) {
            boxToUpdate.status = 1;
            boxService._finishEnterBox(boxToUpdate).then(function() {
                angular.element('.footer')[0].click();
            });
        }

        function cancelDeleteBox() {
            angular.element('.footer')[0].click();
        }

        function getAllBoxes(isAdmin) {
            authenticationService.checkAuth().then(function(response) {
                var whId = parseInt(response.data.uid);
                boxService._getAllEnterBoxes().then(function(response) {
                        self.boxes = response.data.boxes;
                        if (isAdmin == 0) {
                            self.boxes = self.boxes.filter(function(box) {
                                if (box.warehouse.id == whId) {
                                    return box;
                                }
                            });
                        }
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
            });
        }

        function init() {
            self.isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            self.clientType = parseInt(sessionStorage.getItem('clientType'));
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
            self.finishBox = finishBox;
            self.cancelDeleteBox = cancelDeleteBox;
            getAllBoxes(self.isAdmin);
        }
        init();
    }

    function modalAddBoxCtrl(boxService, authenticationService, awbboxService, $scope, $state, $filter, $uibModalInstance, $sce, $compile, box, isEditing, $rootScope, $http) {
        var self = this;

        function cancel() {
            self.spinner = false;
            $uibModalInstance.dismiss('cancel');
        };

        function addBox() {
            self.spinner = true;
            self.box.aditional_total = parseInt(self.box.aditional_unit || 0) * parseFloat(self.box.aditional_value || 0);
            if (!isEditing) {
                boxService._addEnterBox(self.box).then(function(res) {
                    if (res.data.success) {
                        self.spinner = false;
                        $state.go('dashboard.stock_rooms', {}, { reload: true });
                        $uibModalInstance.dismiss('cancel');
                    }
                });
            } else {
                boxService._editEnterBox(self.box, self.baseBox).then(function(res) {
                    if (res.data.success) {
                        self.spinner = false;
                        $state.go('dashboard.stock_rooms', {}, { reload: true });
                        $uibModalInstance.dismiss('cancel');
                    }
                });
            }
        };

        function setBox(box) {
            if (!self.isEditing) {
                self.box_list.forEach(function(box) {
                    box.isActive = false;
                });

                box.isActive = true;
                self.selectedBox = true;
                self.box = box;
            }
        }

        function getBoxList(user) {
            self.selectedBox = false;
            authenticationService.checkAuth().then(function(response) {
                awbboxService._getAllAwbBoxes().then(function(res) {
                    var whId = parseInt(response.data.uid);
                    if (response.data.isAdmin == 0) {
                        self.box_list = res.data.awb_boxes.filter(function(box) {
                            if (box.uid == user.id && box.warehouse.id == whId) {
                                return box;
                            }
                        });
                    } else {
                        self.box_list = res.data.awb_boxes;
                    }
                    if (self.box) {
                        self.box_list.filter(function(box) {
                            if (box.id == self.box.awb_boxes_id) {
                                box.isActive = true;
                                self.selectedBox = true;
                                self.box.bills = box.bills;
                            } else {
                                box.isActive = false;
                            }
                        })
                    }
                });
            });
        }

        function init() {
            self.box = box || {};
            self.baseBox = angular.copy(box);
            self.getBoxList = getBoxList;
            self.setBox = setBox;
            self.box_list = [];
            self.selectedBox = false;
            self.isEditing = isEditing;
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
                    self.box.aditional_unit = box.aditional_unit || '0';
                    self.box.aditional_value = box.aditional_value || '0.00';
                    self.box.aditional_total = box.aditional_total || '0.00';
                    self.box.whId = box.warehouse;
                    self.lang.form.title = self.lang.form.edit.title;
                } else {
                    self.lang.form.title = self.lang.form.add.title;
                }
                $http.get('./hbr-selfie/dist/php/users.php', {
                    params: {
                        client_type: '1',
                        action: 'getAll'
                    }
                }).then(function(response) {
                    self.users = response.data.users;
                    if (self.box.user) {
                        self.selectedUser = self.box.user;
                        getBoxList(self.selectedUser);
                    }
                });
            });
        }

        init();
    }
}
module.exports = stockRoomsController;