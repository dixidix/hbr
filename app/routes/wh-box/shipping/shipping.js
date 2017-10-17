function shippingController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line
    app.controller('shippingCtrl', shippingCtrl);
    shippingCtrl.$inject = ['shippingService', 'boxService', '$uibModal', '$state'];
    app.controller('modalAddShippingBoxCtrl', modalAddShippingBoxCtrl);
    modalAddShippingBoxCtrl.$inject = ['boxService', 'shippingService', 'authenticationService', '$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', 'box', 'boxes', 'isEditing', '$rootScope', '$http', '$q'];


    function shippingCtrl(shippingService, boxService, $uibModal, $state) {
        var self = this; //jshint ignore:line

        function add() {
            var modalInstance = $uibModal.open({
                templateUrl: './hbr-selfie/dist/routes/wh-box/shipping/modals/add-box.template.html',
                controller: 'modalAddShippingBoxCtrl',
                controllerAs: 'modalAddShippingBox',
                size: 'sm',
                backdrop: 'static',
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
            self.isEditing = false;
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

        function getAllBoxes() {
            if (self.isAdmin == 1 || self.clientType == 2) {
                shippingService._getAllShippingBox().then(function(response) {
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
                shippingService._getBoxesByUserId().then(function(response) {
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
            self.clientType = parseInt(sessionStorage.getItem('clientType'));
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

    function modalAddShippingBoxCtrl(boxService, shippingService, authenticationService, $scope, $state, $filter, $uibModalInstance, $sce, $compile, box, boxes, isEditing, $rootScope, $http, $q) {
        var self = this;


        function cancel() {
            self.spinner = false;
            $uibModalInstance.dismiss('cancel');
        }

        function setTrackingBox(box) {
            self.trackingBoxes = [];
            self.selectedTrackingBox = false;
            if (!self.isEditing) {
                self.box_list.forEach(function(box) {
                    box.isActive = false;
                });

                box.isActive = true;
                self.selectedBox = true;

                self.trackingBoxes = self.boxes.filter(function(tb) {
                    if (tb.tracking === box.tracking) {
                        return tb;
                    }
                });

            }
        }

        function setBox(trackingBox) {
            if (!self.isEditing) {
                self.trackingBoxes.forEach(function(box) {
                    box.isActive = false;
                });
                trackingBox.isActive = true;
                self.selectedTrackingBox = true;
                self.box = trackingBox;
            }
        }

        function removeDuplicates(originalArray, objKey) {
            var trimmedArray = [];
            var values = [];
            var value;

            for (var i = 0; i < originalArray.length; i++) {
                value = originalArray[i][objKey];

                if (values.indexOf(value) === -1) {
                    trimmedArray.push(originalArray[i]);
                    values.push(value);
                }
            }

            return trimmedArray;

        }

        function getBoxList(user) {
            self.box_list = [];
            self.selectedBox = false;
            authenticationService.checkAuth().then(function(response) {
                var whid = parseInt(response.data.uid);
                boxService._getAllEnterBoxes().then(function(res) {
                    self.box_list = res.data.boxes.filter(function(box) {
                        if (user && box.user.id == user.id) {
                            if (self.clientType == 2) {
                                if (box.warehouse.id == whid) {
                                    return box;
                                }
                            } else if (self.isAdmin) {
                                return box;
                            }
                        }
                    });

                    self.boxes = angular.copy(res.data.boxes);
                    self.box_list = removeDuplicates(self.box_list, 'tracking');

                    if (Object.keys(self.box).length) {
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

        function toShippingBox(box) {
            box.status = 2;
            box.user.tel = box.user.tel + " / " + box.user.cel;
            self.shippingBox.user = box.user;
            self.shippingBox.boxes.push(box);
            calculateShippingWhValue();
        }

        function calculateShippingWhValue() {
            self.shippingBox.total.weight = 0;
            self.shippingBox.total.value = 0;
            self.shippingBox.total.quantity = 0;
            self.shippingBox.total.wh_val = 0;
            self.shippingBox.total.wh_aditional_val = 0;

            self.shippingBox.boxes.forEach(function(box) {
                self.shippingBox.total.weight = parseFloat(self.shippingBox.total.weight) + parseFloat(box.box_partial_weight);
                self.shippingBox.total.value = parseFloat(self.shippingBox.total.value) + parseFloat(box.box_partial_value);
                self.shippingBox.total.quantity = parseInt(self.shippingBox.total.quantity) + parseInt(box.quantity);
                self.shippingBox.total.wh_val = parseFloat(self.shippingBox.total.wh_val) + parseFloat(box.box_warehouse_value);
                self.shippingBox.total.wh_aditional_val = parseFloat(self.shippingBox.total.wh_aditional_val) + parseFloat(box.aditional_total);
            });
        }

        function deleteSPBox(spbox, index) {
            self.boxes.filter(function(box) {
                if (box.id === spbox.id) {
                    box.status = 1;
                }
            })
            self.shippingBox.boxes.splice(index, 1);
            calculateShippingWhValue();
        }

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

        function finish() {
            shippingService._addShippingBox(self.shippingBox).then(function(res) {
                var shipping_box_id = res.data.id;
                if (res.data.success && shipping_box_id) {
                    var sequence = $q.defer();
                    sequence.resolve();
                    sequence = sequence.promise;
                    self.shippingBox.boxes.forEach(function(box) {
                        sequence = sequence.then(function() {
                            box.shipping_box_id = shipping_box_id;
                            return shippingService._updateEnterBox(box);
                        });
                    });
                    $q.all(sequence).then(function() {
                        console.log('success');
                    });
                }
            });
        }

        function nextStep(index) {
            var nextIndex = parseInt(index) + 1;
            self.tabs[nextIndex].disabled = false;
            self.tabActive = parseInt(index) + 2;
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        }

        function init() {
            self.shippingBox = {
                total: {
                    weight: 0,
                    value: 0,
                    quantity: 0,
                    wh_val: 0,
                    wh_aditional_val: 0
                },
                user: {},
                boxes: [],
                freight_val: "0.00",
                shipping_val: "0.00",
                warehouse_val: "0.00",
                aditional_unit: "0",
                aditional_value: "0.00",
                aditional_total: "0.00",
                tracking: "",
                provider: "",
                bill_file: ""
            }
            if (self.shippingBox.user) {
                self.selectedUser = self.shippingBox.user;
                getBoxList(self.shippingBox.user);
            }
            self.finish = finish;
            self.cancel = cancel;
            self.isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            self.clientType = parseInt(sessionStorage.getItem('clientType'));
            self.spinner = false;
            self.searchBy = "";
            self.filterQuery = "";
            self.filteredBoxes = [];
            self.trackingBoxes = [];
            self.boxes = [];
            self.box = box || {};
            self.baseBox = angular.copy(box);
            self.getBoxList = getBoxList;
            self.setBox = setBox;
            self.setTrackingBox = setTrackingBox;
            self.box_list = [];
            self.selectedBox = false;
            self.isEditing = isEditing || false;
            self.boxLang = {};
            self.nextStep = nextStep;
            self.toShippingBox = toShippingBox;
            self.deleteSPBox = deleteSPBox;
            self.isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            shippingService._getLang(self.isAdmin).then(function(lang) {
                self.lang = lang;
                self.tabs = [{
                        title: self.lang.form.add.tab_wh,
                        content: "hbr-selfie/dist/routes/wh-box/shipping/modals/box.form.html",
                        helpText: ''
                    },
                    {
                        title: self.lang.form.add.tab_shipping_box,
                        content: "hbr-selfie/dist/routes/wh-box/shipping/modals/shipping-box.form.html",
                        helpText: '',
                        disabled: self.shippingBox.boxes.length ? false : true
                    },
                    {
                        title: self.lang.form.add.tab_shipping_info,
                        content: "hbr-selfie/dist/routes/wh-box/shipping/modals/shipping-info.form.html",
                        helpText: '',
                        disabled: self.shippingBox.boxes.length ? false : true
                    }
                ];
                if (Object.keys(self.box).length) {
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
            boxService._getLang().then(function(lang) {
                self.boxLang = lang;
                self.filterName = lang.room.filter.default;

            });
        }
        init();
    }
}
module.exports = shippingController;