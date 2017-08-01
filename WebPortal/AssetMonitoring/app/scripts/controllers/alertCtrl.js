'use strict';

/**
 * @ngdoc function
 * @name assetmonitoringApp.controller:alertCtrl
 * @description
 * # alertCtrl
 * Controller of the assetmonitoringApp
 */
angular.module('assetmonitoringApp')
    .controller('alertCtrl', function (Restservice, $scope, DTOptionsBuilder, DTColumnBuilder, config) {
        $scope.alerts_loading_label = false;
        var myEl = angular.element(document.querySelector('#alerts-datatable-loader'));
        myEl.css('display', 'block');
        Restservice.get('api/Alert', function (err, response) {
            if (!err) {
                console.log("[Info]:: Get Alert list response ", response);
                $scope.alertList = response;
                myEl.css('display', 'none');
                if ($scope.alertList.length == 0) {
                    $scope.alerts_loading_label = true;
                }
            }
            else {
                console.log("[Error]:: Get Alert list response ", err);
            }
        });
       

        //$scope.dtColumns = [
        //    //here We will add .withOption('name','column_name') for send column name to the server 
        //    DTColumnBuilder.newColumn("Capability", "Capability").withOption('name', 'Capability'),
        //    //DTColumnBuilder.newColumn("CompanyName", "Company Name").withOption('name', 'CompanyName'),
        //    //DTColumnBuilder.newColumn("ContactName", "Contact Name").withOption('name', 'ContactName'),
        //    //DTColumnBuilder.newColumn("Phone", "Phone").withOption('name', 'Phone'),
        //    //DTColumnBuilder.newColumn("City", "City").withOption('name', 'City')
        //]
        //var authResponse = hello('adB2CSignIn').getAuthResponse();
        //$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
        //    dataSrc: "data",
        //    url: config.restServer +'api/Alert',
        //    type: "GET",
        //    headers: {
        //        "Content-Type": "application/json",
        //        "Authorization": authResponse.token_type + ' ' + authResponse.access_token,
        //        "Access-Control-Allow-Origin": "*"
        //    }
        //})
        //    .withOption('processing', true) //for show progress bar
        //    .withOption('serverSide', true) // for server side processing

        //    .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
        //    .withDisplayLength(1) // Page size
        //    .withOption('aaSorting', [0, 'asc']) // for default sorting column // here 0 means first column
    });
