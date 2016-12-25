/**
 * Created by dixian on 9/12/2016.
 */
function productService(angular, app) {

    app.service('productService', productService);

    productService.$inject = ['$http', '$q'];

    function productService($http, $q) {


        this.get_products = function (isPremium) {
            var deffered = $q.defer();
             return $http.get('./hbr-selfie/dist/php/product.php', {
                params: {
                    action: 'getAll',
                    isPremium: isPremium || ''
                }
            });

        };
        this.get_productsByCategoryId = function (categoryId) {
            var deffered = $q.defer();
            return $http.get('./hbr-selfie/dist/php/product.php', {
                params: {
                    action: 'getByCategoryId',
                    categoryId: categoryId
                }
            });

        };
        this.add_product = function (product) {

            var deffered = $q.defer();

            return $http.post('./hbr-selfie/dist/php/product.php', {
                category_id: product.category_id.category_id,
                product_name: product.name,
                product_desc: product.description,
                imp_rights: product.imp_rights,
                imp_estadistic_rate: product.imp_estadistic_rate,
                imp_iva: product.imp_iva,
                imp_iva_adic: product.imp_iva_adic,
                method: "POST"

            });
        };
        this.edit_product = function (product) {

            var deffered = $q.defer();
            return $http.put('./hbr-selfie/dist/php/product.php', {
                id: product.id,
                category_id: product.category_id.category_id,
                product_name: product.name,
                product_desc: product.description,
                imp_rights: product.imp_rights,
                imp_estadistic_rate: product.imp_estadistic_rate,
                imp_iva: product.imp_iva,
                imp_iva_adic: product.imp_iva_adic,
                action: "edit"

            });
        };
        this.delete_product = function (product) {
            var deffered = $q.defer();

            return $http.put('./hbr-selfie/dist/php/product.php', {
                id: product.id,
                action: "delete"
            });
        };

        this.changeprivileges = function (product) {
            var deffered = $q.defer();

            return $http.put('./hbr-selfie/dist/php/product.php', {
                id: product.id,
                isPremium: product.isPremium == 1 ? 0 : 1,
                action: "changeprivileges"
            });
        };
    }
}
module.exports = productService;