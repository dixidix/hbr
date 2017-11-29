function shippingController(angular, app) {
  "use strict";

  "use angular template"; //jshint ignore:line
  app.controller("shippingCtrl", shippingCtrl);
  shippingCtrl.$inject = [
    "shippingService",
    "boxService",
    "$scope",
    "$rootScope",
    "$uibModal",
    "$state",
    "$filter",
    "$http",
    "$sce",
    "$compile"
  ];
  app.controller("modalAddShippingBoxCtrl", modalAddShippingBoxCtrl);
  modalAddShippingBoxCtrl.$inject = [
    "boxService",
    "shippingService",
    "authenticationService",
    "$scope",
    "$state",
    "$filter",
    "$uibModalInstance",
    "$sce",
    "$compile",
    "box",
    "boxes",
    "isEditing",
    "$rootScope",
    "$http",
    "$q"
  ];

  function shippingCtrl(
    shippingService,
    boxService,
    $scope,
    $rootScope,
    $uibModal,
    $state,
    $filter,
    $http,
    $sce,
    $compile) {
    var self = this; //jshint ignore:line

    function add() {
      var modalInstance = $uibModal.open({
        templateUrl: "./hbr-selfie/dist/routes/wh-box/shipping/modals/add-box.template.html",
        controller: "modalAddShippingBoxCtrl",
        controllerAs: "modalAddShippingBox",
        size: "sm",
        backdrop: "static",
        resolve: {
          box: function () {
            return self.shippingBox;
          },
          boxes: function () {
            return self.boxes;
          },
          isEditing: function () {
            return self.isEditing;
          }
        }
      });
    }

    function confirmModal(template) {
      self.modalInstance = $uibModal.open({
        templateUrl: template,
        scope: $scope,
        size: "sm",
        backdrop: "static"
      });
    }

    function deleteBox(box, index) {
      confirmModal(
        "./hbr-selfie/dist/routes/wh-box/shipping/confirm/delete.confirm.html"
      );
      $scope.deleteCancel = function () {
        self.modalInstance.dismiss("cancel");
      };

      $scope.deleteAccept = function () {
        shippingService._deleteBox(box).then(function (res) {
          $state.go("dashboard.shipping", {}, {
            reload: true
          });
          self.filteredBoxes.splice(index, 1);
          self.modalInstance.dismiss("cancel");
        });
      };
    }

    function saveLocation(box) {
      $scope.spbox = angular.copy(box);

      confirmModal(
        "./hbr-selfie/dist/routes/wh-box/shipping/confirm/location.confirm.html"
      );

      $scope.locationCancel = function () {
        box.warehouse_location = box.baseLocation;
        self.spinner = false;
        self.modalInstance.dismiss("cancel");
      };

      $scope.locationAccept = function () {
        box.baseLocation = box.warehouse_location;
        box.wh_arrival_date =
          $scope.spbox.wh_arrival_date || box.wh_arrival_date || null;
        box.wh_leave_date =
          $scope.spbox.wh_leave_date || box.wh_leave_date || null;
        box.wh_provider =
          $scope.spbox.wh_provider || box.wh_provider || box.provider || null;
        box.wh_tracking =
          $scope.spbox.wh_tracking || box.wh_tracking || box.tracking || null;
        box.travel_status = 1;
        shippingService._editWarehouseLocation(box).then(function (res) {
          $scope.spbox = {};
          self.spinner = false;
          self.modalInstance.dismiss("cancel");
          $state.go("dashboard.shipping", {}, {
            reload: true
          });
        });
      };
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

      if (self.filterQuery === "ageGreater" || self.filterQuery === "ageLess") {
        self.filterQueryCondition = self.filterQuery;
        self.filterQuery = "age";
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
      self.multipleFilter.forEach(function (filter) {
        self.filteredBoxes = self.filteredBoxes.filter(function (box) {
          if (filter.filterQuery === "age") {
            if (self.filterQueryCondition === "ageGreater") {
              if (
                parseInt(box[filter.filterQuery]) >= parseInt(filter.searchBy)
              ) {
                return box;
              }
            } else if (self.filterQueryCondition === "ageLess") {
              if (
                parseInt(box[filter.filterQuery]) <= parseInt(filter.searchBy)
              ) {
                return box;
              }
            }
          }
          if (
            filter.filterQuery !== "company_name" &&
            filter.filterQuery !== "warehouse_name" &&
            filter.filterQuery !== "age"
          ) {
            if (
              box[filter.filterQuery]
              .toString()
              .toLowerCase()
              .includes(filter.searchBy.toLowerCase())
            ) {
              return box;
            }
          } else if (filter.filterQuery === "company_name") {
            if (
              box.user[filter.filterQuery]
              .toString()
              .toLowerCase()
              .includes(filter.searchBy.toLowerCase())
            ) {
              return box;
            }
          } else if (filter.filterQuery === "warehouse_name") {
            if (
              box.warehouse["name"]
              .toString()
              .toLowerCase()
              .includes(filter.searchBy.toLowerCase())
            ) {
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
        shippingService
          ._getAllShippingBox()
          .then(function (response) {
            self.boxes = response.data.boxes;
            self.boxes.forEach(function (box) {
              var created = moment(new Date(parseInt(box.created)));
              box.age = moment().diff(created, "days");
              box.total = calculateValue(box);
              box.baseLocation = angular.copy(box.warehouse_location);
            });
            self.filteredBoxes = angular.copy(self.boxes);
            $scope.totalItems = Object.keys(self.filteredBoxes).length;
            $scope.currentPage = 1;
            $scope.itemsPerPage = 5;
            $scope.maxSize = 5;
            if ($state.params.id) {
              setFilter('id', self.boxLang.room.filter.list.box_id);
              self.searchBy = $state.params.id;
              applyFilter();
          }
            $scope.setPage = function (pageNo) {
              $scope.currentPage = pageNo;
            };
            $scope.pageChanged = function () {};
            $scope.$watch("searchBy", function (term) {
              var obj = term;
              $scope.filtered = $filter("filter")(self.filteredBoxes, obj);
              $scope.currentPage = 1;
            });
          })
          .catch(function (err) {
            console.log(err);
          });
      } else {
        shippingService
          ._getBoxesByUserId()
          .then(function (response) {
            self.boxes = response.data.boxes;
            self.boxes.forEach(function (box) {
              var created = moment(new Date(parseInt(box.created)));
              box.age = moment().diff(created, "days");
              box.total = calculateValue(box);
              box.baseLocation = angular.copy(box.warehouse_location);
            });
            self.filteredBoxes = angular.copy(self.boxes);
            $scope.totalItems = Object.keys(self.filteredBoxes).length;
            $scope.currentPage = 1;
            $scope.itemsPerPage = 5;
            $scope.maxSize = 5;
            $scope.setPage = function (pageNo) {
              $scope.currentPage = pageNo;
            };
            $scope.pageChanged = function () {};
            $scope.$watch("searchBy", function (term) {
              var obj = term;
              $scope.filtered = $filter("filter")(self.filteredBoxes, obj);
              $scope.currentPage = 1;
            });
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    }

    function dragLeave(boxId) {
      self.prevBox = boxId;
    }

    function updateTravelStatus(box) {
      shippingService._editTravelStatus(box);
    }

    function dragEnter(status, box) {
      var origin = angular.copy(box.status);
      $scope.spbox = box;
      $scope.spbox.toStatus = status;

      if (box.status != status && box.id == self.prevBox) {
        confirmModal(
          "./hbr-selfie/dist/routes/wh-box/shipping/confirm/status.confirm.html"
        );
        $scope.statusCancel = function () {
          box.status = origin;
          self.spinner = false;
          self.modalInstance.dismiss("cancel");
        };

        $scope.statusAccept = function () {
          box.status = status;
          box = $scope.spbox;
          box.travel_status = 1;
          if (status == 0 || status == 1) {
            box.wh_tracking =
              $scope.confirmBox.tracking || box.wh_tracking || null;
            box.tracking = $scope.confirmBox.tracking || box.tracking || null;
            box.wh_provider =
              $scope.confirmBox.provider || box.wh_provider || null;
            box.provider = $scope.confirmBox.provider || box.provider || null;

            if (status == 0) {
              box.wh_arrival_date =
                $scope.confirmBox.arrival_date || box.wh_arrival_date || null;
              box.arrival_date =
                $scope.confirmBox.arrival_date || box.arrival_date || null;
              box.wh_leave_date =
                $scope.confirmBox.leave_date || box.wh_leave_date || null;
              box.leave_date =
                $scope.confirmBox.leave_date || box.leave_date || null;
            }

            if (status == 1) {
              box.bsas_arrival_date =
                $scope.confirmBox.arrival_date || box.bsas_arrival_date || null;
              box.arrival_date =
                $scope.confirmBox.arrival_date || box.arrival_date || null;
              box.wh_leave_date =
                $scope.confirmBox.leave_date || box.wh_leave_date || null;
              box.leave_date =
                $scope.confirmBox.leave_date || box.leave_date || null;
            }
          }

          if (status == 2) {
            box.bsas_tracking =
              $scope.confirmBox.tracking || box.bsas_tracking || null;
            box.tracking = $scope.confirmBox.tracking || box.tracking || null;
            box.bsas_provider =
              $scope.confirmBox.provider || box.bsas_provider || null;
            box.provider = $scope.confirmBox.provider || box.provider || null;

            box.customer_arrival_date =
              $scope.confirmBox.arrival_date ||
              box.customer_arrival_date ||
              null;
            box.arrival_date =
              $scope.confirmBox.arrival_date || box.arrival_date || null;
            box.bsas_leave_date =
              $scope.confirmBox.leave_date || box.bsas_leave_date || null;
            box.leave_date =
              $scope.confirmBox.leave_date || box.leave_date || null;
          }

          shippingService._editShippingBox(box).then(function () {
            $scope.confirmBox = {};
            self.spinner = false;
            self.modalInstance.dismiss("cancel");
            $state.go("dashboard.shipping", {}, {
              reload: true
            });
          });
        };
      } else {
        box.status = origin;
      }
    }

    function notify(box, index) {
      var client_selected_lang = box.user.lang;
      $http
        .get(`./hbr-selfie/dist/i18n.${client_selected_lang}.json`)
        .then(response => {
          var client_lang = response.data.shipping;
          var subject = client_lang.notify.subject,
            msg = client_lang.notify.msg,
            header = client_lang.notify.header,
            client_email = "nicolas.sigal@gmail.com",
            { warehouse, country, arrived } = client_lang.board, 
            location,
            arrival_date,
            leave_date;
            
          if (box.status == 0) {
            location = warehouse.title;
          } else if (box.status == 1) {
            location = country.title;
          } else {
            location = arrived.title;
          }

          var travel_status = client_lang.sp_box.travel_status;
          var status = box.travel_status == 0 ? travel_status.not_started : box.travel_status == 1 ? travel_status.shipped : travel_status.arrived;
          leave_date = moment.unix(parseInt(box.leave_date) / 1000).format("DD/MM/YYYY");
          arrival_date = moment.unix(parseInt(box.arrival_date) / 1000).format("DD/MM/YYYY");
          var email = `<article>
                            <header>
                                <h3>${header}</h3>
                            </header>                          
                            </p> ${msg} </p>
                            <table>
                              <thead>
                                <tr>
                                  <td>${client_lang.sp_box.tracking}</td>
                                  <td>${client_lang.sp_box.provider}</td>
                                  <td>${client_lang.board.location}</td>
                                  <td>${client_lang.sp_box.travel_status.title}</td>
                                  <td>${client_lang.sp_box.leave_date}</td>
                                  <td>${client_lang.sp_box.arrival_date}</td>
                                  <td>${client_lang.sp_box.followUp}</td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>${box.tracking} <a href="https://tucourier.aftership.com/${box.tracking}">${client_lang.sp_box.track}</a></td>
                                  <td>${box.provider}</td>
                                  <td>${location}</td>
                                  <td>${status}</td>
                                  <td>${leave_date}</td>
                                  <td>${arrival_date}</td>
                                  <td><a href="https://www.tucourier.com.ar/hbr-selfie/dashboard/shipping/${box.id}"> ${client_lang.sp_box.link} </a></td>
                                </tr>
                              </tbody>
                            </table>
                        </article>`;
          shippingService
            ._notify(email, subject, client_email)
            .then(function () {
              console.log("emailed!");
            });
        });
    }

    function navigate(box) {
      $scope.hovered = "";
      $state.go("dashboard.stock_rooms", {
        spBoxId: box.id
      }, {
        reload: true
      });
    }

    function calculateValue(spBox) {
      var total = {
        weight: 0.0,
        value: 0.0,
        quantity: 0,
        wh_val: 0.0,
        wh_aditional_val: 0.0,
        total: 0.0
      };

      spBox.enter_box.forEach(function (box) {
        total.weight =
          parseFloat(total.weight) + parseFloat(box.box_partial_weight);
        total.value =
          parseFloat(total.value) + parseFloat(box.box_partial_value);
        total.quantity = parseInt(total.quantity) + parseInt(box.quantity);
        total.wh_val =
          parseFloat(total.wh_val) + parseFloat(box.box_warehouse_value);
        total.wh_aditional_val =
          parseFloat(total.wh_aditional_val) + parseFloat(box.aditional_total);
      });

      total.total = parseFloat(
        total.wh_val +
        total.wh_aditional_val +
        parseFloat(spBox.aditional_total_hbr) +
        parseFloat(spBox.hbr_wh_val)
      );

      return total;
    }

    function init() {
      $scope.confirmBox = {};
      self.deleteBox = deleteBox;
      self.updateTravelStatus = updateTravelStatus;
      self.saveLocation = saveLocation;
      self.shippingBox = {};
      self.dragLeave = dragLeave;
      self.isAdmin = parseInt(sessionStorage.getItem("isAdmin"));
      self.clientType = parseInt(sessionStorage.getItem("clientType"));
      self.lang = $rootScope.langs.shipping;
      self.boxLang = $rootScope.langs.stock_rooms;
      self.filterName = self.boxLang.room.filter.default;
      $scope.$watch("$root.langs", function () {
        self.lang = $rootScope.langs.shipping;
        $http
          .get("./hbr-selfie/dist/php/warehouse.php", {
            params: {
              action: "getAll"
            }
          })
          .then(function (response) {
            self.warehouses = response.data.warehouses;
          });
      });
      self.boxLang = $rootScope.langs.stock_rooms;
      $scope.$watch("$root.langs", function () {
        self.boxLang = $rootScope.langs.stock_rooms;
        self.filterName = self.boxLang.room.filter.default;
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

  function modalAddShippingBoxCtrl(
    boxService,
    shippingService,
    authenticationService,
    $scope,
    $state,
    $filter,
    $uibModalInstance,
    $sce,
    $compile,
    box,
    boxes,
    isEditing,
    $rootScope,
    $http,
    $q
  ) {
    var self = this;

    function cancel() {
      self.spinner = false;
      $uibModalInstance.dismiss("cancel");
    }

    function setTrackingBox(box) {
      self.trackingBoxes = [];
      self.selectedTrackingBox = false;
      if (!self.isEditing) {
        self.box_list.forEach(function (box) {
          box.isActive = false;
        });

        box.isActive = true;
        self.selectedBox = true;

        self.trackingBoxes = self.boxes.filter(function (tb) {
          if (tb.tracking === box.tracking) {
            return tb;
          }
        });
      }
    }

    function setBox(trackingBox) {
      if (!self.isEditing) {
        self.trackingBoxes.forEach(function (box) {
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
      self.boxes = [];
      self.trackingBoxes = [];
      self.selectedBox = false;
      authenticationService.checkAuth().then(function (response) {
        var whid = parseInt(response.data.uid);
        boxService._getAllEnterBoxes().then(function (res) {
          self.box_list = res.data.boxes.filter(function (box) {
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
          self.box_list = removeDuplicates(self.box_list, "tracking");

          if (Object.keys(self.box).length) {
            self.box_list.filter(function (box) {
              if (box.id == self.box.awb_boxes_id) {
                box.isActive = true;
                self.selectedBox = true;
                self.box.bills = box.bills;
              } else {
                box.isActive = false;
              }
            });
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

      self.shippingBox.boxes.forEach(function (box) {
        self.shippingBox.total.weight =
          parseFloat(self.shippingBox.total.weight) +
          parseFloat(box.box_partial_weight);
        self.shippingBox.total.value =
          parseFloat(self.shippingBox.total.value) +
          parseFloat(box.box_partial_value);
        self.shippingBox.total.quantity =
          parseInt(self.shippingBox.total.quantity) + parseInt(box.quantity);
        self.shippingBox.total.wh_val =
          parseFloat(self.shippingBox.total.wh_val) +
          parseFloat(box.box_warehouse_value);
        self.shippingBox.total.wh_aditional_val =
          parseFloat(self.shippingBox.total.wh_aditional_val) +
          parseFloat(box.aditional_total);
      });
    }

    function deleteSPBox(spbox, index) {
      self.boxes.filter(function (box) {
        if (box.id === spbox.id) {
          box.status = 1;
        }
      });
      self.shippingBox.boxes.splice(index, 1);
      calculateShippingWhValue();
    }

    $scope.getFilename = function (file) {
      var file = file.files[0];
      if (file) {
        if (
          file.type === "application/pdf" ||
          file.type === "image/png" ||
          file.type === "image/jpeg"
        ) {
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
    };

    function finish() {
      shippingService._addShippingBox(self.shippingBox).then(function (res) {
        var shipping_box_id = res.data.id;
        if (res.data.success && shipping_box_id) {
          var sequence = $q.defer();
          sequence.resolve();
          sequence = sequence.promise;
          self.shippingBox.boxes.forEach(function (box) {
            sequence = sequence.then(function () {
              box.shipping_box_id = shipping_box_id;
              return shippingService._updateEnterBox(box);
            });
          });
          $q.all(sequence).then(function () {
            setTimeout(function () {
              self.spinner = false;
              $uibModalInstance.dismiss("cancel");
              $state.go("dashboard.shipping", {}, {
                reload: true
              });
            }, 3000);
          });
        }
      });
    }

    function nextStep(index) {
      var nextIndex = parseInt(index) + 1;
      self.tabs[nextIndex].disabled = false;
      self.tabActive = parseInt(index) + 2;
      $("html, body").animate({
          scrollTop: 0
        },
        500
      );
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
      };
      if (self.shippingBox.user) {
        self.selectedUser = self.shippingBox.user;
        getBoxList(self.shippingBox.user);
      }
      self.finish = finish;
      self.cancel = cancel;
      self.isAdmin = parseInt(sessionStorage.getItem("isAdmin"));
      self.clientType = parseInt(sessionStorage.getItem("clientType"));
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
      self.isAdmin = parseInt(sessionStorage.getItem("isAdmin"));
      self.lang = $rootScope.langs.shipping;
      self.tabs = [{
          title: self.lang.form.add.tab_wh,
          content: "hbr-selfie/dist/routes/wh-box/shipping/modals/box.form.html",
          helpText: ""
        },
        {
          title: self.lang.form.add.tab_shipping_box,
          content: "hbr-selfie/dist/routes/wh-box/shipping/modals/shipping-box.form.html",
          helpText: "",
          disabled: self.shippingBox.boxes.length ? false : true
        },
        {
          title: self.lang.form.add.tab_shipping_info,
          content: "hbr-selfie/dist/routes/wh-box/shipping/modals/shipping-info.form.html",
          helpText: "",
          disabled: self.shippingBox.boxes.length ? false : true
        }
      ];
      if (Object.keys(self.box).length) {
        self.lang.form.title = self.lang.form.edit.title;
      } else {
        self.lang.form.title = self.lang.form.add.title;
      }
      $http
        .get("./hbr-selfie/dist/php/users.php", {
          params: {
            client_type: "1",
            action: "getAll"
          }
        })
        .then(function (response) {
          self.users = response.data.users;
          if (self.box.user) {
            self.selectedUser = self.box.user;
            getBoxList(self.selectedUser);
          }
        });
      $scope.$watch("$root.langs", function () {
        self.savedTab = self.tabActive;
        self.lang = $rootScope.langs.shipping;
        self.tabs = [{
            title: self.lang.form.add.tab_wh,
            content: "hbr-selfie/dist/routes/wh-box/shipping/modals/box.form.html",
            helpText: ""
          },
          {
            title: self.lang.form.add.tab_shipping_box,
            content: "hbr-selfie/dist/routes/wh-box/shipping/modals/shipping-box.form.html",
            helpText: "",
            disabled: self.shippingBox.boxes.length ? false : true
          },
          {
            title: self.lang.form.add.tab_shipping_info,
            content: "hbr-selfie/dist/routes/wh-box/shipping/modals/shipping-info.form.html",
            helpText: "",
            disabled: self.shippingBox.boxes.length ? false : true
          }
        ];
        self.tabActive = self.savedTab;
        if (Object.keys(self.box).length) {
          self.lang.form.title = self.lang.form.edit.title;
        } else {
          self.lang.form.title = self.lang.form.add.title;
        }
        $http
          .get("./hbr-selfie/dist/php/users.php", {
            params: {
              client_type: "1",
              action: "getAll"
            }
          })
          .then(function (response) {
            self.users = response.data.users;
            if (self.box.user) {
              self.selectedUser = self.box.user;
              getBoxList(self.selectedUser);
            }
          });
      });
      self.boxLang = $rootScope.langs.stock_rooms;
      $scope.$watch("$root.langs", function () {
        self.boxLang = $rootScope.langs.stock_rooms;
        self.filterName = self.boxLang.room.filter.default;
      });
    }
    init();
  }
}
module.exports = shippingController;