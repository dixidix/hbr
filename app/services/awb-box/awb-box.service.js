function awbboxService(agular, app) {
    app.service('awbboxService', awbboxService);
    awbboxService.$inject = ['$http', 'authenticationService'];

    function awbboxService($http, authenticationService) {

        this._getLang = function() {
            var isAdmin = parseInt(sessionStorage.getItem('isAdmin'));
            return $http.get('./hbr-selfie/dist/routes/wh-box/awb-box/i18n.json').then(function(res) {
                if (isAdmin == 1) {
                    return res.data.en;
                } else {
                    return res.data.es;
                }
            })
        }

        this._getAllAwbBoxes = function() {
            var boxes = [{
                    id: 1,
                    tracking: "162767A42JD6335301",
                    provider: "DHL",
                    warehouse: {
                        id: 1,
                        warehouse_name: "MIAMI"
                    },
                    created: 1504376812000,
                    age: 21,
                    status: 0,
                    value: 1200.00,
                    weight: 120.50,
                    bills: [{
                            id: 1,
                            number: 99011900,
                            products: "t-shirts and shoes",
                            value: 200.50,
                            file: "http://tucourier.com.ar/hbr-selfie/wh-box/bills/1/21312312312312"
                        },
                        {
                            id: 2,
                            number: 888111811,
                            products: "books",
                            value: 500.50,
                            file: "http://tucourier.com.ar/hbr-selfie/wh-box/bills/1/hfa1231fsadad"
                        }
                    ]

                },
                {
                    id: 2,
                    tracking: "162767XXXXXX6335301",
                    provider: "FedEx",
                    warehouse: {
                        id: 2,
                        warehouse_name: "China"
                    },
                    created: 1504373812000,
                    age: 21,
                    status: 1,
                    value: 5730.00,
                    weight: 220.00,
                    bills: [{
                            id: 1,
                            number: 1245675321,
                            products: "Canillas choperas",
                            value: 12500.50,
                            file: "http://http://tucourier.com.ar/hbr-selfie/wh-box/bills/1/fgawq123saasdad242"
                        },
                        {
                            id: 2,
                            number: 5555223242111,
                            products: "Mesas",
                            value: 11500.50,
                            file: "http://http://tucourier.com.ar/hbr-selfie/wh-box/bills/1/yasdasdoiasdasd"
                        }
                    ]

                }
            ];
            return boxes;
        }

        this._getAwbBoxesByUserId = function() {

        }

        this._getAwbBoxesById = function(awbBoxId) {

        }

        this._addAwbBox = function(awbBox) {
            return authenticationService.checkAuth().then(function(response) {
                awbBox.uid = parseInt(response.data.uid);
                var whId = awbBox.whId ? awbBox.whId.id : awbBox.warehouse.id;
                return $http.post('./hbr-selfie/dist/php/awb-box/add_box.php', {
                    tracking: awbBox.tracking,
                    provider: awbBox.provider,
                    stock: awbBox.stock,
                    value: awbBox.box_value,
                    weight: awbBox.weight || "NULL",
                    whId: awbBox.whId.id,
                    uid: awbBox.uid,
                    created: Math.floor(new Date().getTime())
                });
            });
        }

        this._addBill = function(bill, boxId) {
            return authenticationService.checkAuth().then(function(response) {
                bill.uid = parseInt(response.data.uid);
                bill.boxId = boxId;
                bill.timestamp = Math.floor(new Date().getTime());
                var formData = new FormData();

                angular.forEach(bill, function(key, value) {
                    formData.append(value, key);
                });

                return $http.post('./hbr-selfie/dist/php/awb-box/add_box_bill.php', formData, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                });
            });
        }

        this._editAwbBox = function(awbBox) {

        }

        this._deleteAwbBox = function(awbBox) {

        }
    }
}

module.exports = awbboxService;