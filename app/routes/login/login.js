function loginController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$http', '$state','authenticationService'];

    function loginCtrl($http, $state,authenticationService) {
        var self = this; //jshint ignore:line

        function login() {
            authenticationService.login(self.user).then(function success(){
                $state.go('dashboard',{reload:true});
            },
            function error(error){
                console.log(error);
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