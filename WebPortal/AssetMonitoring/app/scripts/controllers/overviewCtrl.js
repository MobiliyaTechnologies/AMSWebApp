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

        $scope.GetAllGroupStartEndLocation = function () {
            Restservice.get('api/GetAllGroupStartEndLocation', function (err, response) {
                if (!err) {
                    console.log("[Info]::  GetAllGroupStartEndLocation ", response);
                    $scope.groupList = response;
                    //$scope.groupList = [];
                    //$scope.groupList.push({
                    //    'GroupName':'group1',
                    //    'Gps': [
                    //        { 'Latitude': 18.556696, 'Longitude': 73.793173 },
                    //        { 'Latitude': 18.58155, 'Longitude': 73.919875 }
                    //    ]
                    //});
                    //$scope.groupList.push({
                    //    'GroupName': 'group2',
                    //    'Gps': [
                    //        { 'Latitude': 18.556696, 'Longitude': 73.793173 },
                    //        { 'Latitude': 18.58155, 'Longitude': 73.949875 }
                    //    ]
                    //});
                  

                    if ($scope.groupList.length>0) { 
                        $scope.selectedGroup = $scope.groupList[0];
                        $scope.address = response[0];
                        geocodeLatLng();
                       
                        intializevalues($scope.selectedGroup.Gps);
                    }
                }
                else {
                    console.log("[Error]:: GetAllGroupStartEndLocation ", err);
                    
                }
            });
        }
        $scope.GetAllGroupStartEndLocation();
        function markerAnimation() {
                     
            setInterval(function () {
                
                $scope.address.Gps[0].Latitude++;
                $scope.address.Gps[0].Longitude++;
                $scope.$apply();
            },2000);
        }


        var geocoder = new google.maps.Geocoder;

        function geocodeLatLng() {
            console.log($scope.selectedGroup.Gps[0].Timestamp);
            $scope.startd =new Date( $scope.selectedGroup.Gps[0].Timestamp);
            $scope.endd = new Date( $scope.selectedGroup.Gps[1].Timestamp);
            var latlng = { lat: parseFloat($scope.selectedGroup.Gps[0].Latitude), lng: parseFloat($scope.selectedGroup.Gps[0].Longitude) };
            geocoder.geocode({ 'location': latlng }, function (results, status) {
                if (status === 'OK') {
                    if (results[1]) {
                        console.log("result ::", results);
                        $scope.origin = results[0].formatted_address;
                        $scope.$apply();
                    } else {
                        
                    }
                } else {
                    
                }
            });
            var latlng1 = { lat: parseFloat($scope.selectedGroup.Gps[1].Latitude), lng: parseFloat($scope.selectedGroup.Gps[1].Longitude) };
            console.log($scope.selectedGroup);
            geocoder.geocode({ 'location': latlng1 }, function (results, status) {
                if (status === 'OK') {
                    if (results[1]) {
                        console.log("result ::", results);
                        $scope.destination = results[0].formatted_address;
                        $scope.$apply();
                    } else {

                    }
                } else {

                }
            });
        }

        initialize();

        $scope.groupChange = function () {
            console.log("Here");
            clearmarker();
            setTimeout(function () { geocodeLatLng();intializevalues($scope.selectedGroup.Gps) },2000);
        }
    });