'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:loginCtrl
 * @description
 * # loginCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('loginCtrl', function (aadService, $scope, config, $timeout, $rootScope, $state, Restservice, applicationInsightsService) {

        var loginDisplayType = {
            PopUp: 'popup',
            None: 'none',
            Page: 'page'
        };
        var helloNetwork = {
            adB2CSignIn: 'adB2CSignIn',
            adB2CSignInSignUp: 'adB2CSignInSignUp',
            adB2CEditProfile: 'adB2CEditProfile'
        };

        //initiate all policies

        function online(session) {

            var currentTime = (new Date()).getTime() / 1000;
            return session && session.access_token && session.expires > currentTime;
        };
        /**
         * Function to sign in Azure B2C
         */
        $scope.signIn = function (state) {
            
            aadService.signIn(function (b2cSession) {
                if (!online(b2cSession) && state == 'click') {
                   
                    aadService.policyLogin(helloNetwork.adB2CSignIn, loginDisplayType.Page);
                }
                else if (online(b2cSession) && state == 'intial' || state == 'click') {
                    //getUserDetails();
                    //console.log("login");
                    //$state.go('overview');
                    $scope.loader = "block";
                    $scope.getUser();
                }
            });
        }
        $scope.showLogin = false;
        if (config.restServer != "" && config.restServer != undefined) {
            $timeout(function () {
                $rootScope.$broadcast('config-loaded');
            }, 1000);
        }
        //Once configuration is loaded it will broadcast an event 'config-loaded' which will load rest server url
        $rootScope.$on('config-loaded', function () {
           
            $scope.showLogin = true;
            if (config.restServer == "" || config.restServer == undefined) {
                $scope.showLogin = false;
                console.log("[Error] :: Config not loaded");
                applicationInsightsService.trackException("[Error] :: Config not loaded");

            }
            else {
                var script = document.createElement('script');
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('src', './app/scripts/aadb2c.js');
                document.head.appendChild(script);
                $scope.signIn('intial');
                $scope.showLogin = true;
            }
        });
        
        $scope.getUser = function () {
            Restservice.get('api/User', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get User Details ", response);
                    $scope.loader = "none";
                    $state.go('overview');
                }
                else {
                    console.log("[Error]:: Get User Details ", err);
                }
            });
        }
       
    
  });
