rsvpApp.controller('place.addPlaceCtrl', ['$scope','srhrList','placeService',function($scope,srhrList,placeService){
  $scope.states = srhrList;
  $scope.selectState = $scope.states[0];
  $scope.regions = $scope.selectState.regions;
  $scope.selectRegion = $scope.regions[0];
  if($scope.selectRegion != undefined ){
    $scope.hotels = $scope.selectRegion.hotels;
    $scope.selectHotel = $scope.hotels[0];
  }
  $scope.changeState = function(selectState){
    $scope.selectState = selectState;
    $scope.regions = $scope.selectState.regions;
    $scope.selectRegion = $scope.regions[0];
    if($scope.selectRegion != undefined ){
      $scope.hotels = $scope.selectRegion.hotels;
      $scope.selectHotel = $scope.hotels[0];
    }
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
      $scope.addPlaceData = {
        "state" : $scope.statename,
        "regions" : [],
      };
      srhrList.push({
        "state" : $scope.statename,
        "regions" : [],
      })
      placeService.addPlace($scope.addPlaceData).then(function(data){
        alert("State is Added");
      });
      $scope.states = srhrList;
      
    }
  }
  $scope.addRegion = function(isValid){
    if(isValid){
      indexEdit =_.indexOf(_.pluck(srhrList,'_id'), $scope.selectState._id);
      srhrList[indexEdit].regions.push({
        "name" : $scope.regionname,
        "hotels" : []
      });
      id = $scope.selectState._id;
      var editPlaceData = {};
      editPlaceData.name = srhrList[indexEdit].name;
      editPlaceData.regions = srhrList[indexEdit].regions;
      placeService.editPlace(id,editPlaceData).then(function(data){
        alert("Regions is Added");
      });
      $scope.states = srhrList;
      $scope.regions = $scope.selectState.regions;
      
    }
  }
  $scope.addHotel = function(isValid){
    if(isValid){
      console.log( $scope.selectState._id);
      indexEditState =_.indexOf(_.pluck(srhrList,'_id'), $scope.selectState._id);
      indexEditRegion =_.indexOf(_.pluck(srhrList[indexEditState].regions,'name'), $scope.selectRegion.name);
      srhrList[indexEditState].regions[indexEditRegion].hotels.push({
        "name" : $scope.hotelname,
        "roomtype" : []
      })
      id = $scope.selectState._id;
      var editPlaceData = {};
      editPlaceData.name = srhrList[indexEditState].name;
      editPlaceData.regions = srhrList[indexEditState].regions;
      placeService.editPlace(id,editPlaceData).then(function(data){
        alert("Hotel is Added");
      });
      
      $scope.states = srhrList;
      $scope.regions = $scope.selectState.regions;
      $scope.hotels = $scope.selectRegion.hotels;
      
    }
  }
  $scope.addRoomType = function(isValid){
    if(isValid){
      console.log( $scope.selectState._id);
      indexEditState =_.indexOf(_.pluck(srhrList,'_id'), $scope.selectState._id);
      indexEditRegion =_.indexOf(_.pluck(srhrList[indexEditState].regions,'name'), $scope.selectRegion.name);
      indexEditHotel =_.indexOf( _.pluck(srhrList[indexEditState].regions[indexEditRegion].hotels,'name'), $scope.selectHotel.name);
      srhrList[indexEditState].regions[indexEditRegion].hotels[indexEditHotel].roomtype.push($scope.roomtype);
    
      id = $scope.selectState._id;
      var editPlaceData = {};
      editPlaceData.name = srhrList[indexEditState].name;
      editPlaceData.regions = srhrList[indexEditState].regions;
      placeService.editPlace(id,editPlaceData).then(function(data){
        alert("Room Type is Added");
      });
      
      $scope.states = srhrList;
      $scope.regions = $scope.selectState.regions;
      $scope.hotels = $scope.selectRegion.hotels;
      
    }
  }
}]);
