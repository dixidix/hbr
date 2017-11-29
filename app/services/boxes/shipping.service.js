function shippingService(agular, app) {
    app.service('shippingService', shippingService);
    shippingService.$inject = ['$http', 'authenticationService'];

    function shippingService($http, authenticationService) {
        this._getLang = function() {
            var isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            var clientType = parseInt(sessionStorage.getItem('clientType'));
            var lang = sessionStorage.getItem('lang');
            return $http.get('./hbr-selfie/dist/routes/wh-box/shipping/i18n.json').then(function(res) { 
                return res.data[lang];
            });
        }

        this._addShippingBox = function(spbox) {
            return authenticationService.checkAuth().then(function(response) {
                var whId = spbox.boxes[0].warehouse.id;
                var uid = spbox.boxes[0].user.id;
                return $http.post('./hbr-selfie/dist/php/shipping-box/add_box.php', {
                    created: Math.floor(new Date().getTime()),
                    wh_location: whId,
                    status: 0,
                    uid: uid
                });
            });
        };

        this._deleteBox = function (box) {
            return $http.post('./hbr-selfie/dist/php/shipping-box/delete_box.php', {
                id: box.id,
                edited: Math.floor(new Date().getTime())
            });
        };

        this._notify = function (msg, subject, client_email) {
            return $http.post('./hbr-selfie/dist/php/notify.php', {
                msg: msg,
                client_email: client_email,
                msg_subject: subject
            });
        };
        
        this._editShippingBox = function(spbox) {
            var whId = spbox.enter_box[0].warehouse.id;
            return authenticationService.checkAuth().then(function(response) {
                var editBox = {
                    id: spbox.id,
                    created: spbox.created ||  Math.floor(new Date().getTime()),
                    edited: Math.floor(new Date().getTime()),
                    status: spbox.status,
                    travel_status: spbox.travel_status,
                    wh_tracking: spbox.wh_tracking || null,
                    bsas_tracking: spbox.bsas_tracking || null,
                    wh_provider: spbox.wh_provider || null,
                    bsas_provider: spbox.bsas_provider || null,
                    wh_arrival_date: new Date(spbox.wh_arrival_date).getTime() || null,
                    wh_leave_date: new Date(spbox.wh_leave_date).getTime() || null,
                    bsas_arrival_date:  new Date(spbox.bsas_arrival_date).getTime() || null, 
                    bsas_leave_date:  new Date(spbox.bsas_leave_date).getTime() || null,
                    customer_arrival_date:  new Date(spbox.customer_arrival_date).getTime() || null,
                    aditional_unit_hbr: spbox.aditional_unit_hbr || "NULL",
                    aditional_value_hbr: spbox.aditional_value_hbr || "NULL",
                    aditional_total_hbr: spbox.aditional_total_hbr || "NULL",
                    bill_file: spbox.bill_file || "NULL",
                    hbr_wh_val: spbox.hbr_wh_val || "NULL"            
                };

                var formData = new FormData();                
                angular.forEach(editBox, function(key, value) {
                    formData.append(value, key);
                });

                return $http.post('./hbr-selfie/dist/php/shipping-box/edit_box.php', formData, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                });
            });
        }

        this._getAllShippingBox = function() {
            return $http.post('./hbr-selfie/dist/php/shipping-box/get_box.php');
        }

        this._getBoxesByUserId = function () {
            return authenticationService.checkAuth().then(function(response) {
                return $http.post('./hbr-selfie/dist/php/shipping-box/get_box.php', {uid: response.data.uid});
            });
        }

        this._editTravelStatus = function (box) {
            return $http.post('./hbr-selfie/dist/php/shipping-box/edit_travel_status.php', {
                id: box.id,
                travel_status: box.travel_status,
                edited: Math.floor(new Date().getTime())
            });
        }

        this._editWarehouseLocation = function (box) {
            return $http.post('./hbr-selfie/dist/php/shipping-box/edit_warehouse_location.php', {
                id: box.id,
                warehouse_location: box.warehouse_location.id,
                wh_arrival_date: new Date(box.wh_arrival_date).getTime() || box.wh_arrival_date || null,
                wh_leave_date: new Date(box.wh_leave_date).getTime() || box.wh_leave_date || null,
                wh_tracking: box.wh_tracking || null,
                wh_provider: box.wh_provider || null,
                edited: Math.floor(new Date().getTime()),
                travel_status: box.travel_status
            });
        }
        
        this._updateEnterBox = function(box) {
            return authenticationService.checkAuth().then(function(response) {
                box.uid = parseInt(response.data.uid);
                var whId = box.whId ? box.whId.id : box.warehouse.id;
                var isAdmin = parseInt(response.data.isAdmin);
                return $http.post('./hbr-selfie/dist/php/enter-box/edit_box.php', {
                    quantity: box.quantity,
                    remaining: parseInt(box.remaining),
                    box_value: box.box_partial_value,
                    box_weight: box.box_partial_weight || "NULL",
                    aditional_unit: box.aditional_unit,
                    aditional_value: box.aditional_value,
                    box_warehouse_value: box.box_warehouse_value || "NULL",
                    aditional_total: box.aditional_total,
                    long_desc: box.long_desc || "NULL",
                    id: box.id,
                    awb_boxes_id: box.awb_boxes_id,
                    shipping_box_id: box.shipping_box_id
                });
            });
        }
    }
}

module.exports = shippingService;