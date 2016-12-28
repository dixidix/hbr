function registerController(angular, app) {
	'use strict';

	'use angular template'; //jshint ignore:line

	app.controller('registerCtrl', registerCtrl);

	registerCtrl.$inject = ['$http', '$state', 'authenticationService', '$rootScope'];

	function registerCtrl($http, $state, authenticationService, $rootScope) {
		var self = this; //jshint ignore:line
		function register() {
			if(self.client_type == 0){
				registerUser();             
			}
			if(self.client_type == 1){
				registerCompany();
			}
		}

		function registerUser(){
            $rootScope.showSpinner = true;
			authenticationService.register(self.user)
			.then(function (response) {
				if(!response.data.errors){
					self.success = true;
                    $rootScope.showSpinner = false;
				} else {
					if(response.data.errors.existingEmail){
						self.existingEmail = response.data.errors.existingEmail;
						self.registerForm.email.$invalid = true;
						self.registerForm.$invalid = true;
					} else {
						self.existingEmail = false;
						self.registerForm.email.$invalid = false;
						self.registerForm.email.$valid = true;
					}
					if(response.data.errors.passwordError){
						self.passwordError = response.data.errors.passwordError;
						self.registerForm.password.$invalid = true;
						self.registerForm.password2.$invalid = true;
						self.registerForm.$invalid = true;
					} else {
						self.passwordError  = false;
						self.registerForm.password.$invalid = false;
						self.registerForm.password.$valid = true;
						self.registerForm.password2.$invalid = false;
						self.registerForm.password2.$valid = true;
					}
					if(response.data.errors.telError){
						self.telError = response.data.errors.telError;
						self.registerForm.tel.$invalid = true;
						self.registerForm.cel.$invalid = true;
						self.registerForm.$invalid = true;

					} else {
						self.telError = false;
						self.registerForm.tel.$invalid = false;
						self.registerForm.tel.$valid = true;
						self.registerForm.cel.$invalid = false;
						self.registerForm.cel.$valid = true;
					}
				}
			});
		}
		function registerCompany(){
            $rootScope.showSpinner = true;
			authenticationService.registerCompany(self.company)
			.then(function (response) {
				if(!response.data.errors){
					self.success = true;
                    $rootScope.showSpinner = false;
				} else {
					if(response.data.errors.existingEmail){
						self.existingEmail = response.data.errors.existingEmail;
						self.registerForm.email.$invalid = true;
						self.registerForm.$invalid = true;
					} else {
						self.existingEmail = false;
						self.registerForm.email.$invalid = false;
						self.registerForm.email.$valid = true;
					}
					if(response.data.errors.passwordError){
						self.passwordError = response.data.errors.passwordError;
						self.registerForm.password.$invalid = true;
						self.registerForm.password2.$invalid = true;
						self.registerForm.$invalid = true;
					} else {
						self.passwordError  = false;
						self.registerForm.password.$invalid = false;
						self.registerForm.password.$valid = true;
						self.registerForm.password2.$invalid = false;
						self.registerForm.password2.$valid = true;
					}
					if(response.data.errors.telError){
						self.telError = response.data.errors.telError;
						self.registerForm.tel.$invalid = true;
						self.registerForm.cel.$invalid = true;
						self.registerForm.$invalid = true;

					} else {
						self.telError = false;
						self.registerForm.tel.$invalid = false;
						self.registerForm.tel.$valid = true;
						self.registerForm.cel.$invalid = false;
						self.registerForm.cel.$valid = true;
					}
				}
			});
		}
		function init() {
			self.user = {};
			self.company = {};
			self.register = register;
			self.success = false;
			self.client_type = 0;
			var optionsAddress = { componentRestrictions: {country: 'ar' }};
			var address = document.getElementById('address');
			var autocomplete_address = new google.maps.places.Autocomplete(address, optionsAddress);


			var optionsLocalidad = { types: ['(cities)'], componentRestrictions: {country: 'ar'} };
			var localidad = document.getElementById('localidad');
			var autocomplete_localidad = new google.maps.places.Autocomplete(localidad, optionsLocalidad);
		}
		init();
	}
}
module.exports = registerController;