function loginController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$http', '$state'];

    function loginCtrl($http, $state) {
        var self = this; //jshint ignore:line

        function login() {
            $http.get('./dist/php/users.php').then(function (response) {
                console.log(response.data);
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