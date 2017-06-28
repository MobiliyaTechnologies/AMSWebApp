'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('configurationCtrl', function ($http, Alertify, config, $scope, $state, Token, $location) {
        $scope.powerbiUrls = {
            'data': {}
        }
        $scope.application={
            'logo':''
        }
        $scope.addApplicationLogo = function () {
            console.log("Here");
            var authResponse = hello('adB2CSignIn').getAuthResponse();

            $scope.application.logo = document.getElementById('application_logo').files[0];
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
                        Alertify.success("Error in uploading logo ");
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
                Token.update(function () { });
            }).catch(function (data) {
                console.log('[Error] ::', data);
            });
        }
        
        $scope.updatePowerBiUrls = function () {
            var sampleConfig = [];
            for (var key in $scope.powerbiUrls.data) {
                var obj = { "Capability": key, "Url": $scope.powerbiUrls.data[key] };
                sampleConfig.push(obj);
            }
            $http.post($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/PowerBIService.asmx/SavePowerBIUrl', { data: JSON.stringify(sampleConfig) }).then(function (data) {
                console.log("[Info] :: Urls Updated", data);
            }).catch(function (data) {
                console.log('[Error] ::', data);
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
    });