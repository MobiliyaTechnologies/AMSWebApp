'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:inventoryloginCtrl
 * @description
 * # inventoryloginCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('inventoryCtrl', function ($modal, $scope, $http, Restservice, Alertify, DTOptionsBuilder ) {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
        });
        $scope.sensor_loading_label = false;
        $scope.gateway_loading_label = false;
        $scope.group_loading_label = false;
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('processing', true);
        $scope.dtOptions = DTOptionsBuilder.fromSource($scope.sensorList )
            .withOption('processing', true);
        $scope.getshipmentdetail = {
            shipmentId: 10,
            origin: 'Seattle, Washington, USA',
            destination: 'Linn County, Oregon, USA'
        }
        $scope.getAllSensor = function () {
            var myEl = angular.element(document.querySelector('#sensor-datatable-loader'));
            myEl.css('display', 'block');
            
            Restservice.get('api/Sensor', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Sensor list response ", response);
                    $scope.sensorList = response;
                    myEl.css('display', 'none');                     
                    $scope.sensorCount = $scope.sensorList.length;
                    if ($scope.sensorList.length == 0) {
                        $scope.sensor_loading_label = true;
                    }
                }
                else {
                    console.log("[Error]:: Get Sensor list response ", err);
                }
            });
        }
        $scope.getAllSensor();
        $scope.getAllGateway = function () {
            var myEl = angular.element(document.querySelector('#gateway-datatable-loader'));
            
            Restservice.get('api/Gateway', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get Gateway list response ", response);
                    $scope.gatewayList = response;
                    $scope.gatewayCount = $scope.gatewayList.length;
                    myEl.css('display', 'none');
                    if ($scope.gatewayList.length == 0) {
                        $scope.gateway_loading_label = true;
                    }
                    //$scope.gatewayCount = 0;
                }
                else {
                    console.log("[Error]:: Get Gateway list response ", err);
                }
            });
        }
        $scope.getAllGateway();
        $scope.getAllSensorGroup = function () {
            var myEl = angular.element(document.querySelector('#group-datatable-loader'));
           
            Restservice.get('api/SensorGroup', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get SensorGroup list response ", response);
                    $scope.groupList = response;
                    myEl.css('display', 'none');
                    if ($scope.groupList.length == 0) {
                        $scope.group_loading_label = true;
                    }
                }
                else {
                    console.log("[Error]:: Get SensorGroup list response ", err);
                }
            });
        }
        $scope.getAllSensorGroup();
        $scope.addSensor = function () {
            var modalInstance = $modal.open({
                templateUrl: 'SensorModal.html',
                controller: 'SensorModalCtrl',


            }).result.then(function (result) {
                //$scope.getAllSensor();
                if (result) {
                    $scope.sensorList.push(result);
                    $scope.sensorCount = $scope.sensorList.length;
                }
                    }, function () {
                // Cancel
            });
        }
        $scope.editSensor = function (sensor) {
            var modalInstance = $modal.open({
                templateUrl: 'editSensor.html',
                controller: 'editSensorCtrl',
                resolve: {
                    sensor: function () {
                        return sensor;
                    }
                }
            }).result.then(function (result) {
            }, function () {
                // Cancel
            });
        }
        $scope.viewSensorDetail = function (sensor) {
            var modalInstance = $modal.open({
                templateUrl: 'viewSensorDetail.html',
                controller: 'viewSensorDetailCtrl',
                resolve: {
                    sensor: function () {
                        return sensor;
                    }
                }
            }).result.then(function (result) {
            }, function () {
                // Cancel
            });
        }
        $scope.deleteSensor = function (sensor) {
            
            Alertify.confirm('Are you sure to delete this sensor ?').then(
                function onOk() {
                    Restservice.delete('api/Sensor/' + sensor.Id, function (err, response) {
                        if (!err) {
                            console.log("[Info]:: Delete Sensor  response ", response);
                            Alertify.success("Sensor Deleted successfully");
                            $scope.getAllSensor();
                        }
                        else {
                            console.log("[Error]:: Delete Sensor response ", err);
                            Alertify.error("Error in adding sensor");
                        }
                    });
                },
                function onCancel() {

                }
            );
        }


        $scope.addGateway = function () {
            if ($scope.gatewayCount > 0) {
                var modalInstance = $modal.open({
                    templateUrl: 'GatewayModal.html',
                    controller: 'GatewayModalCtrl',
                }).result.then(function (result) {
                    //$scope.getAllGateway();
                    if (result) {
                        $scope.gatewayList.push(result);
                        $scope.gatewayCount = $scope.gatewayList.length;
                    }
                }, function () {
                });
            }
            else if ($scope.gatewayCount == 0) {
                var modalInstance = $modal.open({
                    templateUrl: 'configureUnitModal.html',
                    controller: 'configureUnitModalCtrl'
                   
                }).result.then(function () {
                    var modalInstance = $modal.open({
                        templateUrl: 'GatewayModal.html',
                        controller: 'GatewayModalCtrl',
                    }).result.then(function (result) {
                        //$scope.getAllGateway();
                        if (result) {
                            $scope.gatewayList.push(result);
                            $scope.gatewayCount = $scope.gatewayList.length;
                        }
                    }, function () {
                    });

                }, function () {
                    // Cancel
                });

            }
        }
        $scope.editGateway = function (gateway) {
            var modalInstance = $modal.open({
                templateUrl: 'editGateway.html',
                controller: 'editGatewayCtrl',
                resolve: {
                    gateway: function () {
                        return gateway;
                    }
                }
            }).result.then(function (result) {
            }, function () {
                // Cancel
            });
        }
        $scope.viewGatewayDetail = function (gateway) {
            var modalInstance = $modal.open({
                templateUrl: 'viewGatewayDetail.html',
                controller: 'viewGatewayDetailCtrl',
                resolve: {
                    gateway: function () {
                        return gateway;
                    }
                }
            }).result.then(function (result) {
            }, function () {
                // Cancel
            });
        }
        $scope.deleteGateway = function (gateway) {
            Alertify.confirm('Are you sure to delete this gateway ?').then(
                function onOk() {
                    Restservice.delete('api/Gateway/' + gateway.Id, function (err, response) {
                        if (!err) {
                            console.log("[Info]:: Delete Gateway  response ", response);
                            Alertify.success("Gateway Deleted successfully");
                            $scope.getAllGateway();
                        }
                        else {
                            console.log("[Error]:: Delete Gateway response ", err);
                            Alertify.error("Error in deleting gateway");
                        }
                    });
                },
                function onCancel() {

                }
            );


            
        }
        $scope.addSensorGroup = function () {
            var modalInstance = $modal.open({
                templateUrl: 'SensorGroupModal.html',
                controller: 'SensorGroupModalCtrl',
            }).result.then(function (result) {
                //$scope.getAllSensorGroup();
                console.log(result);
            }, function () {
                //$scope.getAllSensorGroup();
            });
        }
        $scope.addSensorToGroupPopUp = function (group) {
            var modalInstance = $modal.open({
                templateUrl: 'addSensorToGroupModal.html',
                controller: 'addSensorToGroupModalCtrl',
                resolve: {
                    group: function () {
                        return group;
                    }
                }
            }).result.then(function (result) {
                $scope.getAllSensorGroup();
            }, function () {
                $scope.getAllSensorGroup();
            });
        }
        $scope.removeSensorToGroupPopUp = function (group) {
            var modalInstance = $modal.open({
                templateUrl: 'removeSensorToGroupModal.html',
                controller: 'removeSensorToGroupModalCtrl',
                resolve: {
                    group: function () {
                        return group;
                    }
                }
            }).result.then(function (result) {
                $scope.getAllSensorGroup();
            }, function () {
                $scope.getAllSensorGroup();
            });
        }
        $scope.deleteGroup = function (group) {

            Alertify.confirm('Are you sure to delete this group ?').then(
                function onOk() {

                    $scope.loader = "block";
                    Restservice.delete('api/SensorGroup/' + group.Id, function (err, response) {

                        if (!err) {
                            $scope.loader = "none";
                            console.log("[Info]:: Delete SensorGroup  response ", response);
                            Alertify.success("Group Deleted successfully");
                            $scope.getAllSensorGroup();
                        }
                        else {
                            console.log("[Error]:: Delete SensorGroup  response ", err);
                            Alertify.error("Error in Deleting Group");
                            $scope.loader = "none";
                        }
                    });
                },
                function onCancel() {

                }
            );


        }

        $scope.detachSensorGroup = function (group) {
            Alertify.confirm('Are you sure to detach all sensor ?').then(
                function onOk() {

                    $scope.loader = "block";
                    Restservice.put('api/DetachSensors/' + group.Id, null, function (err, response) {
                        $scope.loader = "none";
                        if (!err) {
                            Alertify.success("Sensor detached successfully");
                            console.log("[Info]:: Detach Sensor response ", response);
                        }
                        else {
                            console.log("[Error]:: Detach Sensor response ", err);
                            Alertify.error("Error in detaching sensor");
                        }
                    });
                },
                function onCancel() {

                }
            );


          
        }

    });
