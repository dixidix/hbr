function dashboardController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('dashboardCtrl', dashboardCtrl);

    dashboardCtrl.$inject = ['$http', '$state','$filter', '$scope', '$rootScope','$uibModal','authenticationService'];

    app.controller('modalTutorialCtrl', modalTutorialCtrl);
    modalTutorialCtrl.$inject = ['$scope', '$state', '$filter', '$uibModalInstance', '$sce', '$compile', '$rootScope', 'usersService', 'userId'];

    function dashboardCtrl($http, $state,$filter,$scope, $rootScope, $uibModal, authenticationService) {
        var self = this; //jshint ignore:line
        function collapse_sidebar() {
            self.collapse = !self.collapse;
            self.lang.hide_show = self.collapse ? self.lang.show_menu : self.lang.hide_menu;
        }

        function toggle (feature) {
            if(feature == 'small') {
                self.toggleSmall = !self.toggleSmall;
                if(self.toggleSmall) self.toggleBusiness = false;
            } else {
                self.toggleBusiness = !self.toggleBusiness;
                if(self.toggleBusiness) self.toggleSmall = false;
            }
        }

        function init() {
            self.toggle = toggle;
            self.toggleSmall = false;
            self.toggleBusiness = false;

            self.lang = $rootScope.langs.dashboard;            
            $scope.$watch('$root.langs', function() {
                self.lang = $rootScope.langs.dashboard;
                self.lang.hide_show = self.collapse ? self.lang.show_menu : self.lang.hide_menu;
            });

            self.collapse = false;
            self.collapse_sidebar = collapse_sidebar;
            self.isAdmin = JSON.parse(sessionStorage.getItem('isAdmin'));
            self.clientType = JSON.parse(sessionStorage.getItem('clientType'));
            if($state.current.name =="dashboard"){
            authenticationService.checkAuth().then(function(response) {
                if(response.data.client_type == 0 && response.data.isAdmin == 0 && response.data.showTutorial == 0){
                    var userId = response.data.uid;
                    var modalInstance = $uibModal.open({
                        templateUrl: './hbr-selfie/dist/routes/dashboard/modals/tutorial.template.html',
                        controller: 'modalTutorialCtrl',
                        controllerAs: 'tutorial',
                        backdrop: 'static',
                        size: 'md',
                        resolve: {
                            userId: function () {
                                return userId;
                            }
                        }
                    });        
                }
            });
            }
        }
        init();
    }

    function modalTutorialCtrl($scope, $state, $filter, $uibModalInstance, $sce, $compile, $rootScope, usersService, userId) {
    var self = this;

    function next () {
        $scope.step = $scope.step + 1;
        $('.modal-body').scrollTop(0);
    }
    
    function prev () {
        $scope.step = $scope.step - 1;
        $('.modal-body').scrollTop(0);
    }

    function cancel() {
        if(self.dontShow){
            var uid = userId;
            usersService.tutorialChange(uid).then(function(response){
                $uibModalInstance.dismiss('cancel');
            });
        } else {
            $uibModalInstance.dismiss('cancel');
        }
    };

    function init(){
        self.cancel = cancel;
        self.dontShow = false;
        $scope.step = 1;
        self.next = next;
        self.prev = prev;
    }

    init();
}
}
module.exports = dashboardController;