function navbarDirective(angular, app) {

    'use angular template'; //jshint ignore:line

    app.directive('navbar', navbar);
    navbar.$inject = ['$state', 'authenticationService', '$rootScope', '$window'];

    function navbar($state, authenticationService) {
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
                    .success(function() {
                        $rootScope.showSpinner = false;
                        setTimeout(function() {
                            sessionStorage.clear();
                            $state.go('home.login', {}, { reload: true });
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