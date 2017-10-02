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
                self.trackingBoxes.forEach(function(box) {
                    box.isActive = false;
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
                boxService._getAllEnterBoxes().then(function(res) {
                    self.box_list = res.data.boxes.filter(function(box) {
                        if (box.user.id == user.id) {
                            return box;
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
            self.shippingBox.warehouse.weight = 0;
            self.shippingBox.warehouse.value = 0;
            self.shippingBox.warehouse.quantity = 0;
            self.shippingBox.warehouse.wh_val = 0;
            self.shippingBox.warehouse.wh_aditional_val = 0;

            self.shippingBox.boxes.forEach(function(box) {
                self.shippingBox.warehouse.weight = parseFloat(self.shippingBox.warehouse.weight) + parseFloat(box.box_partial_weight);
                self.shippingBox.warehouse.value = parseFloat(self.shippingBox.warehouse.value) + parseFloat(box.box_partial_value);
                self.shippingBox.warehouse.quantity = parseInt(self.shippingBox.warehouse.quantity) + parseInt(box.quantity);
                self.shippingBox.warehouse.wh_val = parseFloat(self.shippingBox.warehouse.wh_val) + parseFloat(box.box_warehouse_value);
                self.shippingBox.warehouse.wh_aditional_val = parseFloat(self.shippingBox.warehouse.wh_aditional_val) + parseFloat(box.aditional_total);
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
            console.log(self.shippingBox);
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
                warehouse: {
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
            self.shippingBox = { "warehouse": { "weight": 800, "value": 1750, "quantity": 30, "wh_val": 650.5, "wh_aditional_val": 500 }, "user": { "name": "Johanna", "lastname": "Belmonte", "company_real_name": "Proplanta S.A.", "warehouse_name": "", "tel": "123456 / 123456", "cel": "123456", "id": "21", "email": "joy", "codeType": "1", "idCode": "123123123123", "address": "calle falsa 123", "localidad": "Ciudad Mendoza", "postalcode": "5500", "isAdmin": "0", "isPremium": "0", "client_type": "1", "company_name": "Proplanta" }, "boxes": [{ "id": "1", "box_stock": 60, "quantity": 30, "remaining": 5, "awb_boxes_id": 1, "box_value": 3500, "box_weight": 1600, "box_partial_weight": 800, "box_partial_value": 1750, "long_desc": "Caja1", "created": "1506730703057", "status": 2, "tracking": "0001910199011999", "provider": "FedEx", "box_warehouse_value": "650.5", "aditional_unit": "1", "aditional_value": "500", "aditional_total": "500", "warehouse": { "id": "5", "name": "WH MIA HBR", "tel": "111", "cel": "11111", "email": "pablo.quiroz@tucourier.com.ar", "codeType": 1, "idCode": "123123", "address": "5555 Collins ave apt 14z,", "localidad": "MIAMI BEACH", "postalcode": "132" }, "bills": [{ "id": "1", "uid": "21", "timestamp": "1506730003246", "number": "8888", "stock": "30", "value": "2000", "weight": "1000", "long_desc": "facturaB", "bill_file_name": "andrey-grinkevich-366008.jpg", "bill_file_path": "/dist/files/1506730003246/5f57b264574d49ace1afe8daad93e07c22b3814131fde8f43df1c9d4335cc967.jpg", "$$hashKey": "object:59" }, { "id": "2", "uid": "21", "timestamp": "1506730003243", "number": "9999", "stock": "30", "value": "1500", "weight": "600", "long_desc": "facturaA", "bill_file_name": "bb4dead81d6348db89062e77ea0c287e.jpg", "bill_file_path": "/dist/files/1506730003243/d6b1da053f4792062de58294a556043fcd07eacc7a72de2920899c99a09d6429.jpg", "$$hashKey": "object:60" }], "user": { "name": "Johanna", "lastname": "Belmonte", "company_real_name": "Proplanta S.A.", "warehouse_name": "", "tel": "123456 / 123456", "cel": "123456", "id": "21", "email": "joy", "codeType": "1", "idCode": "123123123123", "address": "calle falsa 123", "localidad": "Ciudad Mendoza", "postalcode": "5500", "isAdmin": "0", "isPremium": "0", "client_type": "1", "company_name": "Proplanta" }, "deleted": "0", "isActive": true }], "freight_val": "100", "shipping_val": "100", "warehouse_val": "100", "aditional_unit": "1", "aditional_value": "100", "aditional_total": 100, "tracking": "1231239123213", "provider": "FeDex", "bill_file": {} }
            if (self.shippingBox.user) {
                self.selectedUser = self.shippingBox.user;
                getBoxList(self.shippingBox.user);
            }
            self.finish = finish;
            self.cancel = cancel;
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
            self.isEditing = isEditing;
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