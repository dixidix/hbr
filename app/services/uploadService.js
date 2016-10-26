function uploadService(angular, app) {
	'use strict';
	app.service('uploadService', uploadService);
	uploadService.$inject = ["$http", "$q"];
	function uploadService($http, $q){
		this.uploadFile = function (form, url) {

			var deferred = $q.defer();
			var formData = new FormData();
			angular.forEach(form, function(key,value){
				formData.append(value,key);
			});
			formData.append("method","POST");
			$http.post(url, formData, {
				transformRequest: angular.identity,
				headers: {'Content-Type': "text/json"}
			});
			return deferred.promise;
		}
	}
}
module.exports = uploadService;