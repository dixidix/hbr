function airwayController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('airwayCtrl', airwayCtrl);

    airwayCtrl.$inject = ['$http', '$state','airwayService'];

    function airwayCtrl($http, $state, airwayService) {
        var self = this; //jshint ignore:line

        function init() {
            airwayService.get_airwayBills(null, 1)
            .then(function success(response){
                self.guides = response.data.guideBatch;
                console.log(self.guides);
            });
        }
        init();
    }
}
module.exports = airwayController;