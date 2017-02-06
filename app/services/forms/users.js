function usersService(angular, app) {

    app.service('usersService', usersService);

    usersService.$inject = ['$http', '$q'];

    function usersService($http, $q) {

        
        this.tutorialChange = function (uid) {
            var deffered = $q.defer();
            
            return $http.put('./hbr-selfie/dist/php/users.php', {
                    id: uid,
                    action: "tutorialChange"
                });
        };
        this.adduser = function (user) {
            var deffered = $q.defer();
            return $http.post('./hbr-selfie/dist/php/users.php', {
                name: user.name,
                lastname: user.lastname,
                tel: user.tel,
                cel: user.cel,
                codeType: user.codeType.toString(),
                idCode: user.idCode,
                email: user.email,
                address: user.address,
                localidad: user.localidad,
                postalCode: user.postalCode,
                password: user.password,
                password2: user.password2,
                method: "POST",
                action: "register"
            });
        };

        this.addcompany = function (company) {
            var deffered = $q.defer();
            return $http.post('./hbr-selfie/dist/php/users.php', {
                company_name: company.company_name,
                company_real_name: company.company_real_name,
                tel: company.tel,
                cel: company.cel,
                codeType: company.codeType.toString(),
                idCode: company.idCode,
                email: company.email,
                address: company.address,
                localidad: company.localidad,
                postalCode: company.postalCode,
                password: company.password,
                password2: company.password2,
                method: "POST",
                action: "register"
            });
        };

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
                oldEmail: users.oldEmail,
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