function profileController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('profileCtrl', profileCtrl);

    profileCtrl.$inject = ['$http','$scope', '$state','$rootScope','authenticationService','usersService'];

    function profileCtrl($http, $scope, $state, $rootScope, authenticationService, usersService) {
        var self = this; //jshint ignore:line

        function edit() {
        $rootScope.showSpinner = true;

        usersService.editusers(self.user).success(function (response) {
            if(!response.errors){
            sessionStorage.username = self.user.name + " " + self.user.lastname;
            $state.go('home.login', {}, { reload: true });    
            $rootScope.showSpinner = false;      
        } else {
             $rootScope.showSpinner = false;
            if(response.errors.existingEmail){
                self.existingEmail = response.errors.existingEmail;
            }
            if(response.errors.passwordError){
                self.passwordError = response.errors.passwordError;
            }
        }     
            });
        };

        function cancel(){
          $state.go('dashboard', {}, { reload: true });   
        }

        function init() {
             $rootScope.showSpinner = true;
            $scope.values = [
                { id: 1, name: 'Cuit' },
                { id: 2, name: 'Cuil' }
            ];
            authenticationService.checkAuth().then(function(response) {
                $http.get('./hbr-selfie/dist/php/users.php', { params: { action: "getUserById", id: response.data.uid } }).then(function(response) {
                        self.user = response.data;         
                         
                        self.user.codeType = parseInt(response.data.codeType);      
                        if (self.user.company_name && self.user.company_name.length > 0) {                          
                            $scope.showCompanyForm = true;                          
                        }
                        self.user.oldEmail = angular.copy(response.data.email);   
                    });
                      $rootScope.showSpinner = false;
                });
            self.edit = edit;
            self.cancel = cancel;
        }

        init();
    }
}
module.exports = profileController;