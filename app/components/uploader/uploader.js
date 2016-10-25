function uploaderDirective(angular, app) {
	'use strict';
	app.directive('uploaderModel', uploaderDirective);
	uploaderDirective.$inject = ['$parse'];
	function uploaderDirective($parse){
		return {
			restrict: 'A',
			link: function (scope, iElement, iAttrs) {
				iElement.on("change", function (e) {
					$parse(iAttrs.uploaderModel).assign(scope, iElement[0].files[0]);
				});
			}
		};
	}
}

module.exports = uploaderDirective;