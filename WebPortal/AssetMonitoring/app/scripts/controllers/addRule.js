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
        $scope.selected = {
            'gateway':''
        }
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
        $scope.getGroupCapablities = function (groupId) {
            for (var i = 0; i < $scope.capabilityList.length; i++) {
                $("#" + $scope.capabilityList[i].Name).addClass("disabledbutton");
            }
            Restservice.get('api/SensorGroup/' + groupId, function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Group Capability response ", response);
                    for (var i = 0; i < response.CapabilityNames.length; i++) {
                        $("#" + response.CapabilityNames[i]).removeClass("disabledbutton");
                    }
                    $("#GatewayRange").removeClass("disabledbutton");
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
                    console.log("$scope.capabilityList[i].Filters[j]",$scope.capabilityList[i].Filters[j]);
                    $("#" + $scope.capabilityList[i].Filters[j].Name+"-slider-range").slider({
                    orientation: "vertical",
                    range: true,
                    max: 200,
                    values: [0, 33],
                    slide: function (event, ui) {

                        var name = event.target.id.substring(0, event.target.id.indexOf("-"));
                        if (name == 'X' || name == 'Y' || name == 'Z') {
                            name = 'Accelerometer';
                        }
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
        $scope.selected = {
            'range': ''
        }
        function recursiveCreateRule(i, j) {

            if ($scope.capabilityList && i < $scope.capabilityList.length) {
                if ($scope.capabilityList[i].Name != 'Gateway') {
                    if (j < $scope.capabilityList[i].Filters.length) {
                       // if ($scope.capabilityList[i].Filters.length > 1) {
                        console.log("$scope.capabilityList[i].Filters[j].Name", $scope.capabilityList[i].Filters[j].Name);
                        if ($scope.capabilityList[i].Name == 'Accelerometer' || $scope.capabilityList[i].Name == 'Magnetometer' || $scope.capabilityList[i].Name == 'Gyroscope') {
                            console.log("$scope.capabilityList[i].Filters[j].check", $scope.capabilityList[i].Filters[j].check);
                            if ($scope.capabilityList[i].Filters[j].check) {
                                var obj = {
                                    'MinThreshold': 0,
                                    'MaxThreshold': 0,
                                    'Operator': $scope.capabilityList[i].Filters[j].Name =='Vibration'?'slope':'',
                                    'CapabilityFilterId': $scope.capabilityList[i].Filters[j].Id
                                }
                                reqobj.push(obj);
                                recursiveCreateRule(i, j + 1);
                            }
                            else {
                                recursiveCreateRule(i, j + 1);
                            }
                        }
                        else {
                            var val = $("#" + $scope.capabilityList[i].Filters[j].Name + "-slider-range").slider("option", "values");
                            if (val[0] != 0 || val[1] != 33) {
                                console.log("$scope.capabilityList[i]", $scope.capabilityList[i]);
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
                    }
                    else {
                        recursiveCreateRule(i + 1, 0);
                    }
                    


                }
                else {
                    console.log("$scope.selectedGatewayRule", $scope.selectedGatewayRule);
                    if ($scope.selectedGatewayRule != '' && $scope.selectedGatewayRule   ) {
                       
                        var obj = {
                            'MinThreshold': $scope.selectedGatewayRule   ,                            
                            'Operator': '',
                            'CapabilityFilterId': $scope.capabilityList[i].Filters[j].Id
                        }

                        console.log(obj);
                        reqobj.push(obj);
                    }
                    if ($scope.selected.range != '' && $scope.selected.range && $scope.selectedGatewayRange != '' && $scope.selectedGatewayRange) {
                        console.log("$scope.gatewayrange", $scope.selected.range);
                        var obj = {
                            'MinThreshold': $scope.selectedGatewayRange,
                            'MaxThreshold': $scope.selected.range,
                            'Operator': '',
                            'CapabilityFilterId': $scope.capabilityList[i].Filters[j+1].Id
                        }
                        console.log(obj);
                        reqobj.push(obj);
                    }
                    recursiveCreateRule(i + 1, 0);
                    
                }

            }
            else {
                    createRuleApiCall(reqobj);
            }

        }
        function createRuleApiCall(reqobj) {
            console.log(reqobj);
            if (reqobj.length > 0) {
                //$scope.loader = "block";
               
                $state.go('rules');
                Restservice.post('api/SensorRule/' + $scope.groupSelected, reqobj, function (err, response) {
                    if (!err) {
                        $scope.loader = "none";
                        console.log("[Info] :: Create Rule ", response);
                        //Alertify.success("Rule Created");                        
                        Alertify.success("Rule creation has started. You will be notified once rule is created.");
                    }
                    else {
                        $scope.loader = "none";
                        console.log("[Error] :: Create Rule  ", err);
                        if (err.status == 400) {
                            Alertify.error(err.data.Message);
                        }
                        else {
                            Alertify.error("Rule creation fail");
                        }
                       }
                });
            }
            else {
                Alertify.error("Please Create Rule");
            }
        }
        $scope.gatewayChange = function (selectedGatewayRule) {            
            $scope.selectedGatewayRule = selectedGatewayRule;
        }

        $scope.gatewayRangeChange = function (selectedGatewayRange) {
            $scope.selectedGatewayRange = selectedGatewayRange;
        }
    });