'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:ruleCtrl
 * @description
 * # ruleCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('ruleCtrl', function ($scope, Restservice, $modal, $state, Alertify) {
        $scope.rules_loading_label = false;
        var myEl = angular.element(document.querySelector('#rules-datatable-loader'));
        myEl.css('display', 'block');
        $scope.getAllRule = function () {
            Restservice.get('api/SensorRule', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Rule list response ", response);
                    $scope.ruleList = response;
                    myEl.css('display', 'none');
                    if ($scope.ruleList.length == 0) {
                        $scope.rules_loading_label = true;
                    }
                    $scope.rulesCount = $scope.ruleList.length;
                }
                else {
                    console.log("[Error]:: Get Rule list response ", err);
                }
            });
        }
        $scope.getAllRule();

        $scope.addRule = function () {
            $state.go('addrule');
        }
        $scope.deleteRule = function (rule) {
            


            Alertify.confirm('Are you sure to delete this rule ?').then(
                function onOk() {
                    Restservice.delete('api/SensorRule/' + rule.Id, function (err, response) {
                        if (!err) {
                            console.log("[Info]:: Delete Rule  response ", response);
                            //$scope.getAllSensor();
                            $scope.getAllRule();
                            Alertify.success("Rule Deleted Succesfully");
                        }
                        else {
                            console.log("[Error]:: Delete Rule response ", err);
                            if (err.status == 400) {
                                Alertify.error(err.data.Message);
                            }
                            else {
                                Alertify.error("Error in Deleting Rule");
                            }
                         }
                    });
                },
                function onCancel() {

                }
            );
        }


    });