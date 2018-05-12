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
        $http.get("/repos/")
            .then(function(repos) {
                for (var i in repos.data.Repositories) {
                    switch (String(repos.data.Repositories[i].Language).toLowerCase()) {
                        case "c": repos.data.Repositories[i].devicon = "devicon-c-plain"; break;
                        case "c++": repos.data.Repositories[i].devicon = "devicon-cplusplus-plain"; break;
                        case "php": repos.data.Repositories[i].devicon = "devicon-php-plain"; break;
                        case "javascript": repos.data.Repositories[i].devicon = "devicon-javascript-plain"; break;
                        case "bison": break;
                        case "cuda": break;
                        case "c#": repos.data.Repositories[i].devicon = "devicon-csharp-plain"; break;
                        case "java": repos.data.Repositories[i].devicon = "devicon-java-plain"; break;
                        case "go": repos.data.Repositories[i].devicon = "devicon-go-plain"; break;
                        case "dart": break;
                        case "shell": break;
                        case "typescript": repos.data.Repositories[i].devicon = "devicon-typescript-plain"; break;
                        case "python": repos.data.Repositories[i].devicon = "devicon-python-plain"; break;
                        case "kotlin": break;
                        case "swift": repos.data.Repositories[i].devicon = "devicon-swift-plain"; break;
                        case "rust": break;
                        case "objectivec": break;
                        case "assembly": break;
                        case "ruby": repos.data.Repositories[i].devicon = "devicon-ruby-plain"; break;
                        case "r": break;
                        case "perl": break;
                        case "matlab": break;
                        case "scala": break;
                        case "groovy": break;
                        case "coffescript": repos.data.Repositories[i].devicon = "devicon-coffeescript-plain"; break;
                        case "lua": break;
                    }
                    switch (String(repos.data.Repositories[i].Host).toLowerCase()) {
                        case "github": repos.data.Repositories[i].HostIcon = "devicon-github-plain"; break;
                        case "gitlab": repos.data.Repositories[i].HostIcon = "devicon-gitlab-plain"; break;
                        case "bitbucket": repos.data.Repositories[i].HostIcon = "devicon-bitbucket-plain"; break;
                    }
                }
                $scope.repositories = repos.data.Repositories;
                $rootScope.repoCache = $scope.repositories;
                $scope.loading = false;
                $scope.error = repos.data.Errors;
            })
            .catch(function(repos) {
                $scope.loading = false;
                $scope.error = String(repos);
            });
    }
}]);