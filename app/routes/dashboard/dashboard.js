function dashboardController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('dashboardCtrl', dashboardCtrl);

    dashboardCtrl.$inject = ['$http'];

    function dashboardCtrl($http) {
        var self = this; //jshint ignore:line
        function collapse_sidebar(){
            self.collapse = !self.collapse;
        }
        function init() {
            self.collapse = false;
            self.collapse_sidebar = collapse_sidebar;
        }
        init();
    }
}
module.exports = dashboardController;