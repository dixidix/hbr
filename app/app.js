(function() {
    'use strict';    
    var app = angular.module('baseapp', ['ngAnimate', 'ui.bootstrap', 'ui.router', 'ngSanitize', 'uiSwitch']);
     app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
            $urlRouterProvider.otherwise("/hbr-selfie");
            $locationProvider.html5Mode(true);
            $stateProvider
                .state('home', { abstract: true, url: "/hbr-selfie/", templateUrl: "./hbr-selfie/dist/routes/home/home.template.html", data: { title: 'hbr-selfie', requireAuth: false }, controller: "homeCtrl", controllerAs: "home" })
                .state('home.login', { url: '', templateUrl: "./hbr-selfie/dist/routes/login/login.template.html", data: { title: 'Ingresar', requireAuth: false }, controller: "loginCtrl", controllerAs: "login" })
                .state('home.register', { url: "register", templateUrl: "./hbr-selfie/dist/routes/register/register.template.html", data: { title: 'Registrar', requireAuth: false }, controller: "registerCtrl", controllerAs: "register" })
                .state('dashboard', { url: "/hbr-selfie/dashboard", params: { isAdmin: 0, clientType: '0' }, templateUrl: "./hbr-selfie/dist/routes/dashboard/dashboard.template.html", data: { title: 'Dashboard', requireAuth: true }, controller: "dashboardCtrl", controllerAs: "dashboard" })
                .state('dashboard.comming_soon', { url: "/comming-soon", templateUrl: "./hbr-selfie/dist/routes/comming_soon/comming_soon.template.html", data: { title: 'Comming Soon', requireAuth: true }, controller: "commingSoonCtrl", controllerAs: "commingSoon" })
                .state('dashboard.profile', { url: "/profile", templateUrl: "./hbr-selfie/dist/routes/profile/profile.template.html", data: { title: 'Perfil', requireAuth: true }, controller: "profileCtrl", controllerAs: "profile" })
                .state('dashboard.shopping', { url: "/shopping", cache: false, params: { venta: null }, templateUrl: "./hbr-selfie/dist/routes/shopping/shopping.template.html", data: { title: 'Comprar', requireAuth: true }, controller: "shoppingCtrl", controllerAs: "shopping" })
                .state('dashboard.shopping_list', { url: "/shopping/list", templateUrl: "./hbr-selfie/dist/routes/shopping_list/shopping_list.template.html", data: { title: 'Lista de compras', requireAuth: true }, controller: "shoppingListCtrl", controllerAs: "shoppingList" })
                .state('dashboard.checkout', { url: "/shopping/checkout", params: { paymentGatewayUrl: null }, templateUrl: "./hbr-selfie/dist/routes/checkout/checkout.template.html", data: { title: 'Checkout', requireAuth: true }, controller: "checkoutCtrl", controllerAs: "checkout" })
                .state('dashboard.success', { url: "/shopping/checkout/success/:token", templateUrl: "./hbr-selfie/dist/routes/success/success.template.html", data: { title: 'Pago Exitoso', requireAuth: true }, controller: "successCtrl", controllerAs: "success" })
                .state('dashboard.error', { url: "/shopping/checkout/error", templateUrl: "./hbr-selfie/dist/routes/error/error.template.html", data: { title: 'Error', requireAuth: true }, controller: "errorCtrl", controllerAs: "error" })
                .state('dashboard.users', { url: "/usuarios", params: { client_type: 0 }, templateUrl: "./hbr-selfie/dist/routes/users/users.template.html", data: { title: 'Users', requireAuth: true }, controller: "usersCtrl", controllerAs: "users" })
                .state('dashboard.business', { url: "/empresas", params: { client_type: 1 }, templateUrl: "./hbr-selfie/dist/routes/users/users.template.html", data: { title: 'Companies', requireAuth: true }, controller: "usersCtrl", controllerAs: "users" })
                .state('dashboard.warehouse', { url: "/warehouse", templateUrl: "./hbr-selfie/dist/routes/warehouse/warehouse.template.html", data: { title: 'warehouse', requireAuth: true }, controller: "warehouseCtrl", controllerAs: "warehouses" })
                .state('dashboard.products', { url: "/productos", templateUrl: "./hbr-selfie/dist/routes/products/products.template.html", data: { title: 'Productos', requireAuth: true }, controller: "productCtrl", controllerAs: "products" })
                .state('dashboard.categories', { url: "/categorias", templateUrl: "./hbr-selfie/dist/routes/categories/categories.template.html", data: { title: 'Categorias', requireAuth: true }, controller: "categoryCtrl", controllerAs: "categories" })
                .state('dashboard.manage_awb', { url: "/airway-bills", templateUrl: "./hbr-selfie/dist/routes/airwayBills/airwaybills.template.html", data: { title: 'Airway Bills', requireAuth: true }, controller: "airwayCtrl", controllerAs: "airway" })
                .state('dashboard.airwaybill_list', { url: "/airway/list", templateUrl: "./hbr-selfie/dist/routes/airwaybill_list/airwaybill_list.template.html", data: { title: 'Ver Guias', requireAuth: true }, controller: "airwayListCtrl", controllerAs: "airwayList" })
                .state('dashboard.process_payments', { url: "/pagos", templateUrl: "./hbr-selfie/dist/routes/process_payments/process_payments.template.html", data: { title: 'Procesar Pagos', requireAuth: true }, controller: "processPaymentsCtrl", controllerAs: "processPayments" })
                .state('dashboard.stock_rooms', { url: "/stock-rooms", params: { boxId: null, spBoxId: null, tracking: null }, templateUrl: "./hbr-selfie/dist/routes/wh-box/stock-rooms/stock-rooms.template.html", data: { title: 'Stock Rooms', requireAuth: true }, controller: "stockRoomsCtrl", controllerAs: "stockRooms" })
                .state('dashboard.awb-box', { url: "/awb-box", params: { awbId: null }, templateUrl: "./hbr-selfie/dist/routes/wh-box/awb-box/awb-box.template.html", data: { title: 'Box Airway bill', requireAuth: true }, controller: "awbBoxCtrl", controllerAs: "awb" })
                .state('dashboard.history', { url: "/history", templateUrl: "./hbr-selfie/dist/routes/wh-box/history/history.template.html", data: { title: 'History', requireAuth: true }, controller: "historyCtrl", controllerAs: "history" })
                .state('dashboard.shipping', { url: "/shipping", templateUrl: "./hbr-selfie/dist/routes/wh-box/shipping/shipping.template.html", data: { title: 'Shipping Page', requireAuth: true }, controller: "shippingCtrl", controllerAs: "shipping" });
        }])
        .run(['$rootScope', '$state','$http', '$stateParams', 'authenticationService', function($rootScope, $state,$http, $stateParams, authenticationService) {
            var lang = localStorage.getItem('lang');

            $rootScope.setLang = function (lang) {
                if(!lang || lang == 'es'){
                    return $http.get('./hbr-selfie/dist/i18n.es.json');
                } else if (lang == 'en'){
                    return $http.get('./hbr-selfie/dist/i18n.en.json');
                }
            }

            $rootScope.setLang(lang).then(function (langs){
                $rootScope.langs = langs.data;
            });

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.showSpinner = false;
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $rootScope.showSpinner = true;
            });
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                $rootScope.showSpinner = false;
                if (toState.data.requireAuth) {
                    authenticationService.checkAuth().then(function(response) {
                        if (!response.data.isLogged) {
                            $state.go('home.login');
                        }
                    });
                } else if (toState.name == "home" || toState.name == "home.login") {
                    authenticationService.checkAuth().then(function(response) {
                        if (response.data.isLogged) {
                            $state.go('dashboard');
                        }
                    });
                }
            });
        }]);

    app.filter('start', function() {
        return function(input, start) {
            if (!input || !input.length) { return; }
            start = +start;
            return input.slice(start);
        };
    });

    require('./routes/home/home.js')(angular, app);
    require('./routes/login/login.js')(angular, app);
    require('./routes/register/register.js')(angular, app);
    require('./routes/dashboard/dashboard.js')(angular, app);
    require('./routes/checkout/checkout.js')(angular, app);
    require('./routes/success/success.js')(angular, app);
    require('./routes/error/error.js')(angular, app);
    require('./routes/users/users.js')(angular, app);
    require('./routes/warehouse/warehouse.js')(angular, app);
    require('./routes/process_payments/process_payments.js')(angular, app);
    require('./routes/shopping/shopping.js')(angular, app);
    require('./routes/shopping_list/shopping_list.js')(angular, app);
    require('./routes/profile/profile.js')(angular, app);
    require('./routes/products/products.js')(angular, app);
    require('./routes/categories/categories.js')(angular, app);
    require('./routes/airwayBills/airwaybills.js')(angular, app);
    require('./routes/airwaybill_list/airwaybill_list.js')(angular, app);
    require('./routes/wh-box/history/history.js')(angular, app);
    require('./routes/wh-box/shipping/shipping.js')(angular, app);
    require('./routes/wh-box/stock-rooms/stock-rooms.js')(angular, app);
    require('./routes/wh-box/awb-box/awb-box.js')(angular, app);

    require('./services/authentication/authentication.js')(angular, app);
    require('./services/boxes/box.service.js')(angular, app);
    require('./services/awb-box/awb-box.service.js')(angular, app);
    require('./services/boxes/shipping.service.js')(angular, app);
    require('./services/forms/warehouse.js')(angular, app);
    require('./services/forms/products.js')(angular, app);
    require('./services/forms/users.js')(angular, app);
    require('./services/forms/categories.js')(angular, app);
    require('./services/forms/airway.js')(angular, app);
    require('./services/uploadService.js')(angular, app);

    require('./components/navbar/navbar.js')(angular, app);
    require('./components/uploader/uploader.js')(angular, app);
    require('./components/drag-drop/drag-drop.directive.js')(angular, app);
})();