function warehouseService(angular, app) {

	app.service('warehouseService', warehouseService);

	warehouseService.$inject = ['$http', '$q'];

	function warehouseService($http, $q) {

		this.add_warehouse = function (warehouse) {

			var deffered = $q.defer();

			return $http.post('./hbr-selfie/dist/php/warehouse.php', {
				warehouse_name: warehouse.name,
				user_name: warehouse.user_name,
				user_lastname: warehouse.user_lastname,
				tel: warehouse.tel,
				cel: warehouse.cel,
				codeType: '1',
				idCode: warehouse.idCode,
				email: warehouse.email,
				address: warehouse.address,
				localidad: warehouse.localidad,
				postalcode: warehouse.postalcode,
				password: warehouse.password,
				password2: warehouse.password2,
				client_type: '2',
				method: "POST"

			});
		};
		this.editWarehouse = function (warehouse) {

			var deffered = $q.defer();

			return $http.put('./hbr-selfie/dist/php/warehouse.php', {
				id: warehouse.id,
				warehouse_name: warehouse.name,
				user_name: warehouse.user_name,
				user_lastname: warehouse.user_lastname,
				tel: warehouse.tel,
				cel: warehouse.cel,
				codeType: '1',
				idCode: warehouse.idCode,
				email: warehouse.email,
				address: warehouse.address,
				localidad: warehouse.localidad,
				postalcode: warehouse.postalcode,
				password: warehouse.password,
				password2: warehouse.password2,
				client_type: '2',
				action: "edit"

			});
		};
		this.deleteWarehouse = function (warehouse) {
			console.log(warehouse.id);
			var deffered = $q.defer();

			return $http.put('./hbr-selfie/dist/php/warehouse.php', {
				id: warehouse.id,
				action: "delete"
			});
		};
	}
}
module.exports = warehouseService;