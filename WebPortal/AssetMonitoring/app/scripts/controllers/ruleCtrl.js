﻿'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:ruleCtrl
 * @description
 * # ruleCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('ruleCtrl', function ($scope, Restservice, $modal, $state, Alertify) {
        $scope.getAllRule = function () {
            Restservice.get('api/SensorRule', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Rule list response ", response);
                    $scope.ruleList = response;
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
                            Alertify.error("Error in Deleting Rule");
                        }
                    });
                },
                function onCancel() {

                }
            );
        }


    });