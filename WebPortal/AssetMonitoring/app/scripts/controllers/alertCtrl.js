'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:alertCtrl
 * @description
 * # alertCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('alertCtrl', function (Restservice, $scope, DTOptionsBuilder, DTColumnBuilder, config, applicationInsightsService) {
        $scope.alerts_loading_label = false;
        var myEl = angular.element(document.querySelector('#alerts-datatable-loader'));
        myEl.css('display', 'block');
        $scope.getAlerts = function () {
            var object = {
                "GroupId": $scope.groupSelected.GroupId,
                "AssetBarcode": $scope.assetSelected,
                "RuleId": $scope.capabilitySelected
            }
            Restservice.post('api/PaginateAlert',object, function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Alert list response ", response);
                    $scope.alertList = response.data.Result;
                    myEl.css('display', 'none');
                    if ($scope.alertList.length == 0) {
                        $scope.alerts_loading_label = true;
                    }
                }
                else {
                    console.log("[Error]:: Get Alert list response ", err);
                }
            });
        }
       
        $scope.groupSelected = '';
        Restservice.get('api/GroupAlertFilter', function (err, response) {
            if (!err) {
                console.log("[Info]:: Get GroupAlertFilter ", response);
                $scope.groupList = response;
                $scope.groupSelected = $scope.groupList[0];
                $scope.assetList = $scope.groupSelected.AssetBarcodes;
                $scope.capabilitiesList = $scope.groupSelected.GroupRules;
                $scope.getAlerts();
            }
            else {
                console.log("[Error]:: Get GroupAlertFilter", err);
            }
        });    


        $scope.groupChangeEvent = function () {
            $scope.assetList = $scope.groupSelected.AssetBarcodes;
            $scope.capabilitiesList = $scope.groupSelected.GroupRules;
        }
    });
