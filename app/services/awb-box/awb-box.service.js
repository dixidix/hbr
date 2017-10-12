function awbboxService(agular, app) {
    app.service('awbboxService', awbboxService);
    awbboxService.$inject = ['$http', 'authenticationService'];

    function awbboxService($http, authenticationService) {

        this._getLang = function() {
            var isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            return $http.get('./hbr-selfie/dist/routes/wh-box/awb-box/i18n.json').then(function(res) {
                if (isAdmin == 1) {
                    return res.data.en;
                } else {
                    return res.data.es;
                }
            })
        }

        this._getAllAwbBoxes = function() {
            return $http.get('./hbr-selfie/dist/php/awb-box/get_box.php');
        }

        this._getAwbBoxesByUserId = function() {
            return authenticationService.checkAuth().then(function(response) {
                var uid = parseInt(response.data.uid);
                return $http.get('./hbr-selfie/dist/php/awb-box/get_box.php', { params: { uid: uid } });
            });
        }

        this._getAwbBoxesById = function(awbBoxId) {

        }

        this._deleteBill = function(billId) {
            return $http.post('./hbr-selfie/dist/php/awb-box/delete_bill.php', { id: billId });
        }

        this._deleteBill = function(bill) {
            return $http.post('./hbr-selfie/dist/php/awb-box/delete_bill.php', { id: bill.id });
        }

        this._addAwbBox = function(awbBox) {
            return authenticationService.checkAuth().then(function(response) {
                awbBox.uid = parseInt(response.data.uid);
                var whId = awbBox.whId ? awbBox.whId.id : awbBox.warehouse.id;
                return $http.post('./hbr-selfie/dist/php/awb-box/add_box.php', {
                    tracking: awbBox.tracking,
                    provider: awbBox.provider,
                    stock: parseInt(awbBox.box_stock),
                    box_value: parseFloat(awbBox.box_value),
                    weight: parseFloat(awbBox.box_weight) || "NULL",
                    whId: parseInt(awbBox.whId.id),
                    uid: parseInt(awbBox.uid),
                    created: Math.floor(new Date().getTime())
                });
            });
        }

        this._editBox = function(awbBox) {
            return authenticationService.checkAuth().then(function(response) {
                awbBox.uid = parseInt(response.data.uid);
                var whId = awbBox.whId ? awbBox.whId.id : awbBox.warehouse.id;
                return $http.post('./hbr-selfie/dist/php/awb-box/edit_box.php', {
                    tracking: awbBox.tracking,
                    provider: awbBox.provider,
                    stock: parseInt(awbBox.box_stock),
                    status: parseInt(awbBox.status),
                    id: parseInt(awbBox.id),
                    box_value: parseFloat(awbBox.box_value),
                    weight: parseFloat(awbBox.box_weight) || "NULL",
                    whId: parseInt(awbBox.whId.id),
                });
            });
        }

        this._addBills = function(bill, boxId) {
            return authenticationService.checkAuth().then(function(response) {
                bill.uid = parseInt(response.data.uid);
                bill.boxId = boxId;
                bill.timestamp = Math.floor(new Date().getTime());
                var formData = new FormData();

                angular.forEach(bill, function(key, value) {
                    formData.append(value, key);
                });

                return $http.post('./hbr-selfie/dist/php/awb-box/add_box_bill.php', formData, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                });
            });
        }

        this._editBill = function(bill) {
            return authenticationService.checkAuth().then(function(response) {
                bill.uid = parseInt(response.data.uid);
                bill.timestamp = Math.floor(new Date().getTime());
                var formData = new FormData();

                angular.forEach(bill, function(key, value) {
                    formData.append(value, key);
                });

                return $http.post('./hbr-selfie/dist/php/awb-box/edit_box_bill.php', formData, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                });
            });
        }

        this._updateRealValues = function(box) {
            return $http.post('./hbr-selfie/dist/php/awb-box/update_real_values.php', {
                real_box_value: parseFloat(box.real_box_value),
                real_box_weight: parseFloat(box.real_box_weight),
                real_remaining: parseInt(box.real_remaining),
                real_box_stock: parseInt(box.real_box_stock),
                id: parseInt(box.id)
            });
        }

        this._deleteBox = function(awbBox) {
            return $http.post('./hbr-selfie/dist/php/awb-box/delete_box.php', {
                id: awbBox.id
            })
        }

        this._deleteBill = function(bill) {
            return $http.post('./hbr-selfie/dist/php/awb-box/delete_bill.php', {
                id: bill.id
            })
        }
    }
}

module.exports = awbboxService;