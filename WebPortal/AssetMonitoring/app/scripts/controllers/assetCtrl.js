'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:assetCtrl
 * @description
 * # assetCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('assetCtrl', function ($scope, Restservice, $filter, DTOptionsBuilder, $modal, Alertify) {
        //$scope.loader = 'block';
        //$scope.dtOptions = DTOptionsBuilder.newOptions()
        //    .withPaginationType('full_numbers')
        //    .withDisplayLength(5)
        //    .withOption('order', [2, 'desc']);
        $scope.assets_loading_label = false;
        var myEl = angular.element(document.querySelector('#assets-datatable-loader'));
        myEl.css('display', 'block');
        $scope.getAllAssets = function () {
            Restservice.get('api/Asset', function (err, response) {
                if (!err) {
                   // $scope.loader = 'none';
                    console.log("[Info]:: Get Assets list response", response);
                    $scope.assetList = [];
                    $scope.assetObj = response;
                    myEl.css('display', 'none');
                   
                    for (var i = 0; i < $scope.assetObj.length; i++) {
                        //for (var j = 0; j < $scope.assetObj[i].SensorKeys.length;j++){
                           // $scope.assetObj[i].sensorKey = $scope.assetObj[i].SensorKeys[j];
                            var obj = {
                                'AssetId': $scope.assetObj[i].AssetId,
                                'AssetBarcode': $scope.assetObj[i].AssetBarcode,
                                'GroupName': $scope.assetObj[i].GroupName,
                           //     'SensorKey': $scope.assetObj[i].SensorKeys[j],
                                'selected':false
                            }
                           $scope.assetList.push(obj);
                       // }
                    }
                    if ($scope.assetList.length == 0) {
                        $scope.assets_loading_label = true;
                    }

                }
                else {
                    console.log("[Error]:: Get Assets list response ", err);
                }
            });
        }
        $scope.getAllAssets();
        $scope.onTaskSelect = function (task) {
            
            console.log($scope.list.selected);    
        };
        $scope.select = function () {
            var x = $filter("filter")($scope.assetList, {
                selected: true
            }, true);

            $scope.selectlength = x.length;
        }
        $scope.addSensorGroup = function () {
            var x = $filter("filter")($scope.assetList, {
                selected: true
            }, true);
            var modalInstance = $modal.open({
                templateUrl: 'SensorGroupModal.html',
                controller: 'SensorGroupModalCtrl',
                resolve: {
                    assets: function () {
                        return x;
                    }
                }
            }).result.then(function (result) {
                $scope.getAllAssets();
                Alertify.success('Sensor Added');
                }, function () {
                    $scope.getAllAssets();
                    Alertify.error('Sensor Not Added');
            });
        }

        $scope.detachSensor = function (asset) {


            Alertify.confirm('Are you sure to detach this sensor ?').then(
                function onOk() {
                    Restservice.put('api/DetachAssetSensor', asset, function (err, response) {
                        if (!err) {
                            console.log("[Info]:: DetachAssetSensor response ", response);
                            Alertify.success('Asset Deatch successfully');
                            $scope.getAllAssets();
                        }
                        else {
                            console.log("[Error]:: DetachAssetSensor response ", err);
                            Alertify.error('Error in detaching sensor');
                        }
                    });
                },
                function onCancel() {

                }
            );

           
        }



    });
angular.module('assetmonitoringApp').controller('SensorGroupModalCtrl', function ($scope, DTOptionsBuilder, $modalInstance, $http, $modal, Restservice, assets,Alertify) {
    $scope.sensorGroup = {};
    $scope.selected = {
        'SensorGroupId':''
    }
    $scope.assetIds = [];
    for (var i = 0; i < assets.length; i++) {
        console.log(assets[i]);
        $scope.assetIds.push(assets[i].AssetId);
    }

    $scope.check = {
        createNew: 'true'
    };
    $scope.getAllSensorGroup = function () {
        Restservice.get('api/SensorGroup', function (err, response) {
            if (!err) {
                console.log("[Info]:: Get Sensor Group list response ", response);
                $scope.groupList = response;
            }
            else {
                console.log("[Error]:: Get Sensor Group list response ", err);
            }
        });
    }
    $scope.getAllSensorGroup();
    $scope.ok = function () {
        if ($scope.check.createNew == 'true') {
            $scope.loader = 'block';
            $scope.sensorGroup.AssetIds = $scope.assetIds;
            Restservice.post('api/SensorGroup', $scope.sensorGroup, function (err, response) {
                if (!err) {
                    console.log("[Info] :: Add SensorGroup ", response);                   
                    $modalInstance.close();
                }
                else {
                    console.log("[Error] :: Add SensorGroup ", err);                    
                    $modalInstance.dismiss('cancel');
                }                
                $scope.loader = 'none';
            });
        }
        else {
            if ($scope.selected.SensorGroupId) {
                $scope.loader = 'block';
                Restservice.put('api/AddAsset/' + $scope.selected.SensorGroupId, $scope.assetIds, function (err, response) {
                    if (!err) {
                        console.log("[Info] :: Add AddAsset ", response);
                        $modalInstance.close();
                    }
                    else {
                        console.log("[Error] :: Add AddAsset ", err);
                        $modalInstance.dismiss('cancel');
                    }                    
                    $scope.loader = 'none';
                });
            }
            else {
                console.log("[Info] :: Please Select group ");
            }
        }
       
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});
