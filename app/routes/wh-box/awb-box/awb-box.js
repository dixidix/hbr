function awbBoxController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('awbBoxCtrl', awbBoxCtrl);
    awbBoxCtrl.$inject = ['awbboxService', '$scope', '$state', '$uibModal', '$q'];

    app.controller('modalCtrl', modalCtrl);
    modalCtrl.$inject = ['awbboxService', 'authenticationService', '$scope', '$state', '$uibModalInstance', 'box', 'isEditing', '$rootScope', '$http', '$q'];


    function awbBoxCtrl(awbboxService, $scope, $state, $uibModal, $q) {
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
                backdrop: 'static',
                scope: $scope,
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
            $state.go('dashboard.stock_rooms', { boxId: box.id }, { reload: true });
        }

        function getAllBoxes(isAdmin) {
            if (isAdmin || self.clientType == '2') {
                awbboxService._getAllAwbBoxes().then(function(res) {
                    self.boxes = res.data.awb_boxes;
                    self.filteredBoxes = angular.copy(self.boxes);
                });
            } else {
                awbboxService._getAwbBoxesByUserId().then(function(res) {
                    self.boxes = res.data.awb_boxes;
                    self.filteredBoxes = angular.copy(self.boxes);
                });
            }
        }

        function cancelDeleteBox() {
            angular.element('.awb-card_footer')[0].click();
        }

        function deleteBox(index, boxToDelete) {
            awbboxService._deleteBox(boxToDelete).then(function() {
                if (boxToDelete.bills.length) {
                    var sequence = $q.defer();
                    sequence.resolve();
                    sequence = sequence.promise;
                    angular.forEach(boxToDelete.bills, function(bill) {
                        sequence = sequence.then(function() {
                            return awbboxService._deleteBill(bill);
                        });
                    });
                    $q.all(sequence).then(function() {
                        angular.element('.awb-card_footer')[0].click();
                        self.filteredBoxes.splice(index, 1);
                        self.boxes.filter(function(box) {
                            if (box.id === boxToDelete.id) {
                                self.boxes.splice(box, 1);
                            }
                        })
                    });
                } else {
                    $state.go('dashboard.awb-box', {}, { reload: true });
                }
            });
        }

        function init() {
            self.searched = false;
            self.isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            self.clientType = parseInt(sessionStorage.getItem('clientType'));
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
            self.cancelDeleteBox = cancelDeleteBox;
            self.deleteBox = deleteBox;
            getAllBoxes(self.isAdmin);
        }
        init();
    }

    function modalCtrl(awbboxService, authenticationService, $scope, $state, $uibModalInstance, box, isEditing, $rootScope, $http, $q) {
        var self = this;

        function cancel() {
            self.spinner = false;
            self.box.bills = self.billCopy;
            $uibModalInstance.dismiss('cancel');
            $state.go('dashboard.awb-box', {}, { reload: true });
        };


        function billIsValid(field) {
            var isValid = true;
            field = field || null;
            if (self.billSubmitted) {
                if (!self.bill.number.length && (field == null || field == "bill-number")) {
                    isValid = false;
                    self.errors.bills.number = self.lang.form.errors.bills.number.required;
                } else {
                    self.errors.bills.number = "";
                }
                if (!self.bill.value || self.bill.value == 0 && (field == null || field == "bill-value")) {
                    isValid = false;
                    self.errors.bills.value = self.lang.form.errors.bills.value.required;
                } else {
                    self.errors.bills.value = "";
                }
                if (!self.bill.long_desc.length && (field == null || field == "bill-long_desc")) {
                    isValid = false;
                    self.errors.bills.long_desc = self.lang.form.errors.bills.long_desc.required;
                } else {
                    self.errors.bills.long_desc = "";
                }
                if (!self.bill.stock || self.bill.stock == 0 && (field == null || field == "bill-stock")) {
                    isValid = false;
                    self.errors.bills.stock = self.lang.form.errors.bills.stock.required;
                } else {
                    self.errors.bills.stock = "";
                }

            }
            return isValid;
        }

        function boxIsValid(field) {
            var isValid = true;
            field = field || null;
            if (self.boxForm.$submitted) {
                if (!self.box.provider || !self.box.provider.length && (field == null || field == "box-provider")) {
                    isValid = false;
                    self.errors.provider = self.lang.form.errors.provider.required;
                } else {
                    self.errors.provider = "";
                }
                if (!self.box.tracking || !self.box.tracking.length && (field == null || field == "box-tracking")) {
                    isValid = false;
                    self.errors.tracking = self.lang.form.errors.tracking.required;
                } else {
                    self.errors.tracking = "";
                }
                if (!self.box.whId || self.box.whId && !self.box.whId.id && (field == null || field == "box-warehouse")) {
                    isValid = false;
                    self.errors.warehouse = self.lang.form.errors.warehouse.required;
                } else {
                    self.errors.warehouse = "";
                }
                if (!self.box.bills.length) {
                    isValid = false;
                    self.errors.billsQty = self.lang.form.errors.billsQty.required;
                } else {
                    self.errors.billsQty = "";
                }
            }
            return isValid;
        }

        function addBox() {
            self.boxForm.$submitted = true;
            if (boxIsValid()) {
                $scope.invalidBox = false;
                self.spinner = true;
                awbboxService._addAwbBox(self.box).then(function(response) {
                    if (response.data.success) {
                        var sequence = [];
                        angular.forEach(self.box.bills, function(bill) {
                            sequence.push(awbboxService._addBills(bill, response.data.boxId));
                        });
                        Promise.all(sequence).then(function(response) {
                            self.spinner = false;
                            $uibModalInstance.dismiss('cancel');
                            $state.go('dashboard.awb-box', {}, { reload: true });

                        });
                    }
                });
            } else {
                angular.element('.modal').scrollTop(0);
                $scope.invalidBox = true;
            }
        };

        $scope.getFilename = function(file) {
            var file = file.files[0];
            if (file) {
                if (file.type === "application/pdf" || file.type === "image/png" || file.type === "image/jpeg") {
                    self.bill.hasFile = true;
                    self.billIsValid();
                } else {
                    self.bill.hasFile = false;
                    self.bill.fileError = self.lang.form.fileError;
                    self.billIsValid();
                }
            } else {
                self.bill.hasFile = false;
                self.billIsValid();
            }
        }

        function edit() {
            self.spinner = true;
            self.box.status = 0;
            var editedBill = false;
            if (boxIsValid()) {
                awbboxService._editBox(self.box).then(function(response) {
                    if (response.data.success && self.box.bills.length) {
                        var sequence = $q.defer();
                        sequence.resolve();
                        sequence = sequence.promise;
                        angular.forEach(self.box.bills, function(bill) {
                            if (!bill.id) {
                                editedBill = true;
                                sequence = sequence.then(function() {
                                    return awbboxService._addBills(bill, self.box.id);
                                });
                            }
                        });
                        if (self.isEditing && editedBill) {
                            $q.all(sequence).then(function() {
                                self.spinner = false;
                                setTimeout(function() {
                                    $uibModalInstance.dismiss('cancel');
                                    $state.go('dashboard.awb-box', {}, { reload: true });
                                }, 1000);
                            });
                        } else {
                            self.spinner = false;
                            $uibModalInstance.dismiss('cancel');
                            $state.go('dashboard.awb-box', {}, { reload: true });
                        }
                    } else {
                        $uibModalInstance.dismiss('cancel');
                        $state.go('dashboard.awb-box', {}, { reload: true });
                    }
                });
            }
        }

        function editBill() {
            if (billIsValid()) {
                $scope.invalidBill = false;
                self.billSubmitted = false;
                $scope.billEditing = true;
                self.box.box_value = 0;
                self.box.box_weight = 0;
                self.box.box_stock = 0;
                self.box.bills.forEach(function(bill) {
                    self.box.box_value = parseFloat(parseFloat(self.box.box_value) + parseFloat(bill.value)).toFixed(2);
                    self.box.box_weight = parseFloat(parseFloat(self.box.box_weight || 0.00) + parseFloat(bill.weight || 0.00)).toFixed(2);
                    self.box.box_stock = parseInt(self.box.box_stock) + parseInt(bill.stock);
                });
                awbboxService._editBox(self.box).then(function(response) {
                    awbboxService._editBill(self.bill).then(function() {
                        $scope.billEditing = false;
                        self.bill = new billModel();
                        self.errors.bills = self.errors.bills = new BillErrorModel();
                        self.isValid = true;
                        $('#bill_file').val("");
                        self.billAction = self.lang.form.add.bill.button;
                        self.billEdit = false;
                    });
                });
            } else {
                $scope.billEditing = false;
                $scope.invalidBill = true;
            }
        }

        function addBill() {
            self.billSubmitted = true;
            if (billIsValid()) {
                $scope.invalidBill = false;
                self.billSubmitted = false;
                self.box.box_value = parseFloat(parseFloat(self.box.box_value) + parseFloat(self.bill.value)).toFixed(2);
                self.box.box_weight = parseFloat(parseFloat(self.box.box_weight || 0.00) + parseFloat(self.bill.weight || 0.00)).toFixed(2);
                self.box.box_stock = parseInt(self.box.box_stock) + parseInt(self.bill.stock);
                self.box.bills.push(self.bill);
                self.bill = new billModel();
                self.errors.bills = self.errors.bills = new BillErrorModel();
                self.isValid = true;
                $('#bill_file').val("");
            } else {
                $scope.invalidBill = true;
            }
            boxIsValid();
        }

        function billModel() {
            this.number = "";
            this.value = 0.00;
            this.weight = 0;
            this.stock = 0;
            this.bill_file = "";
            this.long_desc = "";
            this.hasFile = false;
        }

        function boxModel(box) {
            this.box_value = box.box_value || 0.00;
            this.box_weight = box.box_weight || 0.00;
            this.box_stock = box.box_stock || 0;
            this.tracking = box.tracking || "";
            this.provider = box.provider || "";
            this.bills = box.bills || [];
            this.whId = box.warehouse || {};
            if (box.id) {
                this.id = box.id;
            }
        }

        function BoxErrorModel() {
            var self = this;
            self.provider = "";
            self.tracking = "";
            self.warehouse = "";
            self.billsQty = "";
            self.bills = new BillErrorModel();
        }

        function BillErrorModel() {
            var self = this;
            self.number = "";
            self.value = "";
            self.long_desc = "";
            self.stock = "";
            self.files = "";
        }

        function removeBill(index, bill) {
            self.billAction = self.lang.form.add.bill.button;
            self.billEdit = false;
            if (self.isEditing) {
                awbboxService._deleteBill(bill).then(function() {
                    self.box.bills.splice(index, 1);
                    self.box.box_value = parseFloat(parseFloat(self.box.box_value) - parseFloat(bill.value)).toFixed(2);
                    self.box.box_weight = parseFloat(parseFloat(self.box.box_weight) - parseFloat(bill.weight)).toFixed(2);
                    self.box.box_stock = parseInt(self.box.box_stock) - parseInt(bill.stock);
                    awbboxService._editBox(self.box);

                })
            } else {
                self.box.bills.splice(index, 1);
                self.box.box_value = parseFloat(parseFloat(self.box.box_value) - parseFloat(bill.value)).toFixed(2);
                self.box.box_weight = parseFloat(parseFloat(self.box.box_weight) - parseFloat(bill.weight)).toFixed(2);
                self.box.box_stock = parseInt(self.box.box_stock) - parseInt(bill.stock);
            }
            boxIsValid();
        }

        function prepareEditBill(index, bill) {
            bill.value = parseFloat(bill.value);
            bill.weight = parseFloat(bill.weight);
            bill.stock = parseInt(bill.stock);
            self.bill = bill;
            self.billEdit = true;
            self.billAction = self.lang.form.edit.bill.button;
            $('#bill_file').val("");
        }

        function cancelEdit() {
            self.bill = {};
            self.billAction = self.lang.form.add.bill.button;
            $('#bill_file').val("");
            self.billEdit = false;
        }

        function init() {
            self.billSubmitted = false;
            self.box = new boxModel(box);
            self.billCopy = angular.copy(self.box.bills) || [];
            self.isEditing = isEditing;
            self.cancel = cancel;
            self.addBox = addBox;
            self.cancelEdit = cancelEdit;
            self.bill = new billModel();
            self.spinner = false;
            self.addBill = addBill;
            self.editBill = editBill;
            self.prepareEditBill = prepareEditBill;
            self.errors = new BoxErrorModel();
            self.boxIsValid = boxIsValid;
            self.billIsValid = billIsValid;
            self.hasFile = false;
            self.bill.fileError = "";
            self.removeBill = removeBill;
            self.edit = edit;
            self.isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            awbboxService._getLang(self.isAdmin).then(function(lang) {
                self.lang = lang;
                self.billAction = self.lang.form.add.bill.button;
                self.billEdit = false;
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