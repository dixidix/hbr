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
            return $http.get('./hbr-selfie/dist/routes/wh-box/stock-rooms/i18n.json').then(function(res) {
                if (isAdmin == 1) {
                    return res.data.en;
                } else {
                    return res.data.es;
                }
            })
        }

        this._getAllBoxes = function() {
            return $http.get('./hbr-selfie/dist/php/box/get_all_boxes.php');
        }

        this.calculate_room = function(boxes) {
            var room = new Room();
            boxes.forEach(function(box) {
                room.weight = box.box_weight ? (parseFloat(room.weight) + parseFloat(box.box_weight)).toFixed(2) : room.weight;
                room.stock = box.box_stock ? (parseInt(room.stock) + parseInt(box.box_stock)) : room.stock;
                room.room_val = box.box_value ? (parseFloat(room.room_val) + parseFloat(box.box_value)).toFixed(2) : room.room_val;
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

        this._deleteBox = function(box) {
            return $http.post('./hbr-selfie/dist/php/box/delete.php', {
                id: box.id
            });
        }
    }
}

module.exports = boxService;