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
                if(!response.data.error){
                    sessionStorage.setItem("sskey", response.sskey);
                    sessionStorage.username = response.name + " " + response.lastname;
                    $state.go('dashboard',{reload:true});
                    self.loginForm.username.$invalid = false;
                    self.loginForm.username.$valid = true;
                    self.loginForm.password.$invalid = false;
                    self.loginForm.password.$valid = true;
                    self.registerForm.$invalid = false;
                    self.registerForm.$valid = true;
                } else {
                    self.loginError = response.data.error.loginError;
                    self.loginForm.username.$invalid = true;
                    self.loginForm.password.$invalid = true;
                    self.registerForm.$invalid = true;
                }
            });
        }

        function init() {
            self.user = {};
            self.login = login;
            self.loggedIn = sessionStorage.getItem('isLogged') || false;
            self.user.username = JSON.parse(sessionStorage.getItem('username'));
        }
        init();
    }
}
module.exports = loginController;