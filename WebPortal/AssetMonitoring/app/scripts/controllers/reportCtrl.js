'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:reportCtrl
 * @description
 * # reportCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('reportCtrl', function ($scope, Restservice, Token, $filter, $http) {
        $scope.historic = false;
        $scope.loader = "none";
        $scope.sensorGroupList = [{ 'Name': 'Loading Group' }];
        $scope.sensorList = [{ 'Name': 'No Group Selected' }];
        $scope.sensorSelected = $scope.sensorList[0];
        $scope.loadingsensor = true;
        $scope.chartdata = {};
        $scope.chartXYZdata = {};
        $scope.chartObj = {};
        $scope.capibilityValue = {};
        $scope.capibilityXYZValue = {};
        /*
        $scope.powerBiURl = [{ 'Capability': 'Temperature', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=ff107836-abac-470e-b55c-405319da2dc1' },
            { 'Capability': 'Accelerometer', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=82f39ebd-0b84-4652-a24f-c55c7a16989a' },
            { 'Capability': 'Humidity', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=cf2b5d0e-c16d-4ad2-8ff6-5058088d9bc1' },
            { 'Capability': 'UVIndex', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=02ad1280-cab2-4cac-87d5-39ebc6f1539b' },
            { 'Capability': 'Luminescence', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=fa9ec27c-a8ff-49ee-8052-9d8d781f4757' }
        ]
        /* New*/
        //$scope.powerBiURl = [{ 'Capability': 'Temperature', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=c1f90493-e33f-42b3-9a01-67632c6e059f' },
        //{ 'Capability': 'Accelerometer', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=b8f254fa-4d81-4ed7-ab86-dd88dcfa66fc' },
        //{ 'Capability': 'Humidity', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=f30e9002-6bc6-465d-9dc7-5a2ebb2a6fff' },
        //{ 'Capability': 'UVIndex', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=f8f20e4b-4391-49aa-8e42-8b108a1c30c2' },
        //{ 'Capability': 'Luminescence', 'Url': 'https://app.powerbi.com/dashboardEmbed?dashboardId=7ea991dd-86bd-43c0-a8da-86b05ead5488' }
        //]


        //$scope.historyUrl = "https://app.powerbi.com/reportEmbed?reportId=cd692a37-cab7-4970-8af4-c844c67298e1&$filter=Sensors/SensorGroupId eq";
        //$scope.historyUrl = "https://app.powerbi.com/reportEmbed?reportId=b8170f6b-9429-4509-b4ee-4fdc10657766&$filter=Sensors/SensorGroupId eq";


        function getPowerBiUrls() {
            $http.get('powerBI.json')
                .then(function (data, status, headers) {
                    $scope.powerBiURl = data.data;
                })
                .catch(function (data, status, headers) {
                    console.log("[Error]  :: Get Power Bi Urls ", data);
                });
        }
        getPowerBiUrls();
        $scope.getAllSensorGroup = function () {
            $scope.sensorGroupList = [{ 'Name': 'Loading Group' }];
            Restservice.get('api/SensorGroup', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Sensor Group response ", response);
                    $scope.sensorGroupList = response;
                    if ($scope.sensorGroupList.length == 0) {
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
            $scope.sensorSelected = $scope.sensorList[0];
            $scope.sensorList = [];
            $scope.sensorList = [{ 'Name': 'Loading Sensor' }];
            $scope.sensorSelected = $scope.sensorList[0];

        }
        $scope.sensorChange = function () {
            $scope.getSensorDetail();

        }
       
        $scope.getAllSensor = function () {
            Restservice.get('api/SensorGroup/' + $scope.groupSelected, function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get  Sensor Group Detail ", response);
                    $scope.sensorList = response.Sensors;
                    $scope.ruleList = response.SensorRules;
                    $scope.loadingsensor = false;
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

            var object_by_id = $filter('filter')($scope.capabilityList, { Name: 'Gateway' })[0];
            var index = $scope.capabilityList.indexOf(object_by_id);
            $scope.capabilityList.splice(index);
            console.log("Capi", $scope.capabilityList);
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
                        //sendFilter();
                        setTimeout(function () {
                            //embedDashboards();
                            var object_by_id = $filter('filter')($scope.powerBiURl, { Capability: 'History' })[0];
                            if (object_by_id) {
                                embedReport(object_by_id.Url + "&$filter=Sensors/Sensor eq '" + $scope.sensorSelected.Name + "'", 'historic-container');
                            }
                            else {
                                console.log("[Error] :: Please Update Power Bi urls");
                            }
                        }, 1000);

                        setTimeout(function () {
                            socketSub();
                            createChartObject();
                        }, 1000);
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
                if (object_by_id) {
                    embedDashboard(object_by_id.Url, $scope.capabilityList[i].Name + '-container');
                }
                else {
                    console.log("[Error] :: Please Update Power Bi urls for " + $scope.capabilityList[i].Name);
                }
            }
        }

        function embedDashboard(embedUrl, containerId) {
            // Read embed application token from textbox
            var txtAccessToken = Token.data.accesstoken;
            //console.log(txtAccessToken);
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
        var socket = io('https://assetnodeserver20170727030834.azurewebsites.net/');
        //var socket = io('http://localhost:1337');
        $scope.oldTopic = "";
        function socketSub() {
            console.log("groupSelected", $scope.groupSelected);
            console.log("$scope.sensorSelected", $scope.sensorSelected);
            socket.removeListener($scope.oldTopic);
            $scope.oldTopic = 'topic/' + $scope.groupSelected + '/' + $scope.sensorSelected.SensorKey;
            console.log("$scope.oldTopic", $scope.oldTopic);
            socket.on($scope.oldTopic, function (obj) {
                console.log("obj", obj);

                try {
                    var obj = JSON.parse(obj);
                    var object_by_id = $filter('filter')($scope.capabilityList, { Id: obj.CapabilityId })[0];
                   
                    if (object_by_id.Name == 'Accelerometer' || object_by_id.Name == 'Gyroscope' || object_by_id.Name == 'Magnetometer') {
                        console.log("object_by_id.Name", object_by_id.Name);
                        console.log("XYZ obj", obj);
                        $scope.chartXYZdata[obj.CapabilityId].x.push(obj.x);
                        $scope.chartXYZdata[obj.CapabilityId].y.push(obj.y);
                        $scope.chartXYZdata[obj.CapabilityId].z.push(obj.z);
                        $scope.capibilityXYZValue[obj.CapabilityId] = {
                            'x': '',
                            'y': '',
                            'z':''
                        }
                        $scope.capibilityXYZValue[obj.CapabilityId].x = obj.x.toFixed(2);
                        $scope.capibilityXYZValue[obj.CapabilityId].y = obj.y.toFixed(2);
                        $scope.capibilityXYZValue[obj.CapabilityId].z = obj.z.toFixed(2);
                        $scope.$apply();
                        $scope.timeData[obj.CapabilityId].push(new Date(obj.Timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, ''));
                        const maxLen = 50;
                        var len = $scope.chartXYZdata[obj.CapabilityId].x.length;
                        if (len > maxLen) {
                            $scope.timeData[obj.CapabilityId].shift();
                            $scope.chartXYZdata[obj.CapabilityId].x.shift();
                            $scope.chartXYZdata[obj.CapabilityId].y.shift();
                            $scope.chartXYZdata[obj.CapabilityId].z.shift();
                        }
                        $scope.chartObj[obj.CapabilityId].update();
                    }
                    else {
                        //console.log(obj[object_by_id.Name]);
                        $scope.chartdata[obj.CapabilityId].push(obj[object_by_id.Name]);
                        $scope.capibilityValue[obj.CapabilityId] = obj[object_by_id.Name].toFixed(2);;
                        $scope.$apply();
                        $scope.timeData[obj.CapabilityId].push(new Date(obj.Timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '') );
                        const maxLen = 50;
                        var len = $scope.chartdata[obj.CapabilityId].length;
                        if (len > maxLen) {
                            $scope.timeData[obj.CapabilityId].shift();
                            $scope.chartdata[obj.CapabilityId].shift();
                        }
                        $scope.chartObj[obj.CapabilityId].update();
                    }
                } catch (err) {
                    console.error(err);
                }

            });
        }


        $scope.timeData = {};



        function createChartObject() {
            //Get the context of the canvas element we want to select
           // console.log("$scope.capabilityList", $scope.capabilityList);
            for (var i = 0; i < $scope.capabilityList.length; i++) {
                if ($scope.capabilityList[i].Name != 'Accelerometer' && $scope.capabilityList[i].Name != 'Gyroscope' && $scope.capabilityList[i].Name != 'Magnetometer') {
                    $scope.chartdata[$scope.capabilityList[i].Id] = [];
                    $scope.timeData[$scope.capabilityList[i].Id] = [];
                    var data = {
                        labels: $scope.timeData[$scope.capabilityList[i].Id],
                        datasets: [
                            {
                                fill: false,
                                label: $scope.capabilityList[i].Name,
                                yAxisID: $scope.capabilityList[i].Name,
                                borderColor: "#01b8aa",
                                pointBoarderColor: "#01b8aa",
                                backgroundColor: "#01b8aa",
                                pointHoverBackgroundColor: "#01b8aa",
                                pointHoverBorderColor: "#01b8aa",
                                data: $scope.chartdata[$scope.capabilityList[i].Id]
                            }
                        ]
                    }

                    var ruleObj = $filter('filter')($scope.ruleList, { CapabilityFilterId: $scope.capabilityList[i].Filters[0].Id })[0];
                    
                    if (ruleObj) {
                        console.log("ruleobj", ruleObj.MaxThreshold);
                        var obj = {
                            data: Array.apply(null, new Array(50)).map(Number.prototype.valueOf, parseInt(ruleObj.MaxThreshold)),// ruleObj.MaxThreshold),
                            fill: false,
                            label: 'Rule',
                            radius: 0,
                            borderColor: "rgba(255, 0, 0, 1)",
                            backgroundColor: "rgba(255, 0, 0, 1)"
                        };
                        data.datasets.push(obj);
                    }

                    var basicOption = {
                        title: {
                            display: true,
                            //text: $scope.capabilityList[i].Name,
                            fontSize: 20
                        },
                        scales: {
                            yAxes: []
                        }
                    }
                    var ctx = document.getElementById($scope.capabilityList[i].Name + "-Chart").getContext("2d");
                    var optionsNoAnimation = { animation: true }
                    var obj = {
                        id: $scope.capabilityList[i].Name,
                        type: 'linear',
                        scaleLabel: {
                            labelString: $scope.capabilityList[i].Name,
                            display: true
                        },
                        position: 'left',
                    };

                    basicOption.scales.yAxes.push(obj);
                    $scope.chartObj[$scope.capabilityList[i].Id] = new Chart(ctx, {
                        type: 'line',
                        data: data,
                        options: basicOption
                    });
                }
                else {
                    $scope.chartXYZdata[$scope.capabilityList[i].Id] = {
                        x: [],
                        y: [],
                        z: []
                    };
                    $scope.timeData[$scope.capabilityList[i].Id] = [];
                    var data = {
                        labels: $scope.timeData[$scope.capabilityList[i].Id],
                        datasets: [
                            {
                                fill: false,
                                label: 'x',
                                yAxisID: 'x',
                                borderColor: "#01b8aa",
                                pointBoarderColor: "#01b8aa",
                                backgroundColor: "#01b8aa",
                                pointHoverBackgroundColor: "#01b8aa",
                                pointHoverBorderColor: "#01b8aa",
                                data: $scope.chartXYZdata[$scope.capabilityList[i].Id].x
                            },
                            {
                                fill: false,
                                label: 'y',
                                yAxisID: 'x',
                                borderColor: "rgba(24, 120, 240, 1)",
                                pointBoarderColor: "rgba(24, 120, 240, 1)",
                                backgroundColor: "rgba(24, 120, 240, 1)",
                                pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
                                pointHoverBorderColor: "rgba(24, 120, 240, 1)",
                                data: $scope.chartXYZdata[$scope.capabilityList[i].Id].y
                            },
                            {
                                fill: false,
                                label: 'z',
                                yAxisID: 'x',
                                borderColor: "rgba(255, 204, 0, 1)",
                                pointBoarderColor: "rgba(255, 204, 0, 1)",
                                backgroundColor: "rgba(255, 204, 0, 1)",
                                pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
                                pointHoverBorderColor: "rgba(255, 204, 0, 1)",
                                data: $scope.chartXYZdata[$scope.capabilityList[i].Id].z
                            }
                            //,
                            //{
                            //    data: Array.apply(null, new Array(50)).map(Number.prototype.valueOf, 1),
                            //    fill: false,
                            //    label: 'Rule',
                            //    radius: 0,
                            //    borderColor: "rgba(255, 0, 0, 1)",
                            //    backgroundColor: "rgba(255, 0, 0, 1)"
                            //}
                        ]
                    }
                    var basicOption = {
                        title: {
                            display: true,
                            //text: $scope.capabilityList[i].Name,
                            fontSize: 20
                        },
                        scales: {
                            yAxes: [{
                                id: 'x',
                                type: 'linear',
                                scaleLabel: {
                                    labelString: 'x',
                                    display: true
                                },
                                position: 'left'
                            }]
                        }
                        
                    }
                    var ctx = document.getElementById($scope.capabilityList[i].Name + "-Chart").getContext("2d");
                    var optionsNoAnimation = { animation: true }

                    $scope.chartObj[$scope.capabilityList[i].Id] = new Chart(ctx, {
                        type: 'line',
                        data: data,
                        options: basicOption
                    });

                }
            }

        }
     

    });