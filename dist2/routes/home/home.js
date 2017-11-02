function homeController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$http', '$rootScope'];

    function homeCtrl($http, $rootScope) {
        var self = this; //jshint ignore:line

        function init() {
            $rootScope.ShowSpinner = false;
        }
        init();
    }
}
module.exports = homeController;