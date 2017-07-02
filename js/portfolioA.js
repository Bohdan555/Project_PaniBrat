var module = angular.module('portfolio',['Mydropzone','slick','ngAnimate','ui.bootstrap','ui.bootstrap.tpls','ngRoute']);
module.config(['$routeProvider',function($routeProvider){
  $routeProvider.when('/home',{
    templateUrl : 'views/home.html'
  }).when('/deals/inProgress',{
    templateUrl:'views/dealsInProgress.html'
  }).when('/deals/dealsForYou',{
    templateUrl:'views/dealsForYou.html'
  }).when('/search',{
    templateUrl:'views/search.html'
  });
}]);
module.controller('offersList',['$scope','$uibModal','$http',function($scope,$uibModal,$http){
  $scope.currentPage = 1;
  $scope.pageSize = 3;
  $http({
      method : 'get',
      url: 'https://0ff8a7a9.ngrok.io/testgetoffer',//'http://193.33.64.97:8083/testgetoffer',
  }).then(function(data){$scope.offers = data.data;});
  $scope.resetSlick = true;
  $scope.open = function(size)
    {
      $scope.resetSlick = false;
      var modalInstance = $uibModal.open({
      template: '<div class="container"'+
      '<div class="row">'+
        '<div class="col-md-7 col-md-offset-1 addPortfolioHeader">'+
          '<h3> Додати Пропозицію</h3> '+
        '</div> '+
      '</div>'+
        '<div class="row">'+
          '<div class="col-md-3 col-md-offset-1 divForImage">'+
            '<div drop-zone ng-model="data.upload" class="one">'+
              '<p>Drop files here <span>(or click to upload)</span></p>'+
            '</div>'+
            '<div class="portfImage">'+
              '<img ng-repeat="file in data.upload" src="{{file.data}}" />'+
            '</div>'+
          '</div>'+
          '<div class="col-md-5  imageInfo">'+
              '<div> <span>Натисніть на кватрат, щоб додати фотографію своєї роботи у форматі .jpg або .png</span> </div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="row">'+
        '<div class="form-group form-group-sm col-md-8 col-md-offset-1 headerOfOffer">'+
          '<label class="col-md-2 control-label myLabel1" for="formGroupInputSmall">Назва пропозиції</label>'+
            '<div class="col-md-3">'+
              '<input class="form-control" type="text" ng-model="headerOfOffer" id="formGroupInputSmall" placeholder="Назва">'+
            '</div>'+
         '</div>'+
         '</div>'+
         '<div class="row">'+
            '<div class="form-group myGroup col-md-5 col-md-offset-1 TypeOfOffer">'+
              '<label for="exampleSelect1">Категория</label>'+
              '<select class="form-control" id="exampleSelect1" ng-model="selCat" ng-change="categorySel()">'+
                '<option ng-repeat="offer in typeOfoffer">{{offer}}</option>'+
              '</select>'+
            '</div>'+
          '</div>'+
        '<div class="row">'+
        '<div class="form-group col-md-5 myGroup col-md-offset-1 SubTypeOfOffer">'+
          '<label for="exampleSelect1">Подкатегория</label>'+
          '<select class="form-control" id="exampleSelect1" ng-model="subCat">'+
            '<option ng-repeat="subOffer in offerSubcatFiltered">{{subOffer}}</option>'+
          '</select>'+
        '</div>'+
       '</div>'+
      '<div class="row">'+
        '<div class="col-md-8 col-md-offset-1 imageDescr">'+
          '<h3>Опис роботи (до 15 слів)</h3>'+
          '<textarea ng-model="descrOfNewOffer" name="name" rows="8" cols="65"> </textarea>'+
        '</div>'+
      '</div>'+
      '<div class="row">'+
          '<div class="col-md-7 col-md-offset-1 addPortfolioButtons">'+
            '<ul class="list-inline">'+
              '<li> <button ng-click="closeMod()" class="btn"><span>Скасувати</span></button> </li>'+
              '<li class="pull-right"> <button ng-click="savePortf()" class="btn"><span>Зберегти</span></button> </li>'+
            '</ul>'+
          '</div>'+
      '</div>'+
      '</div> </div>',
      controller: 'CreateOfferModule',
      size: size,
      resolve: {
        images: function () {
          return $scope.offers;
        }
      }
    });
    modalInstance.result.then(function (images) {
      $scope.offers = images;
      $scope.resetSlick = true;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }
}]);
module.filter('startFrom',function(){
  return function(data,start){
    return data.slice(start);
  }
});
module.controller('CreateOfferModule',['$scope','$uibModalInstance','images','$http',function($scope,$uibModalInstance,images,$http){
    $scope.data = {upload :[]};
    $scope.images = images;
    $scope.categorySel = function() {
        $scope.offerSubcatFiltered = [];
        for(var i=0;i<$scope.SubTypeOfoffer.length;i++){
            if($scope.SubTypeOfoffer[i].cat == $scope.selCat){
               $scope.offerSubcatFiltered.push($scope.SubTypeOfoffer[i].sub);
             }
        }
    }
    $http({
            method: 'get',
            url: 'https://0ff8a7a9.ngrok.io/loadoffercat',
        }).then(function (response) {
            $scope.typeOfoffer = response.data;
            $http({
                 method: 'get',
                 url: 'https://0ff8a7a9.ngrok.io/loadoffersubcat',
             }).then(function (response) {
                 $scope.SubTypeOfoffer = response.data;
             });
    });
    $scope.closeMod = function(){
      $uibModalInstance.close($scope.images);
    }
    $scope.savePortf = function(){
      var offerData = {image :$scope.data.upload[0].data,header:$scope.headerOfOffer,description:$scope.descrOfNewOffer,type : $scope.selCat, subType : $scope.subCat, date : new Date()};
      console.log(offerData);
      $http({
        method : 'post',
        url: 'https://0ff8a7a9.ngrok.io/testoffer',//'http://193.33.64.97:8083/testoffer',
        contentType : 'json',
        data : angular.toJson(offerData)
      });
      $uibModalInstance.close($scope.images);
    }
}]);
module.controller('CreatePortfModule',['$scope','$uibModalInstance','images','$http',function($scope,$uibModalInstance,images,$http){
    $scope.data = {upload :[]};
    $scope.images = images;
    $scope.closeMod = function(){
      $uibModalInstance.close($scope.images);
    }
    $scope.savePortf = function(){
      $scope.images.push({url:$scope.data.upload[0].data,description:$scope.descrOfNewPortfolio});
      var PortfolioImage = {image : $scope.data.upload[0].data,description : $scope.descrOfNewPortfolio};
      $http({
        method : 'post',
        url : 'https://0ff8a7a9.ngrok.io/saveportfolio',//'http://193.33.64.97:8083/saveportfolio',
        contentType : 'json',
        data : PortfolioImage
      });
      $uibModalInstance.close($scope.images);
    }
}]);
module.controller('createOrChangePorf',['$scope','$uibModal','$log','$http',function($scope,$uibModal,$log,$http){
  //$scope.resetSlick = true;
  $http({
    method : 'get',
    url: 'https://0ff8a7a9.ngrok.io/loadportfolio',//'http://193.33.64.97:8083/loadportfolio',
  }).then(function(data){$scope.images = data.data;$scope.resetSlick = true;});
  $scope.open = function(size)
    {
      $scope.resetSlick = false;
      var modalInstance = $uibModal.open({
      template: '<div class="container"'+
      '<div class="row">'+
        '<div class="col-md-7 col-md-offset-1 addPortfolioHeader">'+
          '<h3> Додати Портфоліо </h3> '+
        '</div> '+
      '</div>'+
        '<div class="row">'+
          '<div class="col-md-3 col-md-offset-1 divForImage">'+
            '<div drop-zone ng-model="data.upload" class="one">'+
              '<p>Drop files here <span>(or click to upload)</span></p>'+
            '</div>'+
            '<div class="portfImage">'+
              '<img ng-repeat="file in data.upload" src="{{file.data}}" />'+
            '</div>'+
          '</div>'+
          '<div class="col-md-5  imageInfo">'+
              '<div> <span>Натисніть на кватрат, щоб додати фотографію своєї роботи у форматі .jpg або .png</span> </div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="row">'+
      '<div class="col-md-8 col-md-offset-1 imageDescr">'+
        '<h3>Опис роботи (до 15 слів)</h3>'+
        '<textarea ng-model="descrOfNewPortfolio" name="name" rows="8" cols="65"> </textarea>'+
      '</div>'+
      '<div class="row">'+
          '<div class="col-md-7 col-md-offset-1 addPortfolioButtons">'+
            '<ul class="list-inline">'+
              '<li> <button ng-click="closeMod()" class="btn"><span>Скасувати</span></button> </li>'+
              '<li class="pull-right"> <button ng-click="savePortf()" class="btn"><span>Зберегти</span></button> </li>'+
            '</ul>'+
          '</div>'+
      '</div>'+
      '</div> </div>',
      controller: 'CreatePortfModule',
      size: size,
      resolve: {
        images: function () {
          return $scope.images;
        }
      }
    });
    modalInstance.result.then(function (images) {
      $scope.images = images;
      $scope.resetSlick = true;
      console.log($scope.images);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }
  $scope.edit = function(size)
  {
    $scope.resetSlick = false;
    var modalInstance = $uibModal.open({
      template:'<div class="container"'+
      '<div class="row">'+
        '<div class="col-md-7 col-md-offset-1 addPortfolioHeader">'+
          '<h3> Додати Портфоліо </h3> '+
        '</div> '+
      '</div>'+
        '<div class="row">'+
          '<div class="col-md-3 col-md-offset-1 divForImage">'+
            '<div drop-zone ng-model="data.upload" class="one">'+
              '<p>Drop files here <span>(or click to upload)</span></p>'+
            '</div>'+
            '<div class="portfImage">'+
              '<img ng-repeat="file in data.upload" src="{{file.data}}" />'+
            '</div>'+
          '</div>'+
          '<div class="col-md-5  imageInfo">'+
              '<div> <span>Натисніть на кватрат, щоб додати фотографію своєї роботи у форматі .jpg або .png</span> </div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="row">'+
      '<div class="col-md-8 col-md-offset-1 imageDescr">'+
        '<h3>Опис роботи (до 15 слів)</h3>'+
        '<textarea ng-model="descrOfNewPortfolio" name="name" rows="8" cols="65"> </textarea>'+
      '</div>'+
      '<div class="row">'+
          '<div class="col-md-7 col-md-offset-1 addPortfolioButtons">'+
            '<ul class="list-inline">'+
              '<li> <button ng-click="closeMod()" class="btn"><span>Скасувати</span></button> </li>'+
              '<li class="pull-right"> <button ng-click="savePortf()" class="btn"><span>Зберегти</span></button> </li>'+
            '</ul>'+
          '</div>'+
      '</div>'+
      '</div> </div>',
      size: size,
      resolve: {
        images: function () {
          return '';
        }
      }
    });
    modalInstance.result.then(function () {
      console.log($scope.images);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }
}]);
////////////////////////////////////////Sancho
module.controller('innerRatings',['$scope','$uibModal','$uibModalInstance','$log','$http',function($scope,$uibModal,$uibModalInstance,$log,$http) {
    var newrat ={};
    var ratingData= {};
    $scope.getResponse = function(){
        if( $scope.stars !== undefined) {
            newrat = {
                sender:"Sender",
                receiver:"-1",
                waretask:"any",
                stars:$scope.stars.toString(),
                response:$scope.response,
                date:new Date()
            };
            $http({
                method: 'post',
                url:'https://0ff8a7a9.ngrok.io/savefeedback', //'http://193.33.64.97:8083/savefeedback',
                contentType:'json',
                data: angular.toJson(newrat)
            }).then(function (response) {
                console.log("Updated ratings data.");
            },function (error){
                console.log(error, " can't update ratings data.");
            });
            newrat.yellows="";
            newrat.grays="";
            for (j = 0; j < newrat.stars; j++) {
                newrat.yellows += '★';
            }
            for (j = 0; j < 5 - newrat.stars; j++) {
                newrat.grays += '★';
            }
            newrat.sender = 'Anonymous';
            newrat.receiver = 'Ді Капріо';
            newrat.date = new Date();
            $uibModalInstance.close(newrat);
        }
        else{
            alert("Необхідно дати оцінку перед збереженням відгуку.");
        }
      }
}]);
module.controller('ratings',['$scope','$uibModal','$log','$http',function($scope,$uibModal,$log,$http){
    $scope.responses = [];
    $scope.open = function(size)
    {
        var modalInstance = $uibModal.open({
            template: '<form id="ratings" class="ratings-edit"><div id="reviewStars-input"><input id="star-4" type="radio" name="reviewStars" ng-model="stars" ng-value="5" required/><label title="відмінно" for="star-4"></label><input id="star-3" type="radio" name="reviewStars" ng-model="stars" ng-value="4"/><label title="добре" for="star-3"></label><input id="star-2" type="radio" name="reviewStars" ng-model="stars" ng-value="3"/>        <label title="непогано" for="star-2"></label>'+        '<input id="star-1" type="radio" name="reviewStars" ng-model="stars" ng-value="2"/>        <label title="поганенько" for="star-1"></label>        <input id="star-0" type="radio" name="reviewStars" ng-model="stars" ng-value="1"/>        <label title="жахливо" for="star-0"></label></div><div class="form-group"><br /><br /><br /><label id="review">&nbsp;Відклик:</label><br /><br /><textarea ng-model="response" rows="10" cols="34" maxlength="190"></textarea><button class="button"'+ 'type="button" id="button-yes" ng-click="getResponse()">Зберегти</button></div></form>',
            controller:"innerRatings",
            size: size,
            resolve: {
                items: function () {
                    return 'hello';
                }
            }
        });
        modalInstance.result.then(function (newrat) {
            $scope.object.push(newrat);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
    $http({
        method: 'get',
        url: 'https://0ff8a7a9.ngrok.io/loadfeedback',//'http://193.33.64.97:8083/loadfeedback'
    }).then(function (response) {
        for (i = 0; i < response.data.length; i++) {
            $scope.responses.push(response.data[i]);
        }
        console.log("Got ratings data.");
        for (i = 0; i < $scope.responses.length; i++) {
            $scope.responses[i].yellows = '';
            $scope.responses[i].grays = '';
            for (j = 0; j < $scope.responses[i].stars; j++) {
                $scope.responses[i].yellows += '★';
            }
            for (j = 0; j < 5 - $scope.responses[i].stars; j++) {
                $scope.responses[i].grays += '★';
            }
        }
    }, function (error) {
        console.log(error, " can't get ratings data.");
    });
}]);
module.controller('innerIndividual',['$scope','$uibModalInstance','$log','$http','user_individual',function($scope,$uibModalInstance,$log,$http,user_individual) {
    $scope.data = {upload :[]};
    $scope.user_individual = user_individual;
    $scope.getResponse = function() {
    $scope.user_individual.user_photo = $scope.data.upload[0].data;
      $http({
          method: 'post',
          url: 'https://0ff8a7a9.ngrok.io/saveindividual',//'http://193.33.64.97:8083/saveindividual',
          data : angular.toJson($scope.user_individual)
      }).then(function (response) {
          $uibModalInstance.close(response.data);
      });
    }
}]);
module.controller('individual',['$scope','$uibModal','$log','$http',function($scope,$uibModal,$log,$http){
  $http({
    method: 'get',
    url: 'https://0ff8a7a9.ngrok.io/loadindividual',//'http://193.33.64.97:8083/loadindividual'
    }).then(function (response) {
      var size = response.data.length;

     $scope.user_individual = response.data[size-1];
    });
    $scope.open = function(size)
    {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/individual.html',
            controller: 'innerIndividual',
            size: size,
            resolve: {
                user_individual: function () {
                    return $scope.user_individual;
                      }
            }
        });
        modalInstance.result.then(function (user_individual) {
            $scope.user_individual = user_individual[6];
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);
module.controller('deals',['$scope','$http',function($scope,$http){
    $scope.Deals = [];
    $http({
      method : 'get',
      url : 'https://0ff8a7a9.ngrok.io/loadwish',
    }).then(function(response){
       for(var i = 0 ;i < response.data.length; i++)
       {
        var object ={};
        object.id = response.data[i].id;
         $http({
           method: 'post',
           url : 'https://0ff8a7a9.ngrok.io/loadofferbyid',
           data : {"id" : object.id}
         }).then(function(response){
           $scope.Deals.push(response.data[0]);
         });
       }
    });
}]);
///////////////////////for search
module.controller('offerSearch',['$scope','$log','$http',function($scope,$log,$http){
    $scope.keys = "";
    $http({
        method: 'get',
        url: 'https://0ff8a7a9.ngrok.io/loadoffercat',
    }).then(function (response) {
        $scope.offerCat = response.data;
    });
    $http({
        method: 'get',
        url: 'https://0ff8a7a9.ngrok.io/loadoffersubcat',
    }).then(function (response) {
        $scope.offerSubcat = response.data;
    });
    $scope.offerSubcatFiltered = [];
    $scope.categorySel = function() {
        $scope.offerSubcatFiltered = [];
        for(var i=0;i<$scope.offerSubcat.length;i++){
            if($scope.offerSubcat[i].cat === $scope.selCat) $scope.offerSubcatFiltered.push($scope.offerSubcat[i].sub);
        }
    }
    $scope.setFilterz = function() {
        $scope.Filter = $scope.selCat;
        $scope.subFilter = $scope.selSubCat;
        $http({
            method: 'post',
            url: 'https://0ff8a7a9.ngrok.io/loadofferlist',
            data: {"keys": $scope.keys},
        }).then(function (response) {
            $scope.offerList = response.data;
        });
    }
    $scope.viewSearch = function(item,filter,subfilter) {
        if(filter!== undefined)
        {
            if(item.type===filter && item.subType===subfilter)
                return true;
            return false;
        }
        return false;
    }
    $scope.sendOID = function(oid) {
        $http({
            method: 'post',
            url: 'https://0ff8a7a9.ngrok.io/savewish',
            data: {"id":oid},
        }).then(function (response) {

        });
    }
}]);
