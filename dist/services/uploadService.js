function uploadService(angular, app) {
    'use strict';
    app.service('uploadService', uploadService);
    uploadService.$inject = ["$http", "$q"];

    function uploadService($http, $q) {
        this.uploadProducts = function(products, ventaId, timestamp) {
            var deferred = $q.defer();
            angular.forEach(products, function(product) {
                product.ventaId = ventaId;
                product.timestamp = timestamp;
                var formData = new FormData();
                if (!product.weight) {
                    product.weight = 0.00;
                }
                angular.forEach(product, function(key, value) {

                    formData.append(value, key);
                });

                $http.post('./hbr-selfie/dist/php/add_products.php', formData, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                });
            });
            return deferred.promise;
        }

        this.uploadBills = function(bill, ventaId, userId, timestamp) {
            var deferred = $q.defer();

            bill.ventaId = ventaId;
            bill.timestamp = timestamp;
            bill.userId = userId;
            var formData = new FormData();
            var products = [];
            angular.forEach(bill, function(key, value) {
                if (value !== "products" && value !== "warehouse") {
                    formData.append(value, key);
                } else {
                    products = key;
                }
            });

            return $http.post('./hbr-selfie/dist/php/add_bill.php', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });

        }

        this.uploadProducts = function(product) {

            var deferred = $q.defer();

            var formDataProd = new FormData();
            angular.forEach(product, function(key, value) {
                formDataProd.append(value, key);
            });

            return $http.post('./hbr-selfie/dist/php/add_bill_product.php', formDataProd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        };

    }
}
module.exports = uploadService;