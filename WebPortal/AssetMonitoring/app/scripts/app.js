'use strict';

/**
 * @ngdoc overview
 * @name assetmonitoringApp
 * @description
 * # assetmonitoringApp
 *
 * Main module of the application.
 */
angular
  .module('assetmonitoringApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
      'ngTouch',
      'ui.router',
      'ui.bootstrap',
      'datatables',
      'ngMap',
      'Alertify'
  ])
    .config(function ($stateProvider, $routeProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: 'app/views/login.html',
                controller: 'loginCtrl',
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'app/views/dashboard.html',
                controller: 'dashboardCtrl',
            })
            .state('overview', {
                url: '/overview',
                parent: 'dashboard',
                templateUrl: './app/views/overview.html',
                controller: 'overviewCtrl'
            })
            .state('inventory', {
                url: '/inventory',
                parent: 'dashboard',
                templateUrl: './app/views/inventory.html',
                controller: 'inventoryCtrl'
            })
            .state('alerts', {
                url: '/alerts',
                parent: 'dashboard',
                templateUrl: './app/views/alerts.html',
                controller: 'alertCtrl'
                
            })
            .state('rules', {
                url: '/rules',
                parent: 'dashboard',
                templateUrl: './app/views/rules.html',
                controller: 'ruleCtrl'
            })
            .state('addrule', {
                url: '/addrule',
                parent: 'dashboard',
                templateUrl: './app/views/addRule.html',
                controller: 'addRuleCtrl'
            })
            .state('assets', {
                url: '/assets',
                parent: 'dashboard',
                templateUrl: './app/views/assets.html',
                controller: 'assetCtrl'
            })
            .state('reports', {
                url: '/reports',
                parent: 'dashboard',
                templateUrl: './app/views/reports.html',
                controller: 'reportCtrl'
            })
            .state('configuration', {
                url: '/configuration',
                parent: 'dashboard',
                templateUrl: './app/views/configuration.html',
                controller: 'configurationCtrl'
            });


    
    })
    .run(function ($http, $rootScope, config, $location, Token, $interval, Alertify) {
        $http.post($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/PowerBIService.asmx/updateConfig', null).then(function (data) {
            $http.get('config.json')
                .then(function (data, status, headers) {
                    config.update(data.data);

                })
                .catch(function (data, status, headers) {
                    console.log("[Error]:: Updating config", data);
                });
        }).catch(function (data) {
            console.log("[Error]:: Updating config", data);
        });
        updateAccessToken();
        /**
        * Function to update Access Token 
        */
        function updateAccessToken() {
            //update token if not available 
            if (Token.data.accesstoken == '')
                Token.update(function () { });
            $interval(function () {
                Token.update(function () { });
            }, 2400000);

        }   
       

        
        //var data = {
        //    'restServer': 'https://assetmonitoring.azurewebsites.net/',
        //    //'restServer': '   http://ajit-pc/AssetMonitoring/',
        //    'restServerAnalitics':'https://assetmonitoringanalytics.azurewebsites.net/',
        //    'b2cApplicationId': 'a2ecd455-5f2a-4329-adae-fe8eb438f53e',
        //    'tenantName': "AssetMonitoringB2C.onmicrosoft.com",
        //    'signInPolicyName': "B2C_1_SiUpIn",
        //    'redirect_uri':"https://assetmonitoringwebapp.azurewebsites.net/"
        //}

        //var data = {
        //    'restServer': 'https://assetdeployrestapi.azurewebsites.net/',
        //    //'restServer': '   http://ajit-pc/AssetMonitoring/',
        //    'restServerAnalitics': 'https://assetdeployanalyticsapi.azurewebsites.net/',
        //    'b2cApplicationId': 'bbb0712c-d475-42d3-bdcd-be974f64821f',
        //    'tenantName': "AssetMonitoringB2C.onmicrosoft.com",
        //    'signInPolicyName': "B2C_1_SiUpIn",
        //    'redirect_uri': "https://assetdeploywebapp.azurewebsites.net/"
        //}
        
        //config.update(data)

    })
