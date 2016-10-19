(function () {
	'use strict';
	var app = angular.module('baseapp', ['ui.router', 'ngSanitize','ui.bootstrap','ngAnimate'])
	.config(['$stateProvider','$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/myhbr");
		$stateProvider
		.state('home', {  abstract: true, url: "/myhbr", templateUrl: "./dist/routes/home/home.template.html", data: { title: 'MyHBR', requireAuth: false }, controller: "homeCtrl", controllerAs: "home" })
		.state('home.login',  { url: '', templateUrl: "./dist/routes/login/login.template.html", data: { title: 'Ingresar', requireAuth: false }, controller: "loginCtrl", controllerAs: "login" })
		.state('home.register', { url: "/register", templateUrl: "./dist/routes/register/register.template.html", data: { title: 'Registrar', requireAuth: false }, controller: "registerCtrl", controllerAs: "register" })
		.state('dashboard', { url: "/myhbr/dashboard", params: { isAdmin: 0 }, templateUrl: "./dist/routes/dashboard/dashboard.template.html", data: { title: 'Dashboard', requireAuth: true }, controller: "dashboardCtrl", controllerAs: "dashboard" })
		.state('dashboard.comming_soon', { url: "/comming-soon", templateUrl: "./dist/routes/comming_soon/comming_soon.template.html", data: { title: 'Comming Soon', requireAuth: true }, controller: "commingSoonCtrl", controllerAs: "commingSoon" })
		.state('dashboard.profile', { url: "/profile", templateUrl: "./dist/routes/profile/profile.template.html", data: { title: 'Perfil', requireAuth: true }, controller: "profileCtrl", controllerAs: "profile" })
		.state('dashboard.shopping', { url: "/shopping", templateUrl: "./dist/routes/shopping/shopping.template.html", data: { title: 'Comprar', requireAuth: true }, controller: "shoppingCtrl", controllerAs: "shopping" })
		.state('dashboard.shopping_list', { url: "/shopping/list", templateUrl: "./dist/routes/shopping_list/shopping_list.template.html", data: { title: 'Lista de compras', requireAuth: true }, controller: "shoppingListCtrl", controllerAs: "shoppingList" })
		.state('dashboard.checkout', { url: "/shopping/checkout", params: { paymentGatewayUrl: null }, templateUrl: "./dist/routes/checkout/checkout.template.html", data: { title: 'Checkout', requireAuth: true }, controller: "checkoutCtrl", controllerAs: "checkout" })
		.state('dashboard.success', { url: "/shopping/checkout/success/token", templateUrl: "./dist/routes/success/success.template.html", data: { title: 'Pago Exitoso', requireAuth: true }, controller: "successCtrl", controllerAs: "success" })
		.state('dashboard.error', { url: "/shopping/checkout/error",  templateUrl: "./dist/routes/error/error.template.html", data: { title: 'Error', requireAuth: true }, controller: "errorCtrl", controllerAs: "error" })
		.state('dashboard.users', { url: "/usuarios",  templateUrl: "./dist/routes/users/users.template.html", data: { title: 'Adm. usuarios', requireAuth: true }, controller: "usersCtrl", controllerAs: "users" })
		.state('dashboard.process_payments', { url: "/pagos",  templateUrl: "./dist/routes/process_payments/process_payments.template.html", data: { title: 'Procesar Pagos', requireAuth: true }, controller: "processPaymentsCtrl", controllerAs: "processPayments" });
	}])
	.run(['$rootScope', '$state', '$stateParams', 'authenticationService', function ($rootScope, $state, $stateParams, authenticationService) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

			if (toState.data.requireAuth) {
				console.log(toState.data.requireAuth);
				authenticationService.checkAuth().then(function (response){
					console.log(response);
					if(!response.data.isLogged){
						$state.go('home.login');
					}
				});
			} else if(toState.name == "home" || toState.name == "home.login"){
				authenticationService.checkAuth().then(function (response){
					if(response.data.isLogged){
						$state.go('dashboard');
					}
				});
			}
		});
	}]);
	require('./routes/home/home.js')(angular, app);
	require('./routes/login/login.js')(angular, app);
	require('./routes/register/register.js')(angular, app);
	require('./routes/dashboard/dashboard.js')(angular, app);
	require('./routes/checkout/checkout.js')(angular, app);
	require('./routes/success/success.js')(angular, app);
	require('./routes/error/error.js')(angular, app);
	require('./routes/users/users.js')(angular, app);
	require('./routes/process_payments/process_payments.js')(angular, app);
	require('./routes/shopping/shopping.js')(angular, app);
	require('./routes/shopping_list/shopping_list.js')(angular, app);
	require('./routes/profile/profile.js')(angular, app);
	require('./services/authentication/authentication.js')(angular, app);
	require('./components/navbar/navbar.js')(angular, app);
})();
