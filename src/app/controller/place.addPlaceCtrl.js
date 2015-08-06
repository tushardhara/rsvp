rsvpApp.controller('place.addPlaceCtrl', ['$scope','srhrList',function($scope,srhrList){
  $(".selecter_1").selecter();
  $scope.states = srhrList;
  $scope.selectState = $scope.states[0];
  $scope.regions = $scope.selectState.regions;
  $scope.selectRegion = $scope.regions[0];
  $scope.hotels = $scope.selectRegion.hotels;
  $scope.selectHotel = $scope.hotels[0];
  $scope.changeState = function(selectState){
    $scope.selectState = selectState;
    $scope.regions = $scope.selectState.regions;
    $scope.selectRegion = $scope.regions[0];
    $scope.hotels = $scope.selectRegion.hotels;
    $scope.selectHotel = $scope.hotels[0];
  }
  $scope.changeRegion = function(selectRegion){
    $scope.selectRegion = selectRegion;
    $scope.hotels = $scope.selectRegion.hotels;
    $scope.selectHotel = $scope.hotels[0];
  }
  $scope.changeHotel = function(selectHotel){
    $scope.selectHotel = $scope.selectHotel;
  }
  $scope.addState = function(isValid){
    if(isValid){
      maxId = _.max(srhrList, function(stooge){ return stooge.id; }).id + 1;
      srhrList.push({
        "id" : maxId,
        "state" : $scope.statename,
        "regions" : [],
      })
      $scope.states = srhrList;
    }
  }
  $scope.addRegion = function(isValid){
    if(isValid){
      indexEdit =_.indexOf(_.pluck(srhrList,'id'), $scope.selectState.id);
      srhrList[indexEdit].regions.push({
        "name" : $scope.regionname,
        "hotels" : []
      })
      $scope.states = srhrList;
      $scope.regions = $scope.selectState.regions;
    }
  }
  $scope.addHotel = function(isValid){
    if(isValid){
      indexEditState =_.indexOf(_.pluck(srhrList,'id'), $scope.selectState.id);
      indexEditRegion =_.indexOf(_.pluck(srhrList[indexEditState].regions,'name'), $scope.selectRegion.name);
      srhrList[indexEditState].regions[indexEditRegion].hotels.push({
        "name" : $scope.hotelname,
        "roomtype" : []
      })
      $scope.states = srhrList;
      $scope.regions = $scope.selectState.regions;
      $scope.hotels = $scope.selectRegion.hotels;
    }
  }
  $scope.addRoomType = function(isValid){
    if(isValid){
      indexEditState =_.indexOf(_.pluck(srhrList,'id'), $scope.selectState.id);
      indexEditRegion =_.indexOf(_.pluck(srhrList[indexEditState].regions,'name'), $scope.selectRegion.name);
      indexEditHotel =_.indexOf( _.pluck(srhrList[indexEditState].regions[indexEditRegion].hotels,'name'), $scope.selectHotel.name);
      srhrList[indexEditState].regions[indexEditRegion].hotels[indexEditHotel].roomtype.push($scope.roomtype);
      $scope.states = srhrList;
      $scope.regions = $scope.selectState.regions;
      $scope.hotels = $scope.selectRegion.hotels;
    }
  }
}]);
