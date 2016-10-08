function commingSoonController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('commingSoonCtrl', commingSoonCtrl);

    commingSoonCtrl.$inject = ['$http'];

    function commingSoonCtrl($http) {
        var self = this; //jshint ignore:line

        function init() {

        }
        init();
    }
}
module.exports = commingSoonController;