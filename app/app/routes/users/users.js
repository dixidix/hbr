function usersController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('usersCtrl', usersCtrl);

    usersCtrl.$inject = ['$http'];

    function usersCtrl($http) {
        var self = this; //jshint ignore:line

        function init() {
            $http
                .get('./dist/php/users.php',{params:{data:"data"}})
                .success(function (response) {
                    self.userlist = response;
                })
                .error(function (error) {
                    console.log(error);
                });

        }
        init();
    }
}
module.exports = usersController;