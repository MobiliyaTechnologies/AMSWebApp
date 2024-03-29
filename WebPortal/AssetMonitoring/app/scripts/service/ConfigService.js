﻿
angular.module('assetmonitoringApp')
    /**
    * @ngdoc Factory
    * @name Config
    * @description
    * # CSUWebApp
    *
    * Factory to store all the configuration
    */
    .factory('config', function ($http, $rootScope, $timeout) {
        var restServer, b2cApplicationId, adB2CSignIn, adB2CSignInSignUp;
        return {
            restServer: restServer,
            update: function (data) {
                console.log("[Info] :: Config Loaded ", data);
                this.restServer = data.restServer;
                this.restServerAnalytics = data.restServerAnalytics;
                this.b2cApplicationId = data.b2cApplicationId;
                this.tenantName = data.tenantName;
                this.signInPolicyName = data.signInPolicyName;
                this.signInSignUpPolicyName = data.signInSignUpPolicyName;
                this.editProfilePolicyName = data.editProfilePolicyName;
                this.nodeserver = data.nodeserver;
                this.redirect_uri = data.redirect_uri;

                localStorage.setItem("restServer", this.restServer);
                localStorage.setItem("restServerAnalytics", this.restServerAnalytics);
                localStorage.setItem("b2cApplicationId", this.b2cApplicationId);
                localStorage.setItem("tenantName", this.tenantName);
                localStorage.setItem("signInPolicyName", this.signInPolicyName);
                localStorage.setItem("signInSignUpPolicyName", this.signInSignUpPolicyName);
                localStorage.setItem("editProfilePolicyName", this.editProfilePolicyName);
                localStorage.setItem("redirect_uri", this.redirect_uri);
                localStorage.setItem("nodeserver", this.nodeserver);
                $timeout(function () {
                    $rootScope.$broadcast('config-loaded');
                }, 1000);

            }


        };
    })
    /**
    * @ngdoc Factory
    * @name AuthService 
    * @description
    * # CSUWebApp
    *
    * Factory to store all user related data
    */
    .factory('AuthService', function ($rootScope, $window) {
        this.userIsLoggedIn;
        this.username;
        return {
            setUser: function (aUser) {
                this.user = aUser;
                localStorage.setItem("userIsLoggedIn", aUser);
            },
            isLoggedIn: function () {
                this.userIsLoggedIn = localStorage.getItem('ARuserIsLoggedIn');
                return (this.userIsLoggedIn === 'true') ? true : false;
            },
            setData: function (data) {
                localStorage.setItem("userId", data.UserId);
                localStorage.setItem("UserName", data.FirstName);
                localStorage.setItem("LastName", data.LastName);
                localStorage.setItem("Email", data.Email);
                localStorage.setItem("Avatar", data.Avatar);
                localStorage.setItem("RoleId", data.RoleId);

            },
            getData: function () {
                var data = {};
                return
            },
            isAuthenticated: function () {
                return true;
            }
        };
    })
    /**
   * @ngdoc Factory
   * @name Token
   * @description
   * # CSUWebApp
   *
   * Factory to store and get access token require for Power BI 
   */
    .factory('Token', function ($http, $location, applicationInsightsService) {
        var data = {
            accesstoken: ''
        };
        return {
            data: data,
            update: function (callback) {
                $http({
                    url: $location.protocol() + '://' + $location.host() + ':' + $location.port() + "/PowerBIService.asmx/GetAccessToken",
                    method: 'GET'

                }).then(function (response) {
                    if (response.data.tokens) {
                        if (response.data.tokens.AccessToken) {
                            data.accesstoken = response.data.tokens.AccessToken;
                        }
                        else {
                            console.log("[Error] Please Update Power Bi credentials");
                        }
                    }
                    else {
                        console.log("[Error] Please Update Power Bi credentials");
                    }
                    callback();

                })
                    .catch(function (error) {
                        console.log("Token Error :: " + error);
                        applicationInsightsService.trackException(error);
                    });
            }


        };
    });
