function shoppingListController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('shoppingListCtrl', shoppingListCtrl);

    shoppingListCtrl.$inject = ['$http'];

    function shoppingListCtrl($http) {
        var self = this; //jshint ignore:line

        function init() {

        }
        init();
    }
}
module.exports = shoppingListController;