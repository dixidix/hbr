function navbarDirective(angular, app) {

    'use angular template'; //jshint ignore:line

    app.directive('navbar', navbar);
    navbar.$inject = ['$state', 'authenticationService', '$rootScope', '$window', '$uibModalStack'];

    function navbar($state, authenticationService, $uibModalStack) {
        return {
            restrict: "E",
            replace: true,
            templateUrl: './hbr-selfie/dist/components/navbar/navbar.template.html',
            link: link,
            controllerAs: 'navbar',
            controller: controller
        };

        function link(scope, element, attrs) {

            scope.$watch(function() {
                return sessionStorage.sskey;
            }, function(newVal, oldVal) {
                authenticationService.checkAuth().then(function(response) {
                    scope.showTutorial = response.data.showTutorial;
                });
                scope.isLogged = sessionStorage.getItem('sskey') || false;
                scope.username = sessionStorage.getItem('username') || "";
                scope.isAdmin = JSON.parse(sessionStorage.getItem('isAdmin'));
            }, true);
        }

        function controller($rootScope, $window) {
            var self = this; // jshint:ignore
            function logout() {
                $rootScope.showSpinner = true;
                authenticationService.logout()
                    .then(function() {
                        $rootScope.showSpinner = false;
                        setTimeout(function() {
                            sessionStorage.clear();
                            window.location.href = 'http://tucourier.com.ar/hbr-selfie/';
                        }, 300);
                    })
                    .error(function(err) {
                        console.log(err);
                    });

            }

            function init() {
                self.logout = logout;
            }
            init();
        }
    }
}

module.exports = navbarDirective;