function authenticationService(angular, app) {

	app.service('authenticationService', authenticationService);

	authenticationService.$inject = ['$http'];
	function authenticationService($http){
        this.checkAuth = function(){
            return true;
        };
	}
}
module.exports = authenticationService;