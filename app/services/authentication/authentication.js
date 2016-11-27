function authenticationService(angular, app) {

	app.service('authenticationService', authenticationService);

	authenticationService.$inject = ['$http', '$q'];
	function authenticationService($http, $q) {
		this.checkAuth = function () {
			return $http.post('./hbr-selfie/dist/php/session.php',{ sskey: sessionStorage.getItem('sskey') });			
		};
		this.login = function (user) {
			var deffered = $q.defer();
			return $http.get('./hbr-selfie/dist/php/users.php', { params: { username: user.username, password: user.password, action: "login" } });
		};
		this.logout = function () {
			var deffered = $q.defer();
			$http.post('./hbr-selfie/dist/php/users.php',{ sskey: sessionStorage.getItem("sskey"),method:"POST", action: "logout" })
			.success(function (response) {
				sessionStorage.clear();
				deffered.resolve();
			})
			.error(function error(err) {
				deffered.reject(err);
			});
			return deffered.promise;
		};
		this.register = function (user) {
			var deffered = $q.defer();
			return $http.post('./hbr-selfie/dist/php/users.php',{
				name: user.name,
				lastname: user.lastname,
				tel: user.tel,
				cel: user.cel,
				codeType: user.codeType.toString(),
				idCode: user.idCode,
				email: user.email,
				address: user.address,
				localidad: user.localidad,
				postalCode: user.postalCode,
				password: user.password,
				password2: user.password2,
				method:"POST",
				action: "register"
			});
		};
		this.registerCompany = function (company) {
			var deffered = $q.defer();
			return $http.post('./hbr-selfie/dist/php/users.php',{
				company_name: company.company_name,
				company_real_name: company.company_real_name,
				tel: company.tel,
				cel: company.cel,
				codeType: company.codeType.toString(),
				idCode: company.idCode,
				email: company.email,
				address: company.address,
				localidad: company.localidad,
				postalCode: company.postalCode,
				password: company.password,
				password2: company.password2,
				method:"POST",
				action: "register"
			});
		};
	}
}
module.exports = authenticationService;