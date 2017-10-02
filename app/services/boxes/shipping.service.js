function shippingService(agular, app) {
    app.service('shippingService', shippingService);
    shippingService.$inject = ['$http', 'authenticationService'];

    function shippingService($http, authenticationService) {
        this._getLang = function(isAdmin) {
            var isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            return $http.get('./hbr-selfie/dist/routes/wh-box/shipping/i18n.json').then(function(res) {
                if (isAdmin == 1) {
                    return res.data.en;
                } else {
                    return res.data.es;
                }
            })
        }
    }
}

module.exports = shippingService;