function boxService(agular, app) {
    app.service('boxService', boxService);
    boxService.$inject = ['$http', 'authenticationService'];

    function boxService($http, authenticationService) {

        function Room() {
            this.weight = 0.00;
            this.stock = 0;
            this.room_val = 0.00;
            this.shipping_val = 0.00;
            this.warehouse_val = 0.00;
        }

        this._getLang = function() {
            var isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            var clientType = parseInt(sessionStorage.getItem('clientType'));
            var lang = sessionStorage.getItem('lang');
            return $http.get('./hbr-selfie/dist/routes/wh-box/stock-rooms/i18n.json').then(function(res) {
                return res.data[lang];
            })
        }

        this._getAllBoxes = function() {
            return $http.get('./hbr-selfie/dist/php/box/get_all_boxes.php');
        }

        this.calculate_room = function(boxes) {
            var room = new Room();
            boxes.forEach(function(box) {
                room.weight = box.box_weight ? (parseFloat(room.weight) + parseFloat(box.box_partial_weight)).toFixed(2) : room.weight;
                room.stock = box.quantity ? (parseInt(room.stock) + parseInt(box.quantity)) : room.stock;
                room.room_val = box.box_value ? (parseFloat(room.room_val) + parseFloat(box.box_partial_value)).toFixed(2) : room.room_val;
                room.shipping_val = box.box_shipping_value ? (parseFloat(room.shipping_val) + parseFloat(box.box_shipping_value)).toFixed(2) : room.shipping_val;
                room.warehouse_val = box.box_warehouse_value ? (parseFloat(room.warehouse_val) + parseFloat(box.box_warehouse_value)).toFixed(2) : room.warehouse_val;
            })
            return room;
        }

        this._getBoxesByUserId = function() {
            return authenticationService.checkAuth().then(function(response) {
                if (response.data.isAdmin == 0) {
                    var uid = parseInt(response.data.uid);
                    return $http.get('./hbr-selfie/dist/php/box/get_by_uid.php', { params: { uid: uid } });
                }
            });
        }

        this._getBoxById = function(boxId) {
            return $http.get('./hbr-selfie/dist/php/box/add.php', { params: { boxId: boxId } });
        }
        this._addEnterBox = function(box) {
            return authenticationService.checkAuth().then(function(response) {
                box.uid = parseInt(response.data.uid);
                return $http.post('./hbr-selfie/dist/php/enter-box/add_box.php', {
                    quantity: box.quantity,
                    box_value: box.box_partial_value,
                    box_weight: box.box_partial_weight || "NULL",
                    aditional_unit: box.aditional_unit,
                    aditional_value: box.aditional_value,
                    aditional_total: box.aditional_total,
                    box_warehouse_value: box.box_warehouse_value || "NULL",
                    long_desc: box.long_desc || "NULL",
                    real_remaining: parseInt(box.real_remaining) - parseInt(box.quantity),
                    id: box.id,
                    awb_boxes_id: box.awb_boxes_id,
                    created: Math.floor(new Date().getTime())
                });
            });
        }

        this._addBox = function(box) {
            return authenticationService.checkAuth().then(function(response) {
                if (response.data.isAdmin == 0) {
                    box.uid = parseInt(response.data.uid);
                    return $http.post('./hbr-selfie/dist/php/box/add.php', {
                        bill: box.bill,
                        box_stock: box.box_stock,
                        box_value: box.box_value,
                        box_weight: box.box_weight || "NULL",
                        long_desc: box.long_desc,
                        short_desc: box.short_desc,
                        whId: box.whId.id,
                        uid: box.uid,
                        created: Math.floor(new Date().getTime())
                    });
                }
            });
        }

        this._getAllEnterBoxes = function() {
            return $http.get('./hbr-selfie/dist/php/enter-box/get_box.php');
        }

        this._editBox = function(box) {
            return authenticationService.checkAuth().then(function(response) {
                box.uid = parseInt(response.data.uid);
                var whId = box.whId ? box.whId.id : box.warehouse.id;
                var isAdmin = parseInt(response.data.isAdmin);
                return $http.post('./hbr-selfie/dist/php/box/edit.php', {
                    id: box.id,
                    bill: box.bill,
                    box_stock: box.box_stock,
                    box_value: box.box_value,
                    box_weight: box.box_weight || "NULL",
                    box_shipping_value: box.box_shipping_value || "NULL",
                    box_warehouse_value: box.box_warehouse_value || "NULL",
                    long_desc: box.long_desc,
                    short_desc: box.short_desc,
                    whId: whId,
                    uid: box.uid,
                    edited: Math.floor(new Date().getTime()),
                    status: isAdmin,
                    location: box.location || 0
                });
            });
        }

        this._editEnterBox = function(box, baseBox) {
            return authenticationService.checkAuth().then(function(response) {
                box.uid = parseInt(response.data.uid);
                var whId = box.whId ? box.whId.id : box.warehouse.id;
                var isAdmin = parseInt(response.data.isAdmin);
                return $http.post('./hbr-selfie/dist/php/enter-box/edit_box.php', {
                    quantity: box.quantity,
                    remaining: (parseInt(box.remaining) + parseInt(baseBox.quantity)) - parseInt(box.quantity),
                    box_value: box.box_partial_value,
                    box_weight: box.box_partial_weight || "NULL",
                    aditional_unit: box.aditional_unit,
                    aditional_value: box.aditional_value,
                    box_warehouse_value: box.box_warehouse_value || "NULL",
                    aditional_total: box.aditional_total,
                    long_desc: box.long_desc || "NULL",
                    id: box.id,
                    awb_boxes_id: box.awb_boxes_id,
                });
            });
        }

        this._finishEnterBox = function(box) {
            return $http.post('./hbr-selfie/dist/php/enter-box/finish_box.php', {
                id: box.id,
                awb_id: box.awb_boxes_id
            });
        }

        this._deleteBox = function(box) {
            return $http.post('./hbr-selfie/dist/php/box/delete.php', {
                id: box.id
            });
        }
        
        this._notify = function (msg, subject, client_email) {
            return $http.post('./hbr-selfie/dist/php/notify.php', {
                msg: msg,
                client_email: client_email,
                msg_subject: subject
            });
        };
        
        this._deleteEnterBox = function(box) {
            return $http.post('./hbr-selfie/dist/php/enter-box/delete_box.php', {
                id: box.id,
                remaining: box.remaining,
                awb_boxes_id: box.awb_boxes_id
            });
        }
    }
}

module.exports = boxService;