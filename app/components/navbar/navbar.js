function navbarDirective(angular, app) {

    'use angular template'; //jshint ignore:line

    app.directive('navbar', navbar);
    navbar.$inject = ['$state', 'authenticationService'];
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
            scope.$watch(function () {
                return sessionStorage.sskey;
            }, function (newVal, oldVal) {
                scope.isLogged = sessionStorage.getItem('sskey') || false;
                scope.username = sessionStorage.getItem('username') || "";
            }, true);
        }
        function controller() {
            var self = this; // jshint:ignore

            function logout() {
                authenticationService.logout()
                    .then(function success() {
                        $state.go('home.login', { reload: true });
                    },
                    function error(error) {

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