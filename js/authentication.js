var module = angular.module('authentication',[]);
module.controller('RegCntrl',['$scope','$http',function($scope,$http){
 $scope.register = function()
 {
   $scope.openModal = true;
   var dataToServer = {password:$scope.user.password,email:$scope.user.email,businessType:$scope.typeOfIndv};
   $http({
       method : 'post',
       data: angular.toJson(dataToServer),
       url: 'https://0ff8a7a9.ngrok.io/users/create',
  }).then(function(data){console.log(data);});
 };
}]);
module.controller('AuthCntrl',['$scope','$http',function($scope,$http){
  $scope.authorize = function(){
    var dataToServer = {email:$scope.user.email,password:$scope.user.password};
    $http({
        method : 'post',
        url: 'https://0ff8a7a9.ngrok.io/users/auth',
        data: angular.toJson(dataToServer),
        withCredentials : true,
        dataType : 'json',
   }).then(function(data) {
     window.location = '/#!home';
   });
  }
}]);
