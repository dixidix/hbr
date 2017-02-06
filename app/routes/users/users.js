function usersController(angular, app) {
  'use strict';

  'use angular template'; //jshint ignore:line

  app.controller('usersCtrl', usersCtrl);
  usersCtrl.$inject = ['usersService', '$http', '$filter', '$state', '$scope', '$uibModal'];

  app.controller('modalAddUserCtrl', modalAddUserCtrl);
  modalAddUserCtrl.$inject = ['usersService', '$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', 'userType', '$rootScope', '$http'];
  app.controller('modalEditUserCtrl', modalEditUserCtrl);
  modalEditUserCtrl.$inject = ['usersService', '$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', '$rootScope', 'user', '$http'];

  app.controller('modalDeleteUserCtrl', modalDeleteUserCtrl);
  modalDeleteUserCtrl.$inject = ['usersService', '$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', '$rootScope', 'user', '$http'];

  function usersCtrl(usersService, $http, $filter, $state, $scope, $uibModal) {
    var self = this; //jshint ignore:line
    function edit(size, user) {
      var modalInstance = $uibModal.open({
        templateUrl: 'edituser.html',
        controller: 'modalEditUserCtrl',
        controllerAs: 'modalEditUser',
        size: size,
        resolve: {
          user: function () {
            return user;
          }
        }
      });
    }

    function addUser() {
      var userType = 0;
      var modalInstance = $uibModal.open({
        templateUrl: 'adduser.html',
        controller: 'modalAddUserCtrl',
        controllerAs: 'modalAddUser',
        size: 'md',
        resolve: {
          userType: function () {
            return userType;
          }
        }
      });
    }

    function addCompany() {
      var userType = 1;
      var modalInstance = $uibModal.open({
        templateUrl: 'adduser.html',
        controller: 'modalAddUserCtrl',
        controllerAs: 'modalAddUser',
        size: 'md',
        resolve: {
          userType: function () {
            return userType;
          }
        }
      });
    }

    function deleteUser(size, user) {
      var modalInstance = $uibModal.open({
        templateUrl: 'deleteuser.html',
        controller: 'modalDeleteUserCtrl',
        controllerAs: 'modalDeleteUser',
        size: size,
        resolve: {
          user: function () {
            return user;
          }
        }
      });
    }
    function editUser(user) {
      edit('md', user);
    }
    function removeUser(user) {
      deleteUser('md', user);
    }
    function changePrivileges(user) {
      console.log(user);
      usersService.changeRoles(user)
        .then(function (response) {
          if (!response.data.errors) {

            $state.go('dashboard.users', {}, { reload: true });
          }
        });
    }
    function init() {
      self.client_type = $state.params.client_type;
      $http.get('./hbr-selfie/dist/php/users.php', {
        params: {
          client_type: self.client_type,
          action: 'getAll'
        }
      }).then(function (response) {
        self.users = response.data.users;
      });

      self.editUser = editUser;
      self.addUser = addUser;
      self.addCompany = addCompany;
      self.removeUser = removeUser;
      self.changePrivileges = changePrivileges;
    }
    init();
  }

  function modalAddUserCtrl(usersService, $scope, $state, $filter, $uibModalInstance, $sce, $compile, userType, $rootScope, $http) {
    var self = this;
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    };
    function adduser() {
      usersService.adduser(self.user)
        .then(function (response) {
          if (!response.data.errors) {
            $uibModalInstance.dismiss('cancel');
            $state.go('dashboard.users', {}, { reload: true });
          }
        });
    };

    function addcompany() {
      usersService.addcompany(self.user)
        .then(function (response) {
          if (!response.data.errors) {
            $uibModalInstance.dismiss('cancel');
            $state.go('dashboard.users', {}, { reload: true });
          }
        });
    };


    function init() {
      $scope.values = [
        { id: 1, name: 'Cuit' },
        { id: 2, name: 'Cuil' }
      ];

      $scope.title = "Add User";
       $scope.showCompanyForm = false;
      if (userType == "1") {
        $scope.title = "Add Company";
        $scope.showCompanyForm = true;
      }
      self.user = {};
      self.cancel = cancel;
      self.adduser = adduser;
      self.addcompany = addcompany;
    }
    init();
  }

  function modalEditUserCtrl(usersService, $scope, $state, $filter, $uibModalInstance, $sce, $compile, $rootScope, user, $http) {
    var self = this;
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    };
    function edit() {
      usersService.editusers(self.user)
        .then(function (response) {
          if (!response.data.errors) {
            $uibModalInstance.dismiss('cancel');
            if(!$scope.showCompanyForm){
            $state.go('dashboard.users', {}, { reload: true });
            } else {
               $state.go('dashboard.business', {}, { reload: true });
            }
          }
        });
    };
    function init() {
      $scope.values = [
        { id: 1, name: 'Cuit' },
        { id: 2, name: 'Cuil' }
      ];
      $scope.title = "Edit User";
      if (user.company_name && user.company_name.length > 0) {
        $scope.title = "Edit Company";
        $scope.showCompanyForm = true;
      }
      self.user = user;
      self.user.oldEmail = angular.copy(self.user.email);   
      self.cancel = cancel;
      self.edit = edit;
    }
    init();
  }
  function modalDeleteUserCtrl(usersService, $scope, $state, $filter, $uibModalInstance, $sce, $compile, $rootScope, user, $http) {
    var self = this;
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    };
    function deleteUser() {
      usersService.deleteusers(self.user)
        .then(function (response) {
          if (!response.data.errors) {
            $uibModalInstance.dismiss('cancel');
            $state.go('dashboard.users', {}, { reload: true });
          }
        });
    };
    function init() {
      self.user = user;
      self.cancel = cancel;
      self.deleteUser = deleteUser;
    }
    init();
  }
}
module.exports = usersController;