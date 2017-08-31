'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:overviewCtrl
 * @description
 * # overviewCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('overviewCtrl', function ($scope, Restservice, $compile, Alertify, config, $rootScope, $state, $filter) {
        $scope.gatewayCount = 0;
        $scope.getonboardsensorcount = 0;
        $scope.damageassetcount = 0;
        $scope.onlinegatewaycount = 0;
        $scope.lastSync = '--';
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

        $scope.changeState = function (state) {
            $state.go(state);

        }

        $scope.getAllAsset = function () {
            Restservice.get('api/Asset', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Asset list response ", response);
                    $scope.assetList = response;
                    $scope.getonboardsensorcount = $scope.assetList.length;
                }
                else {
                    console.log("[Error]:: Get Asset list response ", err);
                }
            });
        }
        $scope.getAllAsset();

        $scope.getDamageAsset = function () {
            Restservice.get('api/DamageAsset', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Damage Asset list response ", response);
                    $scope.damageassetList = response;
                    $scope.damageassetcount = $scope.damageassetList.length;
                }
                else {
                    console.log("[Error]:: Get Damage Asset list response ", err);
                }
            });
        }
        $scope.getDamageAsset();

        $scope.getOnlineGateway = function () {
            Restservice.get('api/OnlineGateway', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get OnlineGateway ", response);
                    $scope.onlineGatewayList = response;
                    $scope.onlinegatewaycount = $scope.onlineGatewayList.length;
                }
                else {
                    console.log("[Error]:: GetOnlineGateway ", err);
                }
            });
        }
        $scope.getOnlineGateway();

        $scope.GetAllGroupStartEndLocation = function () {
            Restservice.get('api/GetAllGroupStartEndLocation', function (err, response) {
                if (!err) {
                    console.log("[Info]::  GetAllGroupStartEndLocation ", response);
                    $scope.groupList = response;
                                   

                    if ($scope.groupList.length>0) { 
                        $scope.selectedGroup = $scope.groupList[0];
                        $scope.address = response[0];
                        geocodeLatLng();
                       
                        intializevalues($scope.selectedGroup.Gps);
                    }
                }
                else {
                    console.log("[Error]:: GetAllGroupStartEndLocation ", err);
                    
                }
            });
        }
        $scope.GetAllGroupStartEndLocation();
        function markerAnimation() {
                     
            setInterval(function () {
                
                $scope.address.Gps[0].Latitude++;
                $scope.address.Gps[0].Longitude++;
                $scope.$apply();
            },2000);
        }


        var geocoder = new google.maps.Geocoder;

        function geocodeLatLng() {
            console.log($scope.selectedGroup.Gps[0].Timestamp);
            $scope.startd =new Date( $scope.selectedGroup.Gps[0].Timestamp);
            $scope.endd = new Date( $scope.selectedGroup.Gps[1].Timestamp);
            var latlng = { lat: parseFloat($scope.selectedGroup.Gps[0].Latitude), lng: parseFloat($scope.selectedGroup.Gps[0].Longitude) };
            geocoder.geocode({ 'location': latlng }, function (results, status) {
                if (status === 'OK') {
                    if (results[1]) {
                        console.log("result ::", results);
                        $scope.origin = results[0].formatted_address;
                        $scope.$apply();
                    } else {
                        
                    }
                } else {
                    
                }
            });
            var latlng1 = { lat: parseFloat($scope.selectedGroup.Gps[1].Latitude), lng: parseFloat($scope.selectedGroup.Gps[1].Longitude) };
            console.log($scope.selectedGroup);
            geocoder.geocode({ 'location': latlng1 }, function (results, status) {
                if (status === 'OK') {
                    if (results[1]) {
                        $scope.destination = results[0].formatted_address;
                        $scope.$apply();
                    } else {

                    }
                } else {

                }
            });
        }

        initialize();

        $scope.groupChange = function () {
            clearmarker();
            setTimeout(function () { geocodeLatLng();intializevalues($scope.selectedGroup.Gps) },2000);
        }

        $scope.flip = function () {
            $('.card').toggleClass('flipped');
        }

        $scope.getAllLayout = function () {
            Restservice.get('api/IndoorLayout', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get layout list response ", response);
                    $scope.layoutList = response;
                    if ($scope.layoutList.length > 0) {
                        $scope.layout_uploaded = true;
                        $scope.layout = $scope.layoutList[0];
                        setTimeout(function () {
                            placegateway();
                        },500);
                       
                        //$scope.background_image = $scope.layoutList[0].FileUrl;
                    }

                }
                else {
                    console.log("[Error]:: Get layout list response ", err);
                }
            });
        }
        $scope.getAllLayout();

        function placegateway() {
            var layoutWidth = angular.element(document.getElementById('dashboard-layout'))[0].clientWidth;
            var layoutHeight = angular.element(document.getElementById('dashboard-layout'))[0].clientHeight;
            var minusWidthE =  (110/layoutWidth )*100; //it is dependent (1/4) on external circle width height
            var minusHeightE = (90/ layoutHeight) * 100;            
            console.log("layoutWidth ::", layoutWidth);
            console.log("layoutHeight ::", layoutHeight);           
            for (var i = 0; i < $scope.layout.Gateways.length; i++) {
                console.log("X % ::", $scope.layout.Gateways[i].LayoutX);
                console.log("Y %", $scope.layout.Gateways[i].LayoutY);                
                document.getElementById($scope.layout.Gateways[i].GatewayKey + '-external').style.left = ($scope.layout.Gateways[i].LayoutX - minusWidthE) + '%';
                document.getElementById($scope.layout.Gateways[i].GatewayKey + '-external').style.top = ($scope.layout.Gateways[i].LayoutY - minusHeightE) + '%';
                document.getElementById($scope.layout.Gateways[i].GatewayKey + '-medium').style.left = '25%';
                document.getElementById($scope.layout.Gateways[i].GatewayKey + '-medium').style.top = '25%';
                document.getElementById($scope.layout.Gateways[i].GatewayKey + '-small').style.left = '25%';
                document.getElementById($scope.layout.Gateways[i].GatewayKey + '-small').style.top = '25%';
                document.getElementById($scope.layout.Gateways[i].GatewayKey + '-center').style.left = '40%';
                document.getElementById($scope.layout.Gateways[i].GatewayKey + '-center').style.top = '40%';
                //socketSub('topic/' + $scope.layout.Gateways[i].GatewayKey);
                ///socketSub('RSSI');
            }
            socketSub('RSSI');
            socketSub('RuleBreak');
            socketSub('RuleCreationMessage');
          
        }
        var socket = io(config.nodeserver);
        //var socket = io('http://localhost:1337/');
        $scope.ruleBreakFlag = false;
        function socketSub(topic) {
          
            socket.on(topic, function (obj) {  
                obj = JSON.parse(obj);
                obj.RSSI
                
                if (obj.RSSI != undefined) {
                    try {
                        console.log("IOT HUB RSSI Data ::", obj);
                        var circle;
                        var dataObj;
                        var state;
                        var asset = document.getElementById(obj.AssetBarcode + "-Asset");
                        if (asset) {
                            dataObj = asset.attributes.data.value;
                            state = document.getElementById(obj.AssetBarcode + "-Asset").style.backgroundColor;
                           
                        
                        if (obj.RSSI > -33) {

                            console.log("CLOSE");
                            circle = document.getElementById(obj.Gatewaykey + '-small');

                        }
                        else if (obj.RSSI < -33 && obj.RSSI > -66) {
                            console.log("FAR");
                            circle = document.getElementById(obj.Gatewaykey + '-medium');
                        }
                        else if (obj.RSSI < -66) {
                            console.log("Too FAR");
                            circle = document.getElementById(obj.Gatewaykey + '-external');

                        }
                        if (circle) {
                            var innerDiv = $compile('<div id="' + obj.AssetBarcode + '-Asset" data=\'' + dataObj + '\' class="asset-circle" ng-click="assetClick($event)" style="background-color:' + state+'"></div>')($scope);
                            document.getElementById(obj.AssetBarcode + "-Asset").remove();
                            angular.element(circle).append(innerDiv);

                        }
                        }

                    } catch (err) {
                        console.error(err);
                    }
                }
                else if (obj.sensorruleid != undefined) {
                    console.log("IOT HUB Rule Break Data ::", obj);
                    if (document.getElementById(obj.assetbarcode + "-Asset")) {
                        $rootScope.$broadcast('newalert', '');
                        console.log("$scope.ruleBreakFlag", $scope.ruleBreakFlag);
                        if ($scope.ruleBreakFlag) {

                        }
                        else {
                            document.getElementById(obj.assetbarcode + "-Asset").style.backgroundColor = 'red';
                            //var capabality = ruleMap[obj.sensorruleid] ? ruleMap[obj.sensorruleid] : '';
                            var Ruleobj = $filter('filter')($scope.ruleList, { Id: obj.sensorruleid })[0];
                            if (!Ruleobj) {
                                $scope.getAllRule(function () {
                                    var Ruleobj = $filter('filter')($scope.ruleList, { Id: obj.sensorruleid })[0];
                                    Alertify.error(Ruleobj.Capability + ' Rule Trigger for Asset ' + obj.assetbarcode);
                                });
                            }
                            else {
                                Alertify.error(Ruleobj.Capability + ' Rule Trigger for Asset ' + obj.assetbarcode);
                            }
                           
                            $scope.ruleBreakFlag = true;
                            setTimeout(function () {
                                $scope.ruleBreakFlag = false;
                            },15000);
                        }
                    }
                }
                else if (obj.RuleCreationMessage != undefined) {
                    console.log("IOT HUB Rule Create Data ::", obj);
                    Alertify.success(obj.RuleCreationMessage);
                }
                else{
                    console.log("IOT HUB Asset Data ::", obj);
                    var filterObj = $scope.assetCapabilities.filter(function (element, i) {
                        return element.Id == obj.CapabilityId;
                    })[0];
                    var d = new Date();
                    $scope.lastSync = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
                        d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

                    var index = $scope.assetCapabilities.indexOf(filterObj);
                    if ($scope.assetCapabilities[index].Name == 'Accelerometer' || $scope.assetCapabilities[index].Name == 'Gyroscope' || $scope.assetCapabilities[index].Name == 'Magnetometer') {
                        $scope.assetCapabilities[index].value = 'X : ' + obj.x.toFixed(2) + ' Y: ' + obj.y.toFixed(2) + ' Z:' + obj.z.toFixed(2);
                        
                    }                   
                    else {
                        $scope.assetCapabilities[index].value = obj[$scope.assetCapabilities[index].Name];
                    }
                    console.log("$scope.gatewayCapabilityIndex", $scope.gatewayCapabilityIndex);
                    $scope.assetCapabilities[$scope.gatewayCapabilityIndex].value = obj.Gatewaykey;
                    $scope.$apply();

                }

            });
        }
        $scope.$on('$destroy', function (event) {
            socket.disconnect();

        });

        
        $scope.assetClick = function (event) {
            var obj = JSON.parse(event.target.attributes.data.value);
            if ($scope.assetTopic) {
                socket.removeListener($scope.assetTopic);
            }
            $scope.assetCapabilities = obj.SensorCapabilities;
            for (var i = 0; i < $scope.assetCapabilities.length; i++) {
                $scope.assetCapabilities[i].value = '--';
                if ($scope.assetCapabilities[i].Name == 'Gateway') {
                    $scope.gatewayCapabilityIndex = i;
                }
            }
            $scope.lastSync = '--';
            $scope.assetTopic = "topic/" + obj.AssetBarcode;
            $scope.selectedAsset = obj.AssetBarcode;
            console.log("Asset Topic ::", $scope.assetTopic);
            socketSub($scope.assetTopic);
            $scope.openNav();
        }

        $scope.openNav=function() {
            document.getElementById("mySidenav").style.width = "20vw";
            document.getElementById("main").style.marginRight = "20vw";
        }

        $scope.closeNav=function() {
            document.getElementById("mySidenav").style.width = "0";
            document.getElementById("main").style.marginRight = "0";
        }

        var ruleMap = [];
        $scope.getAllRule = function (callback) {
            Restservice.get('api/SensorRule', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Rule list response ", response);
                    $scope.ruleList = response;
                    //for (var i = 0; i < $scope.ruleList; i++) {
                    //    var obj = {
                    //        'Id': $scope.ruleList[i].Id
                    //    }
                    //    ruleMap[$scope.ruleList[i].Id] = $scope.ruleList[i].Capability;
                    //}
                  
                    callback();
                }
                else {
                    console.log("[Error]:: Get Rule list response ", err);
                }
            });
        }
        $scope.getAllRule(function () {
        });

    });