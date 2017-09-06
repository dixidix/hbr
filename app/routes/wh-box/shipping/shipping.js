function shippingController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line
    app.controller('shippingCtrl', shippingCtrl);
    shippingCtrl.$inject = ['shippingService', 'boxService', '$uibModal', '$state'];
    app.controller('modalAddShippingBoxCtrl', modalAddShippingBoxCtrl);
    modalAddShippingBoxCtrl.$inject = ['boxService', 'shippingService', 'authenticationService', '$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', 'box', 'boxes', 'isEditing', '$rootScope', '$http'];


    function shippingCtrl(shippingService, boxService, $uibModal, $state) {
        var self = this; //jshint ignore:line

        function add() {
            var modalInstance = $uibModal.open({
                templateUrl: './hbr-selfie/dist/routes/wh-box/shipping/modals/add-box.template.html',
                controller: 'modalAddShippingBoxCtrl',
                controllerAs: 'modalAddShippingBox',
                size: 'sm',
                resolve: {
                    box: function() {
                        return self.shippingBox;
                    },
                    boxes: function() {
                        return self.boxes;
                    },
                    isEditing: function() {
                        return self.isEditing;
                    }
                }
            });
        }

        function addBox() {
            add();
        }

        function editBox(box) {
            self.isEditing = true;
            self.shippingBox = box;
            add();
        }

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
                self.filterName = self.boxLang.room.filter.default;
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
                    if (filter.filterQuery !== 'company_name' && filter.filterQuery !== 'warehouse_name' && filter.filterQuery !== 'age') {
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
                    }
                });
            });
        }

        function removeFilter(index) {
            self.multipleFilter.splice(index, 1);
            self.filteredBoxes = self.boxes;
            filterBoxes();
        }

        function getAllBoxes(isAdmin) {
            if (isAdmin == 1) {
                boxService._getAllBoxes().then(function(response) {
                        self.boxes = response.data.boxes;
                        self.filteredBoxes = angular.copy(self.boxes);
                        self.boxes.forEach(function(box) {
                            var created = moment(new Date(parseInt(box.created)));
                            box.age = moment().diff(created, 'days');;
                        });
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
            } else {
                boxService._getBoxesByUserId().then(function(response) {
                        self.boxes = response.data.boxes;
                        self.filteredBoxes = angular.copy(self.boxes);
                        self.boxes.forEach(function(box) {
                            var created = moment(new Date(parseInt(box.created)));
                            box.age = moment().diff(created, 'days');;
                        });
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
            }
        }

        function dragEnter(location, box) {
            box.location = location;
            boxService._editBox(box);
        }

        function notify(box, index) {

        }

        function navigate(box) {
            $state.go('dashboard.stock_rooms', { boxId: box.id }, { reload: true });
        }

        function init() {
            self.shippingBox = {};
            self.isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            shippingService._getLang().then(function(lang) {
                self.lang = lang;
            });
            boxService._getLang().then(function(lang) {
                self.boxLang = lang;
                self.filterName = lang.room.filter.default;
            });
            self.boxes = [];
            getAllBoxes(self.isAdmin);
            self.dragEnter = dragEnter;
            self.notify = notify;
            self.navigate = navigate;
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
        }
        init();
    }

    function modalAddShippingBoxCtrl(boxService, shippingService, authenticationService, $scope, $state, $filter, $uibModalInstance, $sce, $compile, box, boxes, isEditing, $rootScope, $http) {
        var self = this;

        function addBox() {

        }

        function cancel() {
            self.spinner = false;
            $uibModalInstance.dismiss('cancel');
        }

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
                self.filterName = self.boxLang.room.filter.default;
                filterBoxes();
            }
        }

        function filterBoxes() {
            self.searched = true;
            self.multipleFilter.forEach(function(filter) {
                self.filteredBoxes = self.boxes.filter(function(box) {
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
                    if (filter.filterQuery !== 'company_name' && filter.filterQuery !== 'warehouse_name' && filter.filterQuery !== 'age') {
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
                    }
                });
            });
        }

        function removeFilter(index) {
            self.multipleFilter.splice(index, 1);
            self.filteredBoxes = [];
            filterBoxes();
            if (!self.filteredBoxes.length) {
                self.searched = false;
            }
        }

        function calculate() {
            if (self.shippingBox.boxes.length) {
                self.shippingBox.boxes.forEach(function(box) {
                    self.shippingBox.weight = (parseFloat(self.shippingBox.weight) + parseFloat(box.box_weight)).toFixed(2);
                    self.shippingBox.value += (parseFloat(self.shippingBox.value) + parseFloat(box.box_value)).toFixed(2);
                    self.shippingBox.shipping_value = (parseFloat(self.shippingBox.shipping_value) + parseFloat(box.box_shipping_value)).toFixed(2);
                    self.shippingBox.warehouse_value = (parseFloat(self.shippingBox.warehouse_value) + parseFloat(box.box_warehouse_value)).toFixed(2);
                    self.shippingBox.stock = (parseFloat(self.shippingBox.stock) + parseFloat(box.box_stock)).toFixed(2);
                });
            }
        }

        function addToShipping(index, box) {
            if (box.box_stock > 0) {
                var shippingBox = angular.copy(box);
                var item = self.shippingBox.boxes.some(function(item) {
                    return item.id === box.id;
                });

                if (!item) {
                    self.shippingBox.boxes.push(shippingBox);
                    calculate();
                }

                self.boxes = self.boxes.filter(function(boxToFind) {
                    return boxToFind.id !== box.id;
                });

                self.filteredBoxes = self.filteredBoxes.filter(function(boxToFind) {
                    return boxToFind.id !== box.id;
                });

                angular.element('.stock-card')[0].click();
            }
        }

        function cancelAddToShipping() {
            angular.element('.stock-card')[0].click();
        }

        function init() {
            self.searched = false;
            self.boxes = boxes;
            self.cancel = cancel;
            self.addBox = addBox;
            self.spinner = false;
            self.multipleFilter = [];
            self.removeFilter = removeFilter;
            self.searchBy = "";
            self.filterQuery = "";
            self.setFilter = setFilter;
            self.applyFilter = applyFilter;
            self.filteredBoxes = [];
            self.shippingBox = {
                boxes: [],
                weight: 0.00,
                value: 0.00,
                shipping_value: 0.00,
                warehouse_value: 0.00,
                stock: 0
            };
            self.boxLang = {};
            self.addToShipping = addToShipping;
            self.cancelAddToShipping = cancelAddToShipping;
            self.stockToAdd = 0;
            self.isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            shippingService._getLang(self.isAdmin).then(function(lang) {
                self.lang = lang;
                if (Object.keys(self.shippingBox).length) {
                    self.lang.form.title = self.lang.form.edit.title;
                } else {
                    self.lang.form.title = self.lang.form.add.title;
                }
            });
            boxService._getLang().then(function(lang) {
                self.boxLang = lang;
                self.filterName = lang.room.filter.default;
            });
        }
        init();
    }
}
module.exports = shippingController;