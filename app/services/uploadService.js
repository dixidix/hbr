function uploadService(angular, app) {
	'use strict';
	app.service('uploadService', uploadService);
	uploadService.$inject = ["$http", "$q"];
	function uploadService($http, $q){
		this.uploadFile = function (file, url) {
			console.log(file, url);
			var deferred = $q.defer();
			var formData = new FormData();
			// angular.forEach(form, function(key,value){
				// formData.append(value,key);
			// 	$http.post(url, formData, {
			// 	transformRequest: angular.identity,
			// 	headers: {'Content-Type': undefined}
			// });
			// });
			// return deferred.promise;
		}
	}
}
module.exports = uploadService;