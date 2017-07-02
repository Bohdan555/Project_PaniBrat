var module = angular.module('authentication',[]);
module.controller('RegCntrl',['$scope','$http',function($scope,$http){
 $scope.register = function()
 {
   $scope.openModal = true;
   var dataToServer = {password:$scope.user.password,email:$scope.user.email,businessType:$scope.typeOfIndv};
   $http({
       method : 'post',
       url: 'http://3971ac69.ngrok.io/users/create',
       data: angular.toJson(dataToServer),
       success : function(data, textStatus, xhr) {        
     }
  });
 };
}]);
module.controller('AuthCntrl',['$scope','$http',function($scope,$http){
  $scope.authorize = function(){
    var dataToServer = {email:$scope.user.email,password:$scope.user.password};
    console.log(dataToServer);
    $http({
        method : 'post',
        url: 'http://3971ac69.ngrok.io/users/create',
        data: angular.toJson(dataToServer),
        success : function(data, textStatus, xhr) {
      }
   });
  }
}]);
