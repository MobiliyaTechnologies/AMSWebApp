/**
    * @ngdoc Factory
    * @name Restservice
    * @description
    * # assetmonitoringApp
    *
    * A common service to make rest call 
    */
angular.module('assetmonitoringApp')
    .factory('Restservice', function ($http, $state, config, applicationInsightsService) {
        return {
            get: function (urlpath, callback) {
                var authResponse = hello('adB2CSignIn').getAuthResponse();
                if (authResponse != null) {
                    $http({
                        url: config.restServer + urlpath,
                        dataType: 'json',
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": authResponse.token_type + ' ' + authResponse.access_token,
                            "Access-Control-Allow-Origin": "*"
                        }
                    }).then(function (response) {
                        callback(null, response.data);

                    })
                        .catch(function (error) {
                            error.name = error.statusText;
                            error.message = error.data;
                            applicationInsightsService.trackException(error);
                            callback(error, null);
                        });
                }
                else {
                    console.log("Please login");
                    $state.go('login');
                }
            },
            post: function (urlpath, data, callback) {
                var authResponse = hello('adB2CSignIn').getAuthResponse();
                if (authResponse != null) {
                    $http({
                        url: config.restServer  + urlpath,
                        dataType: 'json',
                        method: 'POST',
                        data: data,
                        headers: {
                            "Content-Type": "application/json",
                           "Authorization": authResponse.token_type + ' ' + authResponse.access_token,
                        }
                    }).then(function (response) {
                        callback(null, response);

                    })
                        .catch(function (error) {
                            error.name = error.statusText;
                            error.message = error.data;
                            applicationInsightsService.trackException(error);
                            callback(error, null);
                        });
                }
                else {
                    console.log("Please login");
                    $state.go('login');
                }
            },
            put: function (urlpath, data, callback) {
                var authResponse = hello('adB2CSignIn').getAuthResponse();
                if (authResponse != null) {
                    $http({
                        url: config.restServer + urlpath,
                        dataType: 'json',
                        method: 'PUT',
                        data: data,
                        headers: {
                            "Content-Type": "application/json",
                           "Authorization": authResponse.token_type + ' ' + authResponse.access_token,
                        }
                    }).then(function (response) {
                        callback(null, response);

                    })
                        .catch(function (error) {
                            error.name = error.statusText;
                            error.message = error.data;
                            applicationInsightsService.trackException(error);
                            callback(error, null);
                        });
                }
                else {
                    console.log("Please login");
                    $state.go('login');
                }
            },
            delete: function (urlpath, callback) {
                var authResponse = hello('adB2CSignIn').getAuthResponse();
                if (authResponse != null) {
                    $http({
                        url: config.restServer + urlpath,
                        method: 'DELETE',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": authResponse.token_type + ' ' + authResponse.access_token,
                        }
                    }).then(function (response) {
                        callback(null, response);

                    })
                        .catch(function (error) {
                            error.name = error.statusText;
                            error.message = error.data;
                            applicationInsightsService.trackException(error);
                            callback(error, null);
                        });
                }
                else {
                    console.log("Please login");
                    $state.go('login');
                }
            },
            posta: function (urlpath, data, callback) {
                var authResponse = hello('adB2CSignIn').getAuthResponse();
                if (authResponse != null) {
                    $http({
                        url: config.restServerAnalytics + urlpath,
                        dataType: 'json',
                        method: 'POST',
                        data: data,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": authResponse.token_type + ' ' + authResponse.access_token,
                        }
                    }).then(function (response) {
                        callback(null, response);

                    })
                        .catch(function (error) {
                            error.name = error.statusText;
                            error.message = error.data;
                            applicationInsightsService.trackException(error);
                            callback(error, null);
                        });
                }
                else {
                    console.log("Please login");
                    $state.go('login');
                }
            }
        };

    })