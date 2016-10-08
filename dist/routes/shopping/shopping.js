function shoppingController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('shoppingCtrl', shoppingCtrl);

    shoppingCtrl.$inject = ['$http'];

    function shoppingCtrl($http) {
        var self = this; //jshint ignore:line

        function init() {

        }
        init();
    }
}
module.exports = shoppingController;