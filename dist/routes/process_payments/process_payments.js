function processPaymentsController(angular, app) {
	'use strict';

	'use angular template'; //jshint ignore:line

	app.controller('processPaymentsCtrl', processPaymentsCtrl);
	processPaymentsCtrl.$inject = ['$http', '$filter', '$state', '$scope', '$uibModal'];

	app.controller('modaProcessCtrl', modaProcessCtrl);
	modaProcessCtrl.$inject = ['$scope', '$state', '$filter', '$uibModalInstance', '$uibModal', '$sce', '$compile', '$rootScope', 'venta', 'bills', '$http'];

	app.controller('makeGuidesModalCtrl', makeGuidesModalCtrl);
	makeGuidesModalCtrl.$inject = ['$scope', '$state', '$filter', '$uibModalInstance', '$uibModal', '$sce', '$compile', '$rootScope', 'venta', 'bills', '$http', 'airwayService'];

	function processPaymentsCtrl($http, $filter, $state, $scope, $uibModal) {
		var self = this; //jshint ignore:line

		function processPaymentModal(size, venta, bills) {
			var modalInstance = $uibModal.open({
				templateUrl: 'processPayment.html',
				backdrop: 'static',
				keyboard: false,
				controller: 'modaProcessCtrl',
				controllerAs: 'modaProcess',
				size: size,
				resolve: {
					venta: function () {
						return venta;
					},
					bills: function () {
						return bills;
					},
				}
			});
		}


		function makeGuidesModal(size, venta, bills) {
			var modalInstance = $uibModal.open({
				templateUrl: 'makeGuides.html',
				backdrop: 'static',
				keyboard: false,
				controller: 'makeGuidesModalCtrl',
				controllerAs: 'guides',
				size: size,
				resolve: {
					venta: function () {
						return venta;
					},
					bills: function () {
						return bills;
					},
				}
			});
		}

		function processPayment(venta, bills) {
			processPaymentModal('md', venta, bills);
		}

		function setGuides(venta, bills) {
			makeGuidesModal('md', venta, bills);
		}

		function init() {
			$http.get('./hbr-selfie/dist/php/get_batch.php', { params: { action: "getAll" } })
				.then(function (response) {
					angular.forEach(response.data.ventas, function (value, key) {
						response.data.ventas[key].parcial_price = parseFloat(value.parcial_price).toFixed(2);
						response.data.ventas[key].total = parseFloat(value.total).toFixed(2);
						response.data.ventas[key].peso_total = parseFloat(value.peso_total).toFixed(2);
						response.data.ventas[key].totalWarehouse = "0";
						response.data.ventas[key].guide_amount = "2";
						response.data.ventas[key].totalFlete = "0";
						response.data.ventas[key].totalImpuestos = "0";
					});

					self.ventas = response.data.ventas;
					self.processPayment = processPayment;
					self.setGuides = setGuides;
				});
		}

		init();
	}

	function modaProcessCtrl($scope, $state, $filter, $uibModalInstance, $uibModal, $sce, $compile, $rootScope, venta, bills, $http) {
		var self = this;

		function cancel() {
			$uibModalInstance.dismiss('cancel');
		};

		function generateToken() {
			$http.post('./hbr-selfie/dist/php/encrypt.php', { timestamp: Math.round((new Date()).getTime() / 1000) })
				.then(function success(response) {
					self.successUrl = "http://tucourier.com.ar/hbr-selfie/dashboard/shopping/checkout/success/" + response.data;
					self.token = response.data;
				});
		}

		function send() {
			$http.put('./hbr-selfie/dist/php/shopping.php', {
				paymentGatewayUrl: self.paymentGatewayUrl,
				id: self.venta.id,
				token: self.token
			})
				.then(function success(response) {
					$http.post('./hbr-selfie/dist/php/cargar_venta.php', {
						lote: self.venta.id,
						name: self.user.name + " " + self.user.lastname,
						email: self.user.email
					}).then(function success(response) {
						$state.reload();
						$uibModalInstance.dismiss('cancel');
					});
				});

		};

		function processProduct(product) {
			console.log(product);
			self.currentProduct = {};
			self.currentProduct.id = product.id;
			self.currentProduct.category = product.category_name;
			self.currentProduct.product_name = product.product_name;
			self.currentProduct.price = parseFloat(product.price / product.quantity).toFixed(2);
			self.currentProduct.flete = parseFloat((Math.ceil((product.weight / product.quantity) * 2) / 2) * 2.80).toFixed(2);
			self.currentProduct.seguro = parseFloat(10).toFixed(2);
			self.currentProduct.derecho = parseFloat(0).toFixed(2);
			self.currentProduct.derecho_percent = parseFloat(0).toFixed(2);
			self.currentProduct.estadistica = parseFloat(0).toFixed(2);
			self.currentProduct.estadistica_percent = parseFloat(0.50).toFixed(2);
			self.currentProduct.base_iva = parseFloat(0).toFixed(2);
			self.currentProduct.documentacion = parseFloat(0).toFixed(2);
			self.currentProduct.iva_percent = parseFloat(21).toFixed(2);
			self.currentProduct.iva_adic_percent = parseFloat(0).toFixed(2);
			self.currentProduct.iva_adic = parseFloat(0).toFixed(2);
			self.currentProduct.total_iva = parseFloat(0).toFixed(2);
			calcProduct();
			self.showProductInfo = true;
		}

		function calcProduct() {
			self.currentProduct.price = parseFloat(self.currentProduct.price).toFixed(2);
			self.currentProduct.flete = parseFloat(self.currentProduct.flete).toFixed(2);
			self.currentProduct.seguro = parseFloat(self.currentProduct.seguro).toFixed(2);
			self.currentProduct.cif = parseFloat(self.currentProduct.cif).toFixed(2);

			self.currentProduct.cif = (parseFloat(self.currentProduct.price) + parseFloat(self.currentProduct.flete) + parseFloat(self.currentProduct.seguro)).toFixed(2);
			calcRights();
			calcBaseIva();
		}

		function calcRights() {
			self.currentProduct.derecho_percent = parseFloat(self.currentProduct.derecho_percent).toFixed(2);
			self.currentProduct.estadistica_percent = parseFloat(self.currentProduct.estadistica_percent).toFixed(2);
			if (self.currentProduct.derecho_percent > 0) {
				self.currentProduct.derecho = ((parseFloat(self.currentProduct.cif) * parseFloat(self.currentProduct.derecho_percent)) / 100).toFixed(2);
			}
			if (self.currentProduct.estadistica_percent > 0) {
				self.currentProduct.estadistica = ((parseFloat(self.currentProduct.cif) * parseFloat(self.currentProduct.estadistica_percent)) / 100).toFixed(2);
			}

			if (self.currentProduct.derecho && self.currentProduct.estadistica) {
				self.currentProduct.total_derechos = (parseFloat(self.currentProduct.derecho) + parseFloat(self.currentProduct.estadistica)).toFixed(2);
				calcBaseIva();
			}
		}

		function calcBaseIva() {
			self.currentProduct.base_iva = parseFloat(self.currentProduct.base_iva).toFixed(2);
			self.currentProduct.iva = parseFloat(self.currentProduct.iva).toFixed(2);
			self.currentProduct.iva_percent = parseFloat(self.currentProduct.iva_percent).toFixed(2);

			self.currentProduct.base_iva = (parseFloat(self.currentProduct.cif) + parseFloat(self.currentProduct.total_derechos) + parseFloat(self.currentProduct.documentacion)).toFixed(2);
			if (self.currentProduct.base_iva > 0 && self.currentProduct.iva_percent > 0) {
				self.currentProduct.iva = parseFloat((parseFloat(self.currentProduct.iva_percent) * parseFloat(self.currentProduct.base_iva)) / 100).toFixed(2);
			}

			if (self.currentProduct.base_iva > 0 && self.currentProduct.iva_adic_percent > 0) {
				self.currentProduct.iva_adic = parseFloat((parseFloat(self.currentProduct.iva_adic_percent) * parseFloat(self.currentProduct.base_iva)) / 100).toFixed(2);
			}

			self.currentProduct.total_iva = (parseFloat(self.currentProduct.iva) + parseFloat(self.currentProduct.iva_adic)).toFixed(2);
			self.currentProduct.total = (parseFloat(self.currentProduct.base_iva) + parseFloat(self.currentProduct.total_iva)).toFixed(2);
			angular.forEach(self.products, function (key, value) {
				if (key.id == self.currentProduct.id) {
					self.products[value].total_taxes = self.currentProduct.total;
				}
			});
		}

		function calcWarehouse() {
			self.totalWarehouse = (parseFloat(self.batch.wh_entry) + parseFloat(self.batch.adic_kg) + parseFloat(self.batch.adic_charges)).toFixed(2);
			calcButton(self.totalWarehouse, self.totalFlete);
		}

		function calcFlete() {
			self.totalFlete = (parseFloat(self.batch.flete_internacional) * parseFloat(self.venta.peso_total)).toFixed(2);
			calcButton(self.totalWarehouse, self.totalFlete);
		}

		function calcButton(warehouse, flete) {
			self.totalButton = (parseFloat(warehouse) + parseFloat(flete)).toFixed(2);
		}

		function calcTaxes() {
			angular.forEach(self.products, function (product) {
				processProduct(product);
			});
			self.showProductInfo = false;
			angular.forEach(self.products, function (value) { self.totalBatchTaxes = (parseFloat(value.total_taxes) + parseFloat(self.totalBatchTaxes)).toFixed(2); });
		}


		function init() {
			self.venta = venta;
			self.bills = bills;
			self.batch = {};
			self.venta.peso_total = parseFloat(self.venta.peso_total).toFixed(2);
			self.venta.parcial_price = parseFloat(self.venta.parcial_price).toFixed(2);
			$http.get('./hbr-selfie/dist/php/users.php', { params: { action: "getUserById", id: self.venta.uid } })
				.then(function (response) {
					self.user = response.data;
				});
			self.totalTax = [];
			self.cancel = cancel;
			self.collapsedWarehouse = true;
			self.collapsedFlete = true;
			self.send = send;
			self.totalBatchTaxes = parseFloat(0).toFixed(2);
			self.showProductInfo = false;
			self.generateToken = generateToken;
			self.processProduct = processProduct;
			self.calcProduct = calcProduct;
			self.calcRights = calcRights;
			self.calcBaseIva = calcBaseIva;
			self.totalWarehouse = parseFloat(0).toFixed(2);
			self.totalFlete = parseFloat(0).toFixed(2);
			self.totalButton = parseFloat(0).toFixed(2);
			self.batch.wh_entry = parseFloat(0).toFixed(2);
			self.batch.adic_kg = parseFloat(0).toFixed(2);
			self.batch.adic_charges = parseFloat(0).toFixed(2);
			self.batch.guide_amount = parseInt(0);
			self.batch.flete_internacional = parseFloat(0).toFixed(2);
			self.calcWarehouse = calcWarehouse;
			self.calcFlete = calcFlete;
			self.calcButton = calcButton;
			calcTaxes();
		}

		init();
	}

	function makeGuidesModalCtrl($scope, $state, $filter, $uibModalInstance, $uibModal, $sce, $compile, $rootScope, venta, bills, $http, airwayService) {
		var self = this;

		function cancel() {
			$uibModalInstance.dismiss('cancel');
		};

		function selectBill(bill) {

			angular.forEach(self.bills, function (bill) {
				bill.isOpen = false;
			});

			bill.isOpen = true;
			self.selectedBill = bill;

		}
		function new_guide() {
			self.guideNumber++;
			self.guideBatch.push({ number: self.guideNumber, products: [], quantity: '', weight: '', price: '' });
		}

		function addToGuide(product, bill, guideNumber, amount) {
			self.venta.remaining_quantity = parseInt(parseInt(self.venta.remaining_quantity) - parseInt(amount));
			angular.forEach(self.guideBatch, function (guide) {
				angular.forEach(bill.products, function (value) {
					if (value.product_id == product.product_id) {
						if (value.quantity > 0) {
							if (guide.number === guideNumber) {
								var tmp_prod = angular.copy(value);

								//check if product is already on the list								
								tmp_prod.exist = $filter('filter')(guide.products, { product_id: tmp_prod.product_id })[0] !== undefined ? true : false;

								if (!tmp_prod.exist) {
									tmp_prod.quantity = parseInt(amount);
									guide.products.push(tmp_prod);
									value.quantity = parseInt(value.quantity) - parseInt(amount);
								} else {
									var filteredProduct = $filter('filter')(guide.products, { product_id: tmp_prod.product_id })[0];
									filteredProduct.quantity = parseInt(parseInt(filteredProduct.quantity) + parseInt(amount));
									value.quantity = parseInt(value.quantity) - parseInt(amount);
								}
								guide.quantity = parseInt(guide.quantity || 0) + parseInt(amount || 0);
								guide.weight = parseFloat(parseFloat(guide.weight || 0) + parseFloat(parseFloat(product.real_weight || product.weight || 0) * amount)).toFixed(2);
								guide.price = parseFloat(parseFloat(guide.price || 0) + parseFloat(parseFloat(product.price || 0) * amount)).toFixed(2);

								if (guide.weight > 40 || guide.price > 900) {
									$('#guide_list_' + guideNumber).addClass('row-warning');
									self.danger_msg = "";
									if (guide.weight > 50 || guide.weight == 50 || guide.price > 1000 || guide.price == 1000) {
										$('#guide_list_' + guideNumber).removeClass('row-warning');
										$('#guide_list_' + guideNumber).addClass('row-danger');
										self.danger_msg = "Has Excedido el limite de 50 Kg o U$D 1,000.00";
									}
								} else {
									self.danger_msg = "";
									$('#guide_list_' + guideNumber).removeClass('row-warning');
									$('#guide_list_' + guideNumber).removeClass('row-danger');
								}
							}
						}
					}
				});
			});
			if (bill.products.length == 0) {
				self.hideTable = true;
			} else {
				self.hideTable = false;
			}
			self.selectedGuide = null;
			self.selectedQuantity = null;
		}

		function removeProduct(product, guide) {
			angular.forEach(self.bills, function (bill) {
				angular.forEach(bill.products, function (value) {
					if (value.product_id == product.product_id) {
						value.quantity = parseInt(parseInt(value.quantity) + parseInt(product.quantity));
					}
				});
			});
			angular.forEach(guide.products, function (value, index) {
				if (value.product_id == product.product_id) {
					guide.products.splice(index, 1);
					guide.quantity = parseInt(guide.quantity) - parseInt(product.quantity);
					guide.weight = parseFloat(parseFloat(guide.weight) - (parseFloat(product.real_weight) * product.quantity)).toFixed(2);
					guide.price = parseFloat(parseFloat(guide.price) - (parseFloat(product.price) * product.quantity)).toFixed(2);
				}
			});
			if (guide.weight > 40 || guide.price > 900) {
				$('#guide_list_' + guideNumber).addClass('row-warning');
				self.danger_msg = "";
				if (guide.weight > 50 || guide.weight == 50 || guide.price > 1000 || guide.price == 1000) {
					$('#guide_list_' + guideNumber).removeClass('row-warning');
					$('#guide_list_' + guideNumber).addClass('row-danger');
					self.danger_msg = "Has Excedido el limite de 50 Kg o U$D 1,000.00";
				}
			} else {
				self.danger_msg = "";
				$('#guide_list_' + guideNumber).removeClass('row-warning');
				$('#guide_list_' + guideNumber).removeClass('row-danger');
			}

		}

		function setRealWeight(product, index) {
			self.activeEditing = !self.activeEditing;
			$scope.realWeight = angular.copy(product.real_weight || product.weight || 0);
			$scope.RealWeightProduct = product;
		}

		function saveRealWeight(weight) {
			self.activeEditing = false;
			angular.forEach(self.bills, function (bill) {
				var product = $filter('filter')(bill.products, { product_id: $scope.RealWeightProduct.product_id })[0];
				if (product !== undefined) {
					product.real_weight = weight;
				}
			});
		}


		function save() {
			if (self.venta.remaining_quantity === 0) {
				self.guideBatch.finished = true;
			}

			angular.forEach(self.guideBatch, function (awb) {
				airwayService.save(awb)
					.success(function (response) {
						console.log(response, "added awb");
						airwayService.addProductToAwb(awb.products, response.airwayId)
							.success(function (response) {
								console.log("added Product");
								console.log(response);
							})
							.error(function (err) {
								console.log(err);
							});
					})
					.error(function (err) {
						console.log(err);
					});
			});
		}

		function init() {
			self.cancel = cancel;
			self.venta = venta;
			self.guideNumber = 0;
			self.bills = bills;
			angular.forEach(self.bills, function (bill) {
				bill.isOpen = false;
				angular.forEach(bill.products, function (product) {
					product.real_weight = angular.copy(product.weight);
				});
			});

			self.new_guide = new_guide;
			self.addToGuide = addToGuide;
			self.removeProduct = removeProduct;
			self.guideBatch = [];
			self.hideTable = false;
			self.activeEditing = false;
			self.selectedBill = {};
			self.selectBill = selectBill;
			self.setRealWeight = setRealWeight;
			self.saveRealWeight = saveRealWeight;
			self.save = save;
			self.venta.remaining_quantity = angular.copy(self.venta.total_quantity);
		}

		init();
	}
}
module.exports = processPaymentsController;