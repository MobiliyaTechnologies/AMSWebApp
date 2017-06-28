'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:addRuleCtrl
 * @description
 * # addRuleCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('addRuleCtrl', function ($scope, Restservice, $state, Alertify) {
        $scope.Temperature = true;
        $scope.check = {};
        
        $scope.getAllSensor = function () {
            Restservice.get('api/SensorGroup', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Sensor Group response ", response);
                    $scope.sensorGroupList = response;
                }
                else {
                    console.log("[Error]:: Get Sensor Group response ", err);
                }
            });
        }
        $scope.getAllSensor();
       
        $("#amount").val("$" + $("#slider-range").slider("values", 0) +
            " - $" + $("#slider-range").slider("values", 1));

        $scope.groupChange = function () {
            console.log($scope.groupSelected);
            $scope.getGroupCapablities($scope.groupSelected);
        }
        $scope.getGroupCapablities = function (groupId) {
            Restservice.get('api/SensorGroup/' + groupId, function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Group Capability response ", response);
                    for (var i = 0; i < response.CapabilityNames.length; i++) {
                        $("#" + response.CapabilityNames[i]).removeClass("disabledbutton");
                    }
                }
                else {
                    console.log("[Error]:: Get Group Capability  response ", err);
                }
            }); 
        }
        $scope.getAllCapabilities = function () {
            Restservice.get('api/Capability', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Capability list response ", response);
                    $scope.capabilityList = response;
                    setTimeout(function () { $scope.createSlider(); }, 3000);
                }
                else {
                    console.log("[Error]:: Get Capability list response ", err);
                }
            }); 
        }
        $scope.getAllCapabilities();
        $scope.createSlider=function() {
            for (var i = 0; i < $scope.capabilityList.length; i++) {
                for (var j = 0; j < $scope.capabilityList[i].Filters.length; j++){
                    console.log("$scope.capabilityList[i].Filters[j].Name",$scope.capabilityList[i].Filters[j].Name);
                    $("#" + $scope.capabilityList[i].Filters[j].Name+"-slider-range").slider({
                    orientation: "vertical",
                    range: true,
                    max: 400,
                    values: [0, 67],
                    slide: function (event, ui) {

                        var name=event.target.id.substring(0, event.target.id.indexOf("-"));
                        $("#" + name+"value").val(" " + ui.values[0] + " - " + ui.values[1]);
                    }
                });
                }
            }
        }
        var reqobj = [];
        $scope.createRule = function () {
            //reqobj = [];
            //for (var i = 0; i < $scope.capabilityList.length; i++) {
            //    for (var j = 0; j < $scope.capabilityList[i].Filters.length; j++){
            //        var val = $("#" + $scope.capabilityList[i].Filters[j].Name + "-slider-range").slider("option", "values");
            //        console.log("$scope.capabilityList[i].Name", $scope.capabilityList[i].Name);
            //        console.log("val", val);
            //        if (val[0] != 0 || val[1] != 67) {
                        
            //            var obj = {
            //                'MinThreshold': val[0],
            //                'MaxThreshold': val[1],
            //                'Operator': 'range',
            //                'CapabilityFilterId': $scope.capabilityList[i].Filters[j].Id
            //            }
            //            console.log("obj", obj);
            //            reqobj.push(obj);
            //        }

            //    }
                
            //}

            //createRuleApiCall(reqobj);
            recursiveCreateRule(0, 0);

        }
        function recursiveCreateRule(i, j) {

            if ($scope.capabilityList&&i < $scope.capabilityList.length) {
                if (j < $scope.capabilityList[i].Filters.length) {
                    var val = $("#" + $scope.capabilityList[i].Filters[j].Name + "-slider-range").slider("option", "values");
                    if (val[0] != 0 || val[1] != 67) {

                        var obj = {
                            'MinThreshold': val[0],
                            'MaxThreshold': val[1],
                            'Operator': 'range',
                            'CapabilityFilterId': $scope.capabilityList[i].Filters[j].Id
                        }
                        console.log("obj", obj);
                        reqobj.push(obj);
                        recursiveCreateRule(i, j + 1);
                    }
                    else {
                        recursiveCreateRule(i, j + 1);
                    }
                }
                else{
                        recursiveCreateRule(i+1, 0);
                }

            }
            else {
                    createRuleApiCall(reqobj);
            }

        }
        function createRuleApiCall(reqobj) {
            
            if (reqobj.length > 0) {
                $scope.loader = "block";
                Restservice.post('api/SensorRule/' + $scope.groupSelected, reqobj, function (err, response) {
                    if (!err) {
                        $scope.loader = "none";
                        console.log("[Info] :: Create Rule ", response);
                        $state.go('rules');

                    }
                    else {
                        $scope.loader = "none";
                        console.log("[Error] :: Create Rule  ", err);
                        Alertify.error("Rule not Created");
                    }
                });
            }
            else {
                Alertify.error("Please Create Rule");
            }
        }
    });