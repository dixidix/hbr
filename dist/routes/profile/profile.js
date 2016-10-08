function profileController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('profileCtrl', profileCtrl);

    profileCtrl.$inject = ['$http'];

    function profileCtrl($http) {
        var self = this; //jshint ignore:line

        function init() {

        }
        init();
    }
}
module.exports = profileController;