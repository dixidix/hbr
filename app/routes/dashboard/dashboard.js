function dashboardController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('dashboardCtrl', dashboardCtrl);

    dashboardCtrl.$inject = ['$http','$state'];

    function dashboardCtrl($http, $state) {
        var self = this; //jshint ignore:line
        function collapse_sidebar(){
            self.collapse = !self.collapse;
        }
        function init() {
            self.collapse = false;
            self.collapse_sidebar = collapse_sidebar;
            self.isAdmin  = sessionStorage.getItem('isAdmin') || 0;
        }
        init();
    }
}
module.exports = dashboardController;