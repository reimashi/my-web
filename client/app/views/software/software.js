'use strict';

angular.module('myApp.view_software', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/software', {
    templateUrl: 'views/software/software.html',
    controller: 'SoftwareCtrl',
      activeTab: 'software'
  });
}])

.controller('SoftwareCtrl', ["$scope", "$rootScope", "$http", function($scope, $rootScope, $http) {
    $scope.error = false;
    $scope.loading = false;
    $scope.repositories = [];

    if ($rootScope.repoCache) {
        $scope.repositories = $rootScope.repoCache;
    }
    else {
        $scope.loading = true;
        $http.get("/github/")
            .then(function(repos) {
                $scope.repositories = repos.data;
                $rootScope.repoCache = $scope.repositories;
                $scope.loading = false;
                $scope.error = false;
            })
            .catch(function(repos) {
                $scope.loading = false;
                $scope.error = String(repos);
            });
    }
}]);