function airwayService(angular, app) {

    app.service('airwayService', airwayService);

    airwayService.$inject = ['$http'];

    function airwayService($http) {

        this.get_airwayBills = function(ventaId, state) {
            return $http.get('./hbr-selfie/dist/php/get_airwaybills.php', { params: { action: 'getByPurchaseId', ventaId: ventaId, state: state } });
        };

        this.get_finished_airwaybills = function() {
            return $http.get('./hbr-selfie/dist/php/get_finished_awb.php', { params: { state: 1 } });
        }

        this.get_finished_airwaybillsByUserId = function(uid) {
            return $http.get('./hbr-selfie/dist/php/get_finished_awb_by_user.php', { params: { state: 2, uid: uid} });
        }

        this.save = function(awb) {
            var formData = new FormData();
            var products = [];
            angular.forEach(awb, function(key, value) {
                if (value !== "products") {
                    formData.append(value, key);
                } else {
                    products = key;
                }
            });

            return $http.post('./hbr-selfie/dist/php/add_guides.php', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        };

        this.updateGuide = function(guide) {
            var formData = new FormData();
            var products = [];
            angular.forEach(guide, function(key, value) {
                if (value !== "products") {
                    formData.append(value, key);
                } else {
                    products = key;
                }
            });

            return $http.post('./hbr-selfie/dist/php/update_guides.php', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        };

        this.addProductToAwb = function(product) {
            var formData = new FormData();
            angular.forEach(product, function(key, value) {
                formData.append(value, key);
            });
            return $http.post('./hbr-selfie/dist/php/add_product_to_guide.php', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        };

        this.updateBill = function(bill) {
            var formData = new FormData();
            angular.forEach(bill, function(key, value) {
                formData.append(value, key);
            });
            return $http.post('./hbr-selfie/dist/php/update_bill.php', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        };

        this.updateProduct = function(product) {
            var formData = new FormData();
            angular.forEach(product, function(key, value) {
                formData.append(value, key);
            });
            return $http.post('./hbr-selfie/dist/php/update_product.php', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        };

        this.updateVenta = function(venta) {
            var formData = new FormData();
            angular.forEach(venta, function(key, value) {
                formData.append(value, key);
            });
            return $http.post('./hbr-selfie/dist/php/update_venta.php', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        }
    }
}
module.exports = airwayService;