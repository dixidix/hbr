function shippingService(agular, app) {
    app.service('shippingService', shippingService);
    shippingService.$inject = ['$http', 'authenticationService'];

    function shippingService($http, authenticationService) {
        this._getLang = function() {
            var isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            var clientType = parseInt(sessionStorage.getItem('clientType'));
            return $http.get('./hbr-selfie/dist/routes/wh-box/shipping/i18n.json').then(function(res) {
                if (isAdmin == 1 || clientType == 2) {
                    return res.data.en;
                } else {
                    return res.data.es;
                }
            })
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
        }

        this._getAllShippingBox = function() {
            return $http.post('./hbr-selfie/dist/php/shipping-box/get_box.php');
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