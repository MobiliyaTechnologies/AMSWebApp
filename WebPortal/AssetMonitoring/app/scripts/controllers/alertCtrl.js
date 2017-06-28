'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:alertCtrl
 * @description
 * # alertCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('alertCtrl', function (Restservice, $scope) {
        Restservice.get('api/Alert', function (err, response) {
            if (!err) {
                console.log("[Info]:: Get Alert list response ", response);
                $scope.alertList = response;
            }
            else {
                console.log("[Error]:: Get Alert list response ", err);
            }
        });
    });
