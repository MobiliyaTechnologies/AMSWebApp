'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:reportCtrl
 * @description
 * # reportCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('reportCtrl', function ($scope, Restservice, Token, $filter) {
        $scope.historic = false;
        $scope.loader = "none";
        $scope.sensorGroupList = [{ 'Name': 'Loading Group' }];
        $scope.sensorList = [{ 'Name': 'No Group Selected' }];
        $scope.sensorSelected = $scope.sensorList[0];
        /*
        $scope.powerBiURl = [{ 'Capability': 'Temperature', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=ff107836-abac-470e-b55c-405319da2dc1' },
            { 'Capability': 'Accelerometer', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=82f39ebd-0b84-4652-a24f-c55c7a16989a' },
            { 'Capability': 'Humidity', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=cf2b5d0e-c16d-4ad2-8ff6-5058088d9bc1' },
            { 'Capability': 'UVIndex', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=02ad1280-cab2-4cac-87d5-39ebc6f1539b' },
            { 'Capability': 'Luminescence', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=fa9ec27c-a8ff-49ee-8052-9d8d781f4757' }
        ]
        /* New*/
        $scope.powerBiURl = [{ 'Capability': 'Temperature', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=c1f90493-e33f-42b3-9a01-67632c6e059f' },
        { 'Capability': 'Accelerometer', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=b8f254fa-4d81-4ed7-ab86-dd88dcfa66fc' },
        { 'Capability': 'Humidity', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=f30e9002-6bc6-465d-9dc7-5a2ebb2a6fff' },
        { 'Capability': 'UVIndex', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=f8f20e4b-4391-49aa-8e42-8b108a1c30c2' },
        { 'Capability': 'Luminescence', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=7ea991dd-86bd-43c0-a8da-86b05ead5488' }
        ]
        

        $scope.historyUrl = "https://app.powerbi.com/reportEmbed?reportId=cd692a37-cab7-4970-8af4-c844c67298e1&$filter=Sensors/SensorGroupId eq";
        //$scope.historyUrl = "https://app.powerbi.com/reportEmbed?reportId=b8170f6b-9429-4509-b4ee-4fdc10657766&$filter=Sensors/SensorGroupId eq";
        $scope.getAllSensorGroup = function () {
            $scope.sensorGroupList = [{ 'Name': 'Loading Group' }];
            Restservice.get('api/SensorGroup', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Sensor Group response ", response);
                    $scope.sensorGroupList = response;
                    if ($scope.sensorGroupList.length==0){
                        $scope.sensorGroupList = [{ 'Name': 'No Sensor Group available' }];
                    }
                }
                else {
                    console.log("[Error]:: Get Sensor Group response ", err);
                }
            });
        }
        $scope.getAllSensorGroup();
        $scope.groupChange = function () {
            $scope.getAllSensor();
            $scope.sensorList = [{ 'Name': 'Loading Sensor' }];
            console.log("Group ", $scope.groupSelected);
            embedReport($scope.historyUrl+" '" + $scope.groupSelected+"'", 'historic-container')
        }
        $scope.sensorChange = function () {
            $scope.getSensorDetail();
           
        }
        
        $scope.getAllSensor = function () {
                Restservice.get('api/SensorGroup/' + $scope.groupSelected, function (err, response) {
                    if (!err) {
                        console.log("[Info]:: Get  Sensor Group Detail ", response);
                        $scope.sensorList = response.Sensors;
                        if ($scope.sensorList.length == 0) {
                            $scope.sensorList = [{ 'Name': 'No Sensor available' }];
                        }
                    }
                    else {
                        console.log("[Error]:: Get Get  Sensor Group Detail ", err);
                    }
                });
        }
        function sendFilter() {
            
            var obj = {
                'SensorKey': $scope.sensorSelected.SensorKey,
                'Capabilities': $scope.capabilityList
            }
            console.log("obj", obj);
            Restservice.posta('api/SensorReport', obj, function (err, response) {
                if (!err) {
                    console.log("[Info] :: SensorReport ", response);
                }
                else {
                    console.log("[Error] :: Add SensorReport ", err);
                }
            });

           
        }
        $scope.getSensorDetail = function () {
           
            if ($scope.sensorSelected) {
                $scope.loader = "block";
                Restservice.get('api/SensorType/' + $scope.sensorSelected.SensorTypeId, function (err, response) {
                    if (!err) {
                        console.log("[Info]:: Get  Sensor Type Detail ", response);
                        $scope.loader = "none";
                        $scope.capabilityList = response.Capabilities;
                        sendFilter();
                        setTimeout(function () { embedDashboards(); }, 1000);

                    }
                    else {
                        console.log("[Error]:: GetGet  Sensor Type Detail ", err);
                    }
                });
            }
        }
        
        function embedDashboards() {
            for (var i = 0; i < $scope.capabilityList.length; i++) {
                var object_by_id = $filter('filter')($scope.powerBiURl, { Capability: $scope.capabilityList[i].Name })[0];
                embedDashboard(object_by_id.Url, $scope.capabilityList[i].Name +'-container');
            }
        }
        
        function embedDashboard(embedUrl, containerId) {
            // Read embed application token from textbox
            var txtAccessToken = Token.data.accesstoken;
            console.log(txtAccessToken);
            // Get models. models contains enums that can be used.
            var models = window['powerbi-client'].models;
            // Embed configuration used to describe the what and how to embed.
            // This object is used when calling powerbi.embed.
            // This also includes settings and options such as filters.
            // You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
            var config = {
                type: 'dashboard',
                accessToken: txtAccessToken,
                embedUrl: embedUrl
                
            };
            // Get a reference to the embedded dashboard HTML element
            // Grab the reference to the div HTML element that will host the dashboard.
            var dashboardContainer = document.getElementById(containerId);
            // Embed the dashboard and display it within the div container.
            var dashboard = powerbi.embed(dashboardContainer, config);

            // dashboard.on will add an event handler which prints to Log window.
            dashboard.on("tileClicked", function (event) {
                var logView = document.getElementById('logView');
                logView.innerHTML = logView.innerHTML + "Tile Clicked<br/>";
                logView.innerHTML = logView.innerHTML + JSON.stringify(event.detail, null, "  ") + "<br/>";
                logView.innerHTML = logView.innerHTML + "---------<br/>";
            });

            // dashboard.on will add an event handler which prints to Log window.
            dashboard.on("error", function (event) {
                var logView = document.getElementById('logView');
                logView.innerHTML = logView.innerHTML + "Error<br/>";
                logView.innerHTML = logView.innerHTML + JSON.stringify(event.detail, null, "  ") + "<br/>";
                logView.innerHTML = logView.innerHTML + "---------<br/>";
            });
        }

        var iframe;
        function embedReport(reportURL, iframeId) {
            console.log("reportURL", reportURL);
            var embedUrl = reportURL;
            if ("" === embedUrl) {
                console.log("No embed URL found");
                return;
            }
            iframe = document.getElementById(iframeId);
            iframe.src = embedUrl;
            iframe.onload = function () {
                postActionLoadReport(iframeId)
            };
        }

        function postActionLoadReport(iframeId) {
            var accessToken = Token.data.accesstoken
            if ("" === accessToken) {
                console.log("Access token not found");
                return;
            }
            var m = { action: "loadReport", accessToken: accessToken };
            var message = JSON.stringify(m);
            iframe = document.getElementById(iframeId);
            iframe.contentWindow.postMessage(message, "*");;
        }
       
        $scope.toggleHistory = function () {
            $scope.historic ? $scope.historic = false : $scope.historic = true;
        }
    });