function awbBoxController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('awbBoxCtrl', awbBoxCtrl);
    awbBoxCtrl.$inject = ['awbboxService', '$scope', '$state', '$uibModal'];

    app.controller('modalCtrl', modalCtrl);
    modalCtrl.$inject = ['awbboxService', 'authenticationService', '$scope', '$state', '$uibModalInstance', 'box', 'isEditing', '$rootScope', '$http', '$q'];


    function awbBoxCtrl(awbboxService, $scope, $state, $uibModal) {
        var self = this; //jshint ignore:line
        function setFilter(query, title) {
            self.filterName = title;
            self.filterQuery = query;

            if (self.filterQuery === 'ageGreater' || self.filterQuery === 'ageLess') {
                self.filterQueryCondition = self.filterQuery;
                self.filterQuery = 'age';
            }
        }

        function add(box) {
            box = box || {};
            var modalInstance = $uibModal.open({
                templateUrl: './hbr-selfie/dist/routes/wh-box/awb-box/modals/add-box.template.html',
                controller: 'modalCtrl',
                controllerAs: 'modal',
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
                self.filterName = $scope.lang.filter.default;
                filterBoxes();
            }
        }

        function filterBoxes() {
            self.searched = true;
            self.multipleFilter.forEach(function(filter) {
                self.filteredBoxes = self.boxes.filter(function(box) {

                    if (filter.filterQuery !== 'company_name' && filter.filterQuery !== 'warehouse_name' && filter.filterQuery !== 'age' && filter.filterQuery !== 'bill') {
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
                    } else if (filter.filterQuery === 'age') {
                        if (self.filterQueryCondition === 'ageGreater') {
                            if (parseInt(box[filter.filterQuery]) >= parseInt(filter.searchBy)) {
                                return box;
                            }
                        } else if (self.filterQueryCondition === 'ageLess') {
                            if (parseInt(box[filter.filterQuery]) <= parseInt(filter.searchBy)) {
                                return box;
                            }
                        }
                    } else if (filter.filterQuery === 'bill') {
                        var existBill = false;
                        box.bills.some(function(bill) {
                            if (bill.number == filter.searchBy) {
                                existBill = true;
                            }
                        });
                        if (existBill) {
                            return box;
                        }
                    }
                });
            });
        }

        function removeFilter(index) {
            self.multipleFilter.splice(index, 1);
            if (self.multipleFilter.length) {
                self.filteredBoxes = [];
                filterBoxes();
            } else {
                self.filteredBoxes = angular.copy(self.boxes);
            }
            if (!self.filteredBoxes.length) {
                self.searched = false;
            }
        }

        function navigate(box) {
            $state.go('dashboard.stock_rooms', { tracking: box.tracking }, { reload: true });
        }

        function getAllBoxes(isAdmin) {
            self.boxes = awbboxService._getAllAwbBoxes();
            self.filteredBoxes = angular.copy(self.boxes);
        }

        function init() {
            self.searched = false;
            self.isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            awbboxService._getLang().then(function(lang) {
                $scope.lang = lang;
                self.filterName = $scope.lang.filter.default;
            });
            self.boxes = [];
            self.spinner = false;
            self.multipleFilter = [];
            self.removeFilter = removeFilter;
            self.searchBy = "";
            self.filterQuery = "";
            self.setFilter = setFilter;
            self.applyFilter = applyFilter;
            self.filteredBoxes = [];
            $scope.navigate = navigate;
            self.addBox = addBox;
            $scope.editBox = editBox;
            getAllBoxes(self.isAdmin);
        }
        init();
    }

    function modalCtrl(awbboxService, authenticationService, $scope, $state, $uibModalInstance, box, isEditing, $rootScope, $http, $q) {
        var self = this;

        function cancel() {
            self.spinner = false;
            $uibModalInstance.dismiss('cancel');
        };

        function addBox() {
            awbboxService._addAwbBox(self.box).then(function(response) {
                if (response.success) {
                    var sequence = $q.defer();
                    sequence.resolve();
                    sequence = sequence.promise;
                    angular.forEach(self.box.bills, function(bill) {
                        sequence = sequence.then(function() {
                            return awbboxService._addBills(bill, response.boxId);
                        });
                    });
                    $q.all(sequence).then(function() {

                    });
                }
            });
        };

        function addBill() {
            self.box.box_value = parseFloat(parseFloat(self.box.box_value) + parseFloat(self.bill.value)).toFixed(2);
            self.box.weight = parseFloat(parseFloat(self.box.weight || 0.00) + parseFloat(self.bill.weight || 0.00)).toFixed(2);
            self.box.stock = parseInt(self.box.stock) + parseInt(self.bill.stock);
            self.box.bills.push(self.bill);
            self.bill = new billModel();
            $('#bill_file').val("");

        }

        function billModel() {
            this.number = "";
            this.value = 0.00;
            this.weight = 0.00;
            this.stock = 0;
            this.bill_file = "";
            this.long_desc = "";
        }

        function boxModel(box) {
            this.box_value = box.box_value || 0.00;
            this.weight = box.weight || 0.00;
            this.stock = box.stock || 0;
            this.tracking = box.tracking || "";
            this.provider = box.provider || "";
            this.bills = box.bills || [];
            this.whId = box.warehouse || {};
        }

        function removeBill(index, bill) {
            self.box.bills.splice(index, 1);
            self.box.box_value = parseFloat(parseFloat(self.box.box_value) - parseFloat(bill.value)).toFixed(2);
            self.box.weight = parseFloat(parseFloat(self.box.weight) - parseFloat(bill.weight)).toFixed(2);
            self.box.stock = parseInt(self.box.stock) - parseInt(bill.stock);
        }

        function init() {
            self.box = new boxModel(box);
            self.cancel = cancel;
            self.addBox = addBox;
            self.bill = new billModel();
            self.spinner = false;
            self.addBill = addBill;
            self.removeBill = removeBill;
            self.isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            awbboxService._getLang(self.isAdmin).then(function(lang) {
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
module.exports = awbBoxController;