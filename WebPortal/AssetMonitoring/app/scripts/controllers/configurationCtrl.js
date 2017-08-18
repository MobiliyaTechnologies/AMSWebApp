'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('configurationCtrl', function ($http, Alertify, config, $scope, $state, Token, $location, Restservice, $filter, $rootScope) {
        $scope.powerbiUrls = {
            'data': []
        }
        $scope.application = {
            'logo': ''
        }
        $scope.layout_uploaded = false;
        $scope.getAllCapabilities = function () {
            Restservice.get('api/Capability', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Capability list response ", response);
                    $scope.capabilityList = response;
                }
                else {
                    console.log("[Error]:: Get Capability list response ", err);
                }
            });
        }
        $scope.getAllCapabilities();
        $scope.addApplicationLogo = function () {
            var authResponse = hello('adB2CSignIn').getAuthResponse();

            $scope.application.logo = document.getElementById('application_logo').files[0];
            $rootScope.$broadcast('logoUploaded', $scope.application.logo);
            if (authResponse != null && $scope.application.logo) {

                $http({
                    method: 'POST',
                    url: config.restServer + 'api/ApplicationLogo',
                    headers: {
                        'Content-Type': undefined,
                        "Authorization": authResponse.token_type + ' ' + authResponse.access_token
                    },
                    data: $scope.application,
                    transformRequest: function (data, headersGetter) {
                        var formData = new FormData();
                        angular.forEach(data, function (value, key) {
                            formData.append(key, value);
                        });

                        var headers = headersGetter();
                        delete headers['Content-Type'];

                        return formData;
                    }
                })
                    .then(function (response) {
                        console.log("[Info] :: Add Application Logo ", response);
                        Alertify.success("Logo Added ");
                    })
                    .catch(function (error) {
                        console.log("[Error] :: Add Application Logo ", error);
                        Alertify.error("Error in uploading logo ");
                    });
            }
            else {
                if (authResponse == null) {
                    $state.go('login');
                }
                console.log("[Error]")
            }


        }


        $scope.updatePowerBiCredentials = function () {
            $http.post($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/PowerBIService.asmx/updatePowerBiCredentials', $scope.powerbi).then(function (data) {
                console.log("[Info] :: Credentials Updated", data);
                Alertify.success("Credentials Updated ");
                Token.update(function () { });
            }).catch(function (data) {
                console.log('[Error] :: Credentials Updated', data);
                Alertify.error("Credentials Not Updated ");
            });
        }

        $scope.updatePowerBiUrls = function () {
            var sampleConfig = [];
            for (var key in $scope.powerbiUrls.data) {
                var obj = { "Capability": key, "Url": $scope.powerbiUrls.data[key] };
                sampleConfig.push(obj);
            }
            $http.post($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/PowerBIService.asmx/SavePowerBIUrl', { data: JSON.stringify(sampleConfig) }).then(function (data) {
                Alertify.success("Urls Updated ");
                console.log("[Info] :: Urls Updated", data);

            }).catch(function (data) {
                console.log('[Error] ::', data);
                Alertify.error("Urls Not Updated ");

            });
        }
        function getPowerBiUrls() {
            $http.get('powerBI.json')
                .then(function (data, status, headers) {
                    $scope.powerBiURl = data.data;
                    $scope.powerBiURl.forEach(function (obj) {
                        $scope.powerbiUrls.data[obj.Capability] = obj.Url;
                    });
                })
                .catch(function (data, status, headers) {
                    console.log("[Error]  :: Get Power Bi Urls ", data);
                });
        }

        getPowerBiUrls();




        $scope.addIndoorLayout = function () {
            var authResponse = hello('adB2CSignIn').getAuthResponse();

            $scope.application.logo = document.getElementById('indoor_map').files[0];
            if (authResponse != null && $scope.application.logo) {

                $http({
                    method: 'POST',
                    url: config.restServer + 'api/IndoorLayout',
                    headers: {
                        'Content-Type': undefined,
                        "Authorization": authResponse.token_type + ' ' + authResponse.access_token
                    },
                    data: $scope.application,
                    transformRequest: function (data, headersGetter) {
                        var formData = new FormData();
                        angular.forEach(data, function (value, key) {
                            formData.append(key, value);
                        });

                        var headers = headersGetter();
                        delete headers['Content-Type'];

                        return formData;
                    }
                })
                    .then(function (response) {
                        console.log("[Info] :: Add Application Logo ", response);
                        Alertify.success("Indoor Map Added ");
                        $scope.layout_uploaded = true;
                        $scope.getAllLayout();
                    })
                    .catch(function (error) {
                        console.log("[Error] :: Add Application Logo ", error);
                        Alertify.error("Error in adding Indoor map ");
                    });
            }
            else {
                if (authResponse == null) {
                    $state.go('login');
                }
                console.log("[Error]")
            }


        }




        $scope.getAllLayout = function () {
            Restservice.get('api/IndoorLayout', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get layout list response ", response);
                    $scope.layoutList = response;
                    if ($scope.layoutList.length > 0) {
                        $scope.layout_uploaded = true;
                        $scope.layout = $scope.layoutList[0];
                        //$scope.background_image = $scope.layoutList[0].FileUrl;
                    }

                }
                else {
                    console.log("[Error]:: Get layout list response ", err);
                }
            });
        }
        $scope.getAllLayout();

        $scope.getAllGateway = function () {

            Restservice.get('api/Gateway', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Gateway list response ", response);
                    $scope.gatewayList = response;
                }
                else {
                    console.log("[Error]:: Get Gateway list response ", err);
                }
            });
        }
        $scope.getAllGateway();
        $scope.dropped = function () {

        }
        $scope.gateway = {
            'selected': ''
        }
        $scope.gatewayChange = function () {
            var object_by_id = $filter('filter')($scope.layout.Gateways, { Id: $scope.gateway.selected.Id })[0];
            console.log(object_by_id);
            if (object_by_id) {
                setTimeout(function () {
                    var layoutWidth = angular.element(document.getElementById('layout'))[0].clientWidth;
                    var layoutHeight = angular.element(document.getElementById('layout'))[0].clientHeight;
                    console.log("layoutWidth ::", layoutWidth);
                    console.log("layoutHeight ::", layoutHeight);
                    console.log("object_by_id.LayoutX ::", object_by_id.LayoutX);
                    console.log("object_by_id.LayoutY ::", object_by_id.LayoutY);
                    console.log((object_by_id.LayoutX * (layoutHeight / 100)) + 'px');
                    console.log((object_by_id.LayoutY * (layoutWidth / 100)) + 'px');
                    document.getElementById('gateway').style.left = (object_by_id.LayoutX * (layoutWidth / 100)) + 'px';
                    document.getElementById('gateway').style.top = (object_by_id.LayoutY * (layoutHeight / 100)) + 'px';
                },200);
               
            }

        }
        $scope.updateCordinates = function () {

            var layoutWidth = angular.element(document.getElementById('layout'))[0].clientWidth;
            var layoutHeight = angular.element(document.getElementById('layout'))[0].clientHeight;
            var gatewayLeft = parseInt(angular.element(document.getElementById('gateway'))[0].style.left, 10);
            var gatewayTop = parseInt(angular.element(document.getElementById('gateway'))[0].style.top, 10);
            var LayoutX = (gatewayLeft / layoutWidth) * 100;
            var LayoutY = (gatewayTop / layoutHeight) * 100;
            console.log("layoutWidth ::", layoutWidth);
            console.log("layoutHeight ::", layoutHeight);
            console.log("gatewayLeft ::", gatewayLeft);
            console.log("gatewayTop ::", gatewayTop);
            console.log("left%", (gatewayLeft / layoutWidth) * 100);
            console.log("top%", (gatewayTop / layoutHeight) * 100);
            var layoutobj = {
                'Id': $scope.layout.Id,
                'Gateways':[]
            }
            $scope.gateway.selected.LayoutX = LayoutX;
            $scope.gateway.selected.LayoutY = LayoutY;
            layoutobj.Gateways.push($scope.gateway.selected);
            Restservice.put('api/IndoorLayout', layoutobj, function (err, response) {
                if (!err) {
                    Alertify.success("Gateway Mapped successfully");
                    console.log("[Info]:: Gateway Mapped response ", response);
                }
                else {
                    console.log("[Error]:: Map Gateway response ", err);
                    Alertify.error("Error in mapping gateway");
                }
            });
        }
    });