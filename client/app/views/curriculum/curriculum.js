'use strict';

angular.module('myApp.view_curriculum', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/curriculum', {
    templateUrl: 'views/curriculum/curriculum.html',
    controller: 'CurriculumCtrl',
      activeTab: 'curriculum'
  });
}])

.controller('CurriculumCtrl', ["$scope", function($scope) {
    $scope.experience = [
        { from: Date.parse("2012/01/01"), to: Date.parse("2012/07/01"), company: "Shoppu Informática, tienda de informática", job: "Socio fundador, dependiente, desarrollador web" },
        { from: Date.parse("2011/02/01"), to: Date.parse("2011/09/01"), company: "Asociación de Mulleres Rurais de Galicia", job: "Profesor de iniciación a la informática" },
        { from: Date.parse("2011/03/01"), to: Date.parse("2011/06/01"), company: "Universidad de Vigo", job: "Becario en administración de sistemas", url: "http://www.uvigo.es" },
        { from: Date.parse("2015/01/01"), to: Date.parse("2015/05/01"), company: "OpenHost S.L.", job: "Desarrollador web (PHP, Symphony)", url: "http://openhost.es" },
        { from: Date.parse("2015/11/01"), to: Date.parse("2016/06/01"), company: "Ziblec Software S.L.", job: "Desarrollador web (PHP, NodeJS)", url: "http://ziblec.com" },
        { from: Date.parse("2017/09/01"), to: Date.parse("2018/05/01"), company: "Autónomo", job: "Desarrollador web (PHP, NodeJS, Dart)", url: "http://aitorgf.com" },
    ];
    $scope.qualifications = [
        { from: Date.parse("2009/09/01"), to: Date.parse("2011/06/01"), school: "CFP A Carballeira (Ourense)", title: "FP Superior en Desarrollo de Aplicaciones Informáticas" },
        { from: Date.parse("2011/09/01"), to: Date.parse("2016/06/01"), school: "Universidad de Vigo", title: "Grado en Ingeniería Informática", url: "http://esei.uvigo.es" },
        { from: Date.parse("2016/09/01"), to: Date.parse("2018/06/01"), school: "Universidad de Vigo", title: "Master en Ingeniería Informática", url: "http://master.enxeñeriainformatica.es" }
    ];
    $scope.certifications = [
        { from: Date.parse("2007/06"), to: Date.parse("2007/08"), school: "INEM (Instituto Nacional de Empleo)", title: "Técnico de socorrismo acuático y primeros auxilios" }
    ];
    $scope.languages = [
        { level: 100, name: "Español", certifications: ["Nativo"] },
        { level: 100, name: "Galego", certifications: ["Nativo"] },
        { level: 50, name: "English", certifications: ["B1 (Escuela Oficial Idiomas)"] },
    ];
    $scope.hobbies = [
        { name: "Colaborador en proyectos de software", url: "" },
        { name: "Electrónica y mecánica" },
        { name: "Tiro con arco" }
    ];
    $scope.aptitudes = ["Javascript", "Typescript", "DartLang", "GoLang", "NodeJS", "PHP", "Java", "C++",
    "HTML5/CSS3", "Less", "C#", ".Net/Mono", "Docker", "Kubernetes", "Blockchain", "MongoDB", "MySQL/MariaDB",
    "Redis", "PL/SQL", "WebSocket", "Qt", "Symfony", "Arduino", "IoT", "Redes distribidas", "Redes P2P"]
}]);