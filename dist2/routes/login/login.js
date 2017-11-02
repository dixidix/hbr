function loginController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope','$http', '$state', 'authenticationService', '$rootScope'];

    function loginCtrl($scope, $http, $state, authenticationService, $rootScope) {
        var self = this; //jshint ignore:line

        function login() {
            $rootScope.showSpinner = true;
            var lang = sessionStorage.getItem('lang');
            authenticationService.login(self.user)
                .then(function(response) {
                    if (!response.data.errors) {
                        sessionStorage.setItem("lang", response.data.lang);
                        sessionStorage.setItem("sskey", response.data.sskey);
                        sessionStorage.setItem("isAdmin", response.data.isAdmin);
                        sessionStorage.setItem("clientType", response.data.client_type);
                        sessionStorage.setItem("clientType", response.data.client_type);
                        if (response.data.company_name || response.data.warehouse_name) {
                            sessionStorage.username = response.data.company_name || response.data.warehouse_name;
                        } else {
                            sessionStorage.username = response.data.name + " " + response.data.lastname;
                        }

                        self.loginForm.username.$invalid = false;
                        self.loginForm.username.$valid = true;
                        self.loginForm.password.$invalid = false;
                        self.loginForm.password.$valid = true;
                        self.loginForm.$invalid = false;
                        self.loginForm.$valid = true;
                        $rootScope.showSpinner = false;
                        setTimeout(function() {
                            if (sessionStorage.getItem('sskey')) {
                                $state.go('dashboard');
                            }
                        }, 100);
                    } else {
                        self.loginError = response.data.errors.loginError;
                        self.loginForm.username.$invalid = true;
                        self.loginForm.password.$invalid = true;
                        self.loginForm.$invalid = true;
                        $rootScope.showSpinner = false;
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
        }

        function init() {
            self.user = {};
            self.login = login;
            $rootScope.showSpinner = false;
            self.lang = $rootScope.langs.login;

            $scope.$watch('$root.langs', function() {
                self.lang = $rootScope.langs.login;
            });
        }
        init();
    }
}
module.exports = loginController;