function checkoutController(angular, app) {
  'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('checkoutCtrl', checkoutCtrl);
    checkoutCtrl.$inject = ['$http','$filter','$state','$scope','$sce'];


    function checkoutCtrl($http, $filter, $state, $scope,$sce){
        var self = this; //jshint ignore:line
        function trustSrc (src) {
          return $sce.trustAsResourceUrl(src);
        }
        function init() {
          self.paymentGatewayUrl = $state.params.paymentGatewayUrl;
          self.trustSrc = trustSrc;
        }
        init();
      }
    }
    module.exports = checkoutController;