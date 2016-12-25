function uploadService(angular, app) {
	'use strict';
	app.service('uploadService', uploadService);
	uploadService.$inject = ["$http", "$q"];
	function uploadService($http, $q){
		this.uploadProducts = function (products, ventaId, timestamp) {
			var deferred = $q.defer();
			angular.forEach(products, function (product) {
				product.ventaId = ventaId;
				product.timestamp = timestamp;
				var formData = new FormData();
				angular.forEach(product, function(key,value){
					formData.append(value,key);
				});

				$http.post('./hbr-selfie/dist/php/add_products.php', formData, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				});
			});
			return deferred.promise;
		}
	}
}
module.exports = uploadService;