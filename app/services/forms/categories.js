function categoryService(angular, app) {

    app.service('categoryService', categoryService);

    categoryService.$inject = ['$http'];

    function categoryService($http) {

        this.get_categories = function () {
            return $http.get('./hbr-selfie/dist/php/category.php', {
                params: {
                    action: 'getAll'
                }
            });
        };
        this.add_category = function (category) {
            return $http.post('./hbr-selfie/dist/php/category.php', {
                category_name: category.name,
                method: "POST"
            });
        };
        this.edit_category = function (category) {
            return $http.put('./hbr-selfie/dist/php/category.php', {
                category_id: category.category_id,
                category_name: category.name,
                action: "edit"
            });
        };
        this.delete_category = function (category) {
            return $http.put('./hbr-selfie/dist/php/category.php', {
                category_id: category.category_id,
                action: "delete"
            });
        };
    }
}
module.exports = categoryService;