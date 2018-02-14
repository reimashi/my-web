'use strict';

angular.module('myApp.view_curriculum', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/curriculum', {
    templateUrl: 'docs/curriculum.md',
    controller: 'CurriculumCtrl',
      activeTab: 'curriculum'
  });
}])

.controller('CurriculumCtrl', [function() {

}]);