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
                .success(function(response) {
                    if (!response.errors) {
                        console.log(response.data);
                        sessionStorage.setItem("sskey", response.sskey);
                        sessionStorage.setItem("isAdmin", response.isAdmin);
                        sessionStorage.setItem("clientType", response.client_type);
                        sessionStorage.setItem("clientType", response.client_type);
                        sessionStorage.username = response.name + " " + response.lastname;

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
                        }, 3000);
                    } else {
                        self.loginError = response.errors.loginError;
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