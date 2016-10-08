function homeController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$http'];

    function homeCtrl($http) {
        var self = this; //jshint ignore:line

        function init() {

        }
        init();
    }
}
module.exports = homeController;