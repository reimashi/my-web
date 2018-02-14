'use strict';

angular.module('myApp.view_portfolio', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/portfolio', {
    templateUrl: 'views/portfolio/portfolio.html',
    controller: 'PortfolioCtrl',
      activeTab: 'portfolio'
  });
}])

.controller('PortfolioCtrl', [function() {

}]);