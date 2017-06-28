'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:dashboardCtrl
 * @description
 * # loginCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('dashboardCtrl', function ($scope, $state, $location, aadService, Restservice ) {
        $scope.changeState = function (state) {
            $state.go(state);
        }
        $scope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };
        $scope.logoutb2c = function () {
            aadService.logout();
        } 
        $scope.geturl = function () {
            Restservice.get('api/ApplicationLogoUrl', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get ApplicationLogoUrl ", response);
                    $scope.logourl = response;
                }
                else {
                    console.log("[Error]:: Get ApplicationLogoUrl ", err);
                }
            });
        }
        $scope.geturl();
    });
