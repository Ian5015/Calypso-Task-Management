'use strict';

var getList = angular.module('getList', []); // Taking Angular Application in Javascript Variable

// Below is the code to allow cross domain request from web server through angular.js
myApp.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

/* Controllers */

function UserListCtrl($scope, $http, $templateCache) {	

  $scope.list = function() {
	  var url = 'http://localhost:8080/getangularusers';// URL where the Node.js server is running	
	  $http.get(url).success(function(data) {
		$scope.users = data;
	  });
          // Accessing the Angular $http Service to get data via REST Communication from Node Server 
  };

  $scope.list();
}