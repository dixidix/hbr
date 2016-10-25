function loginController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$http', '$state','authenticationService'];

    function loginCtrl($http, $state,authenticationService) {
        var self = this; //jshint ignore:line

        function login() {
            authenticationService.login(self.user)
            .then(function (response) {
                if(!response.data.errors){
                    sessionStorage.setItem("sskey", response.data.sskey);
                    sessionStorage.setItem("isAdmin", response.data.isAdmin);
                    sessionStorage.username = response.data.name + " " + response.data.lastname;
                    $state.go('dashboard',{isAdmin:  response.data.isAdmin, reload:true});
                    self.loginForm.username.$invalid = false;
                    self.loginForm.username.$valid = true;
                    self.loginForm.password.$invalid = false;
                    self.loginForm.password.$valid = true;
                    self.loginForm.$invalid = false;
                    self.loginForm.$valid = true;
                } else {
                    self.loginError = response.data.errors.loginError;
                    self.loginForm.username.$invalid = true;
                    self.loginForm.password.$invalid = true;
                    self.loginForm.$invalid = true;
                }
            });
        }

        function init() {
            self.user = {};
            self.login = login;
        }
        init();
    }
}
module.exports = loginController;