function boxService(agular, app) {
    app.service('boxService', boxService);
    boxService.$inject = ['$http'];

    function boxService($http) {

        function Room() {
            this.weight = 0.00;
            this.stock = 0;
            this.room_val = 0.00;
            this.shipping_val = 0.00;
            this.warehouse_val = 0.00;
        }

        this._getLang = function(isAdmin) {
            return $http.get('./hbr-selfie/dist/routes/wh-box/i18n.json').then(function(res) {
                if (isAdmin) {
                    return res.data.en;
                } else {
                    return res.data.es;
                }
            })
        }

        this._getAllBoxes = function() {
            return $http.get('./hbr-selfie/dist/mock/boxes.json');
        }

        this.calculate_room = function(boxes) {
            var room = new Room();
            boxes.forEach(function(box) {
                room.weight = (parseFloat(room.weight) + parseFloat(box.box_weight)).toFixed(2);
                room.stock = parseInt(room.stock) + parseInt(box.box_stock);
                room.room_val = (parseFloat(room.room_val) + parseFloat(box.box_value)).toFixed(2);
                room.shipping_val = (parseFloat(room.shipping_val) + parseFloat(box.box_shipping_value)).toFixed(2);
                room.warehouse_val = (parseFloat(room.warehouse_val) + parseFloat(box.box_warehouse_value)).toFixed(2);
            })
            return room;
        }

        this._getBoxesByUserId = function(UserId) {
            return $http.get('./hbr-selfie/dist/mock/boxes.json', { params: { uid: UserId } });
        }

        this._getBoxById = function(boxId) {
            return $http.get('./hbr-selfie/dist/mock/boxes.json', { params: { boxId: boxId } });
        }

        this._addBox = function(box) {
            console.log(box);
            // return $http.post('./hbr-selfie/dist/php/box/add.php', {

            // });
        }
    }
}

module.exports = boxService;