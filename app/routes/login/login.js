function loginController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$http', '$state', 'authenticationService', '$rootScope'];

    function loginCtrl($http, $state, authenticationService, $rootScope) {
        var self = this; //jshint ignore:line

        function login() {
            $rootScope.showSpinner = true;
            authenticationService.login(self.user)
                .then(function(response) {
                    if (!response.errors) {
                        console.log(response.data);
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
                                $state.go('dashboard', {}, { reload: true });
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
                .error(function(err) {
                    console.log(err);
                });
        }

        function init() {
            self.user = {};
            self.login = login;
            $rootScope.showSpinner = false;
        }
        init();
    }
}
module.exports = loginController;