angular.module('assetmonitoringApp').controller('SensorModalCtrl', function ($scope, DTOptionsBuilder, $modalInstance, $http, $modal, Restservice, Alertify) {
    $scope.sensor = { 'SensorTypeId': '' };
    $scope.getAllSensorType = function () {
        Restservice.get('api/SensorType', function (err, response) {
            if (!err) {
                console.log("[Info]:: Get SensorType list response ", response);
                $scope.sensorTypeList = response;
            }
            else {
                console.log("[Error]:: Get SensorType list response ", err);
            }
        });
    }
    $scope.getAllSensorType();
    $scope.getAllSensorGroup = function () {
        Restservice.get('api/SensorGroup', function (err, response) {
            if (!err) {
                console.log("[Info]:: Get SensorGroup list response ", response);
                $scope.sensorGroupList = response;
            }
            else {
                console.log("[Error]:: Get SensorGroup list response ", err);
            }
        });
    }
    $scope.getAllSensorGroup();
    $scope.addNewSensorTypePopup = function () {
        var modalInstance = $modal.open({
            templateUrl: 'AddNewSensorTypeModal.html',
            controller: 'AddNewSensorTypeModalCtrl',

        }).result.then(function (result) {
            $scope.getAllSensorType();
        }, function () {
            $scope.getAllSensorType();
        });

    }
    $scope.ok = function () {

        if ($scope.sensor.SensorKey && $scope.sensor.SensorTypeId && $scope.sensor.Name) {
            $scope.loader = "block";
            Restservice.post('api/Sensor', $scope.sensor, function (err, response) {
                if (!err) {
                    console.log("[Info] :: Add Sensor ", response);
                    Alertify.success("Sensor added successfully");
                    $modalInstance.close($scope.sensor);
                }
                else {
                    console.log("[Error] :: Add Sensor ", err);
                    if (err.data){
                        Alertify.error(err.data.Message);
                    }
                    else {
                        Alertify.error("Error in adding sensor");
                    }
                    
                    $modalInstance.close();
                }
                $scope.loader = "none";
                
            });

        }
        else {
            console.log("[Error] :: Enter All Sensor Information ");
            Alertify.error("[Error] :: Enter All Sensor Information ");
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


angular.module('assetmonitoringApp').controller('editSensorCtrl', function ($scope, DTOptionsBuilder, $modalInstance, $http, $modal, Restservice, sensor, Alertify) {
    $scope.sensor = sensor;
    $scope.getAllSensorGroup = function () {
        Restservice.get('api/SensorGroup', function (err, response) {
            if (!err) {
                console.log("[Info]:: Get SensorGroup list response ", response);
                $scope.sensorGroupList = response;
            }
            else {
                console.log("[Error]:: Get SensorGroup list response ", err);
            }
        });
    }
    $scope.getAllSensorGroup();
    $scope.ok = function () {
        $scope.loader = "block";
        Restservice.put('api/Sensor', $scope.sensor, function (err, response) {
            $scope.loader = "none";
            if (!err) {
                console.log("[Info] :: Update Sensor ", response);
                Alertify.success("Sensor Updated Successfully");
            }
            else {
                console.log("[Error] :: Update Sensor ", err);
                Alertify.error("Error in sensor update");
            }
            $modalInstance.close();
        });

    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});

angular.module('assetmonitoringApp').controller('viewSensorDetailCtrl', function ($scope, DTOptionsBuilder, $modalInstance, $http, $modal, Restservice, sensor, Alertify) {
    $scope.sensor = sensor;
    console.log("Here");
    console.log("$scope.sensor", $scope.sensor);
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});
angular.module('assetmonitoringApp').controller('GatewayModalCtrl', function ($scope, DTOptionsBuilder, $modalInstance, $http, $modal, Restservice, Alertify) {
    $scope.gateway = {};
    $scope.addNewSensorTypePopup = function () {
        var modalInstance = $modal.open({
            templateUrl: 'AddNewSensorTypeModal.html',
            controller: 'AddNewSensorTypeModalCtrl',

        }).result.then(function (result) {
        }, function () {
        });

    }
    $scope.ok = function () {
        if ($scope.gateway.GatewayKey && $scope.gateway.Name) {
            $scope.loader = "block";
            Restservice.post('api/Gateway', $scope.gateway, function (err, response) {
                $scope.loader = "none";
                if (!err) {
                    console.log("[Info] :: Add Gateway ", response);
                    Alertify.success("Gateway added");
                    $modalInstance.close($scope.gateway);
                }
                else {
                    console.log("[Error] :: Add Gateway ", err);
                    

                    if (err.data) {
                        Alertify.error(err.data.Message);
                    }
                    else {
                        Alertify.error(" Error in adding gateway");
                    }

                    $modalInstance.close();
                }
                
            });
            
        }
        else {
            console.log("[Error] :: Enter All Gateway Information ");
            Alertify.error(" Enter All Gateway Information ");
        }


    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});

angular.module('assetmonitoringApp').controller('editGatewayCtrl', function ($scope, DTOptionsBuilder, $modalInstance, $http, $modal, Restservice, gateway, Alertify) {
    $scope.gateway = gateway;
   
    $scope.ok = function () {
        $scope.loader = "block";
        Restservice.put('api/Gateway', $scope.gateway, function (err, response) {
            $scope.loader = "none";
            if (!err) {
                console.log("[Info] :: Update Gateway ", response);
                Alertify.success("Gateway Updated Successfully");
            }
            else {
                console.log("[Error] :: Update Sensor ", err);
                Alertify.error("Error in Gateway update");
            }
            $modalInstance.close();
        });

    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});
angular.module('assetmonitoringApp').controller('viewGatewayDetailCtrl', function ($scope, DTOptionsBuilder, $modalInstance, $http, $modal, Restservice, gateway, Alertify) {
    $scope.gateway = gateway;
    console.log("Here");
    console.log("$scope.sensor", $scope.sensor);

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});
angular.module('assetmonitoringApp').controller('AddNewSensorTypeModalCtrl', function ($scope, DTOptionsBuilder, $modalInstance, $http, $modal, Restservice, Alertify) {
    $scope.sensortype = {};
    $scope.capabilities = { 'selected': [] };
    $scope.capabilityList = [
    ];


    $scope.getAllCapabilites = function () {
        Restservice.get('api/Capability', function (err, response) {
            if (!err) {
                console.log("[Info]:: Get Capability list response ", response);
                $scope.capabilityList = response;
            }
            else {
                console.log("[Error]:: Get Capability list response ", err);
            }
        });
    }
    $scope.getAllCapabilites();
    $scope.addNewCapabilityPopup = function () {
        var modalInstance = $modal.open({
            templateUrl: 'AddNewCapabilityModal.html',
            controller: 'AddNewCapabilityModalCtrl',

        }).result.then(function (result) {
            $scope.getAllCapabilites();
        }, function () {
            $scope.getAllCapabilites();
        });

    }

    $scope.ok = function () {
        if ($scope.sensortype.Name && $scope.capabilities.selected.length > 0) {
            $scope.loader = "block";
            $scope.sensortype.CapabilityIds = $scope.capabilities.selected;
            Restservice.post('api/SensorType', $scope.sensortype, function (err, response) {
                if (!err) {
                    console.log("[Info] :: Add SensorType ", response);
                    Alertify.success("Sensor Type Added");
                }
                else {
                    console.log("[Error] :: Add SensorType ", err);
                    Alertify.error("Error in adding sensor type");
                }
                $scope.loader = "none";
                $modalInstance.close();
            });

        }
        else {
            console.log("[Error] :: Enter All SensorType Information ");
            Alertify.error("[Error] :: Enter All SensorType Information");

        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});
angular.module('assetmonitoringApp').controller('AddNewCapabilityModalCtrl', function ($scope, DTOptionsBuilder, $modalInstance, $http, $modal, Restservice) {
    $scope.capability = {}

    $scope.ok = function () {
        if ($scope.capability.Name) {
            Restservice.post('api/Capability', $scope.capability, function (err, response) {
                if (!err) {
                    console.log("[Info] :: Add Capability ", response);
                }
                else {
                    console.log("[Error] :: Add Capability ", err);
                }
                $modalInstance.close();
            });

        }
        else {
            console.log("[Error] :: Enter All Capability Information ", $scope.capability);
            $modalInstance.close();
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});

angular.module('assetmonitoringApp').controller('addSensorToGroupModalCtrl', function ($scope, DTOptionsBuilder, $modalInstance, $http, $modal, Restservice, group) {
    $scope.group = group;
    $scope.group.addSensorList = [];
    $scope.getGroupDetails = function () {
        Restservice.get('api/SensorGroup/' + $scope.group.Id, function (err, response) {
            if (!err) {
                console.log("[Info]:: Get SensorGroup Detail response ", response);
                $scope.group.sensorList = response.Sensors;
            }
            else {
                console.log("[Error]:: Get SensorGroup Detail response ", err);
            }
        });
    }
    $scope.getGroupDetails();


    $scope.getUnmappedSensor = function () {
        Restservice.get('api/GetAllUnmappedSensors', function (err, response) {
            if (!err) {
                console.log("[Info]:: Get Unmapped Sensors", response);
                $scope.unmappedSensors = response;
            }
            else {
                console.log("[Error]:: Get Unmapped Sensors ", err);
            }
        });
    }
    $scope.getUnmappedSensor();
    $scope.ok = function () {
        if ($scope.group.addSensorList.length > 0) {
            $scope.group.SensorIds = $scope.group.SensorIds.concat($scope.group.addSensorList);
            console.log($scope.group);
            Restservice.put('api/SensorGroup', $scope.group, function (err, response) {
                if (!err) {
                    console.log("[Info] :: Update SensorGroup ", response);
                }
                else {
                    console.log("[Error] :: Update SensorGroup ", err);
                }
                $modalInstance.close();
            });

        }
        else {
            console.log("[Info] :: Please Select the Sensors ");
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});



angular.module('assetmonitoringApp').controller('removeSensorToGroupModalCtrl', function ($scope, DTOptionsBuilder, $modalInstance, $http, $modal, Restservice, group) {
    $scope.group = group;
    $scope.group.SensorIds = [];
    $scope.group.removeSensorList = [];
    $scope.getGroupDetails = function () {
        Restservice.get('api/SensorGroup/' + $scope.group.Id, function (err, response) {
            if (!err) {
                console.log("[Info]:: Get SensorGroup Detail response ", response);
                $scope.group.sensorList = response.Sensors;
            }
            else {
                console.log("[Error]:: Get SensorGroup Detail response ", err);
            }
        });
    }
    $scope.getGroupDetails();
    $scope.ok = function () {
        if ($scope.group.removeSensorList.length > 0) {
            for (var i = 0; i < $scope.group.removeSensorList.length; i++) {
                var index = $scope.group.SensorIds.indexOf($scope.group.removeSensorList[i]);
                if (index > -1) {
                    $scope.group.SensorIds.splice(index, 1);
                }
            }
            Restservice.put('api/SensorGroup', $scope.group, function (err, response) {
                if (!err) {
                    console.log("[Info] :: Update SensorGroup ", response);
                }
                else {
                    console.log("[Error] :: Update SensorGroup ", err);
                }
                $modalInstance.close();
            });

        }
        else {
            console.log("[Info] :: Please Select the Sensors ", response);
        }

    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});

angular.module('assetmonitoringApp').controller('configureUnitModalCtrl', function ($scope, DTOptionsBuilder, $modalInstance, $http, $modal, Restservice, Alertify) {
    $scope.getCapibility = function () {
        Restservice.get('api/Capability', function (err, response) {
            if (!err) {
                console.log("[Info]:: Get Capability Detail response ", response);
                $scope.capabilityList = response;

            }
            else {
                console.log("[Error]:: Get Capability Detail response ", err);
            }
        });
    }
    $scope.getCapibility();
    $scope.ok = function () {
        console.log("$scope.capabilityList", $scope.capabilityList);
        Restservice.put('api/Capability', $scope.capabilityList, function (err, response) {
            $scope.loader = "none";
            if (!err) {
                Alertify.success("Unit Configure Successfully");
                console.log("[Info]::Unit Configure Successfully", response);
                $modalInstance.close();
            }
            else {
                console.log("[Error]:: Units not Configured ", err);
                Alertify.error("Units not Configured");
                $modalInstance.dismiss('cancel');
            }
        });

    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});