function usersController(angular, app) {
  'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('usersCtrl', usersCtrl);
    usersCtrl.$inject = ['$http','$filter','$state','$scope','$uibModal'];

    app.controller('modalEditUserCtrl', modalEditUserCtrl);
    modalEditUserCtrl.$inject = ['$scope','$state','$filter','$uibModalInstance','$sce','$compile','$rootScope','user','$http'];

    app.controller('modalDeleteUserCtrl', modalDeleteUserCtrl);
    modalDeleteUserCtrl.$inject = ['$scope','$state','$filter','$uibModalInstance','$sce','$compile','$rootScope','user','$http'];

    function usersCtrl($http, $filter, $state, $scope,$uibModal){
        var self = this; //jshint ignore:line
        function edit(size, user){
          var modalInstance = $uibModal.open({
            templateUrl: 'edituser.html',
            controller: 'modalEditUserCtrl',
            controllerAs:'modalEditUser',
            size: size,
            resolve: {
              user: function () {
                return user;
              }
            }
          });
        }
        function deleteUser(size, user){
          var modalInstance = $uibModal.open({
            templateUrl: 'deleteuser.html',
            controller: 'modalDeleteUserCtrl',
            controllerAs:'modalDeleteUser',
            size: size,
            resolve: {
              user: function () {
                return user;
              }
            }
          });
        }
        function editUser(user){
          edit('md', user);
        }
        function removeUser(user){
          deleteUser('md', user);
        }
        function changePrivileges(priv){
         alert(priv);
       }
       function init() {
        self.client_type = $state.params.client_type;
        $http.get('./hbr-selfie/dist/php/users.php', {
          params: {
            client_type: self.client_type,
            action: 'getAll'
          }
        }).then(function(response){
          self.users = response.data.users;
        });

        self.editUser = editUser;
        self.removeUser = removeUser;
        self.changePrivileges = changePrivileges;
      }
      init();
    }
    function modalEditUserCtrl($scope,$state,$filter, $uibModalInstance,$sce,$compile,$rootScope,user,$http){
      var self = this;        
      function cancel () {
        $uibModalInstance.dismiss('cancel');
      };
      function edit () {


      };
      function init(){
        self.user = user;
        self.cancel = cancel;
        self.edit = edit;
      }
      init();
    }
    function modalDeleteUserCtrl($scope,$state,$filter, $uibModalInstance,$sce,$compile,$rootScope,user,$http){
      var self = this;        
      function cancel () {
        $uibModalInstance.dismiss('cancel');
      };
      function deleteUser () {

      };
      function init(){
        self.user = user;
        self.cancel = cancel;
        self.deleteUser = deleteUser;
      }
      init();
    }
  }
  module.exports = usersController;