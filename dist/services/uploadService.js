function uploadService(angular, app) {
	'use strict';
	app.service('uploadService', uploadService);
	uploadService.$inject = ["$http", "$q"];
	function uploadService($http, $q) {
		this.uploadProducts = function (products, ventaId, timestamp) {
			var deferred = $q.defer();
			angular.forEach(products, function (product) {
				product.ventaId = ventaId;
				product.timestamp = timestamp;
				var formData = new FormData();
				angular.forEach(product, function (key, value) {
					formData.append(value, key);
				});

				$http.post('./hbr-selfie/dist/php/add_products.php', formData, {
					transformRequest: angular.identity,
					headers: { 'Content-Type': undefined }
				});
			});
			return deferred.promise;
		}

		this.uploadBills = function (bills, ventaId, userId, timestamp) {
			var deferred = $q.defer();
			angular.forEach(bills, function (bill) {
				bill.ventaId = ventaId;
				bill.timestamp = timestamp;
				bill.userId = userId;
				var formData = new FormData();
				var products = [];
				angular.forEach(bill, function (key, value) {
					if (value !== "products") {
						formData.append(value, key);
					} else {
						products = key;
					}
				});

				$http
					.post('./hbr-selfie/dist/php/add_bill.php', formData, {
						transformRequest: angular.identity,
						headers: { 'Content-Type': undefined }
					})
					.success(function (response) {
						uploadProducts(response.bill_id, userId);
					})
					.error(function (error) {
						console.log("back from service:", error);
					});


				 function uploadProducts (billId, userId) {

					var deferred = $q.defer();
					angular.forEach(products, function (product) {
						product.billId = billId;
						product.userId = userId;
						var formDataProd = new FormData();
						angular.forEach(product, function (key, value) {
							console.log(key,value);
							formDataProd.append(value, key);
						});

						$http
							.post('./hbr-selfie/dist/php/add_bill_product.php', formDataProd, {
								transformRequest: angular.identity,
								headers: { 'Content-Type': undefined }
							})
							.success(function (response) {
								console.log("back from service:", response);
							})
							.error(function (error) {
								console.log("back from service:", error);
							});
					});
				};
			});
			return deferred.promise;
		}
	}
}
module.exports = uploadService;