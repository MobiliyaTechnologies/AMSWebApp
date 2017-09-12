'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:dashboardCtrl
 * @description
 * # loginCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('dashboardCtrl', function ($scope, $state, $location, aadService, Restservice, $rootScope) {
        $scope.changeState = function (state) {
            if (state == 'alerts') {
                $scope.shownewtilte = false;
            }
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
        $scope.getUser = function () {
            Restservice.get('api/User', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get User Details ", response);
                    $scope.username = response.Name;
                }
                else {
                    console.log("[Error]:: Get User Details ", err);
                }
            });
        }
        $scope.getUser();
        $scope.$on('logoUploaded', function (evt, message) {
            var reader = new FileReader();
            reader.onload = function (e) {
                console.log("e", e);
                $('#logourl').attr('src', e.target.result);
            }
            reader.readAsDataURL(message);
        });
        $scope.shownewtilte = false;
        $scope.$on('newalert', function (evt, message) {
            $scope.shownewtilte = true;
            $scope.$apply();
        });
    });
