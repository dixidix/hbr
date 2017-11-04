function navbarDirective(angular, app) {

    'use angular template'; //jshint ignore:line

    app.directive('navbar', navbar);
    navbar.$inject = ['$state', 'authenticationService','$rootScope', '$window', '$uibModalStack'];

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
                scope.lang = sessionStorage.getItem('lang') || 'es';
                scope.username = sessionStorage.getItem('username') || "";
                scope.isAdmin = JSON.parse(sessionStorage.getItem('isAdmin'));
            }, true);
        }

        controller.$inject = ['$scope'];
        function controller($scope, $rootScope, $window) {
            var self = this; // jshint:ignore
            function setLang (lang) {
                $rootScope.showSpinner = true;
                localStorage.setItem('lang', lang);
                self.lang = lang;
                $rootScope.setLang(lang).then(function (langs){
                    $rootScope.langs = langs.data;
                    self.lang = $rootScope.langs.navbar;
                    self.openLang = false;
                    angular.element('#lang-menu').removeClass('in');
                    self.langSet = localStorage.getItem('lang') || 'es';
                    $rootScope.showSpinner = false;
                });
            }

            function logout() {
                $rootScope.showSpinner = true;
                authenticationService.logout()
                    .then(function() {
                        $rootScope.showSpinner = false;
                        setTimeout(function() {
                            sessionStorage.clear();
                            window.location.href = 'https://tucourier.com.ar/hbr-selfie/';
                        }, 300);
                    })
                    .error(function(err) {
                        console.log(err);
                    });

            }

            function init() {
                self.logout = logout;
                self.setLang = setLang;
                self.openLang = false;
                self.langSet = localStorage.getItem('lang') || 'es';
                $scope.$watch('$root.langs', function() {
                    if($rootScope && $rootScope.langs && $rootScope.langs.navbar){
                        self.lang = $rootScope.langs.navbar;
                    }
                });
            }
            init();
        }
    }
}

module.exports = navbarDirective;