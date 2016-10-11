function shoppingController(angular, app) {
    'use strict';

    'use angular template'; //jshint ignore:line

    app.controller('shoppingCtrl', shoppingCtrl);

    shoppingCtrl.$inject = ['$http'];

    function shoppingCtrl($http) {
        var self = this; //jshint ignore:line
        function get_userdata(){
            $http.get('./dist/php/users.php', { params: { sskey: sessionStorage.getItem('sskey'), action: "getUserBySskey" } })
            .then(function(response){
                self.purchase.user = response.data;
            });
        }

        function add_purchase(){
           self.purchase.products.push(self.purchase.data);
           self.purchase.data = {};
           self.shoppingForm_purchase.$valid = true;
           self.shoppingForm_purchase.$setPristine();
           self.shoppingForm_purchase.$submitted = false;
           console.log(self.purchase);
        }
        function init() {
            self.purchase = {
                user: {},
                data:{},
                products : []
            };
            self.collapse_personal = true;
            self.collapse_purchase = true;
            self.collapse_list = true;
            self.add_purchase = add_purchase;
            get_userdata();
        }
        init();
    }
}
module.exports = shoppingController;