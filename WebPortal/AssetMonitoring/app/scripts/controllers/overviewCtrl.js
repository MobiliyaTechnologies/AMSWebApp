'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:overviewCtrl
 * @description
 * # overviewCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('overviewCtrl', function ($scope, Restservice) {
        $scope.gatewayCount = 0;
        $scope.getonboardsensorcount = 0;
        $scope.damageassetcount = 0;
        $scope.onlinegatewaycount = 0;
        $scope.getAllGateway = function () {
            Restservice.get('api/Gateway', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Gateway list response ", response);
                    $scope.gatewayList = response;
                    $scope.gatewayCount = $scope.gatewayList.length;
                }
                else {
                    console.log("[Error]:: Get Gateway list response ", err);
                }
            });
        }
        $scope.getAllGateway();

        $scope.getAllAsset = function () {
            Restservice.get('api/Asset', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Asset list response ", response);
                    $scope.assetList = response;
                    $scope.getonboardsensorcount = $scope.assetList.length;
                }
                else {
                    console.log("[Error]:: Get Asset list response ", err);
                }
            });
        }
        $scope.getAllAsset();

        $scope.getDamageAsset = function () {
            Restservice.get('api/DamageAsset', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Damage Asset list response ", response);
                    $scope.damageassetList = response;
                    $scope.damageassetcount = $scope.damageassetList.length;
                }
                else {
                    console.log("[Error]:: Get Damage Asset list response ", err);
                }
            });
        }
        $scope.getDamageAsset();

        $scope.getOnlineGateway = function () {
            Restservice.get('api/OnlineGateway', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get OnlineGateway ", response);
                    $scope.onlineGatewayList = response;
                    $scope.onlinegatewaycount = $scope.onlineGatewayList.length;
                }
                else {
                    console.log("[Error]:: GetOnlineGateway ", err);
                }
            });
        }
        $scope.getOnlineGateway();

    });