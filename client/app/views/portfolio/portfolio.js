'use strict';

angular.module('myApp.view_portfolio', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/portfolio', {
    templateUrl: 'views/portfolio/portfolio.html',
    controller: 'PortfolioCtrl',
      activeTab: 'portfolio'
  });
}])

.controller('PortfolioCtrl', ["$scope", function($scope) {
  $scope.portfolio = [
      { name: "Historia de la Informática en Galicia", description: "Wiki sobre la historia de la computación y la informática, en Galicia y en el mundo, desde el inicio de los tiempos hasta la actualidad.", company: "Universidad de Vigo, CPEIG", year: "2018", image: "portfolio_hinformatica.min.jpg", url: "http://historiainformatica.gal" },
      { name: "Muebles FyM", description: "Antigua web corporativa y tienda online.", company: "Muebles FyM", place: "Ourense", year: "2012", image: "portfolio_fym.min.jpg" },
      { name: "Kichos", description: "Web corporativa de tienda de golosinas y regalos.", company: "Kichos", place: "O Carballiño, Ourense", year: "2012", image: "portfolio_kichos.min.jpg" },
      { name: "Kalkulos", description: "Backend y generador para web de horoscopos online.", company: "Privado", year: "2012", image: "portfolio_kalkulos.min.jpg" },
      { name: "Formularios CSIF", description: "Formularios de inscripción para multiples cursos de formación, accesibles desde su web.", company: "CSIF", place: "Pontevedra", year: "2012", image: "portfolio_csif.min.jpg" }
    ];

  $scope.gallery = $scope.portfolio[0];

  $scope.openGallery = function(ind) {
      $scope.gallery = $scope.portfolio[ind];
  };

    $scope.nextGallery = function() {
        let index = $scope.portfolio.indexOf($scope.gallery) - 1;
        if (index < 0) index = $scope.portfolio.length - 1;
        $scope.openGallery(index);
    };

    $scope.backGallery = function() {
        let index = $scope.portfolio.indexOf($scope.gallery) + 1;
        if (index >= $scope.portfolio.length) index = 0;
        $scope.openGallery(index);
    };
}]);