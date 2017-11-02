function errorController(angular, app) {
  'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('errorCtrl', errorCtrl);
    errorCtrl.$inject = ['$http','$state'];


    function errorCtrl($http,  $state){
        var self = this; //jshint ignore:line

        function init() {

        }
        init();
      }
    }
    module.exports = errorController;