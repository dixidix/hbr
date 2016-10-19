function successController(angular, app) {
  'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('successCtrl', successCtrl);
    successCtrl.$inject = ['$http','$state', '$stateParams'];


    function successCtrl($http,  $state, $stateParams){
        var self = this; //jshint ignore:line

        function init() {
            $http.post('./dist/php/validate_success.php', { token: $stateParams.token })
            .then(function success(response){
                if(!response.data.validate){
                    $state.go('dashboard.error',{},{reload:true});
                }
            });            
        }
        init();
    }
}
module.exports = successController;