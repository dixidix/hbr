function usersService(angular, app) {

    app.service('usersService', usersService);

    usersService.$inject = ['$http', '$q'];

    function usersService($http, $q) {

        this.editusers = function (users) {

            var deffered = $q.defer();

            return $http.put('./hbr-selfie/dist/php/users.php', {
                id: users.id,
                name: users.name,
                lastname: users.lastname,
                tel: users.tel,
                cel: users.cel,
                codeType: users.codeType,
                idCode: users.idCode,
                email: users.email,
                address: users.address,
                localidad: users.localidad,
                postalcode: users.postalcode,
                password: users.password,
                password2: users.password2,
                client_type: '2',
                action: "edit"

            });
        };
        this.deleteusers = function (users) {

            var deffered = $q.defer();

            return $http.put('./hbr-selfie/dist/php/users.php', {
                id: users.id,
                action: "delete"
            });
        };
        this.changeRoles = function (users) {

            var deffered = $q.defer();

            return $http.put('./hbr-selfie/dist/php/users.php', {
                id: users.id,
                isAdmin: users.isAdmin == 0 ? 1 : 0,
                action: "changeRoles"
            });
        };

        this.getPremium = function () {
            return $http.get('./hbr-selfie/dist/php/users.php', {
                params: {
                    action: 'getUserBySskey',
                    sskey: sessionStorage.getItem('sskey') || false
                }
            });
        }
    }
}
module.exports = usersService;