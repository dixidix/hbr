(function () {
	'use strict';
	var app = angular.module('baseapp', ['ui.router', 'ngSanitize'])
		.config(['$stateProvider','$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise("/");
			$stateProvider
				.state('home', { url: "/", templateUrl: "./dist/routes/home/home.template.html", data: { title: 'Home', requireAuth: false }, controller: "homeCtrl", controllerAs: "home" })
				.state('login', { url: "/login", templateUrl: "./dist/routes/login/login.template.html", data: { title: 'Login', requireAuth: false }, controller: "loginCtrl", controllerAs: "login" })
				.state('register', { url: "/register", templateUrl: "./dist/routes/register/register.template.html", data: { title: 'Register', requireAuth: false }, controller: "registerCtrl", controllerAs: "register" })
				.state('users', { url: "/users", templateUrl: "./dist/routes/users/users.template.html", data: { title: 'Users', requireAuth: true }, controller: "usersCtrl", controllerAs: "users" });
		}])
		.run(['$rootScope', '$state', '$stateParams', 'authenticationService', function ($rootScope, $state, $stateParams, authenticationService) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
			$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
				if (toState.data.requireAuth && !authenticationService.checkAuth()) {
					$state.go('home');
				}
			});
		}]);
	require('./routes/home/home.js')(angular, app);
	require('./routes/login/login.js')(angular, app);
	require('./routes/register/register.js')(angular, app);
	require('./routes/users/users.js')(angular, app);
	require('./services/authentication/authentication.js')(angular, app);
	require('./components/navbar/navbar.js')(angular, app);
})();
