rsvpApp.controller('place.showPlaceCtrl', ['$scope','srhrList','placeService','$cookies','$rootScope',function($scope,srhrList,placeService,$cookies,$rootScope){
  if($cookies.getObject('user') != null){
    $rootScope.user = $cookies.getObject('user');
  }else{
    $location.path('/');
  }
  $scope.currentPage = 1;
  $scope.pageSize = 30;
  $scope.listOfPlaces = [];
  _.each(srhrList,function(valueS,keyS){
    if(valueS.regions != ''){
      _.each(valueS.regions,function(valueR,keyR){
          _.each(valueR.hotels,function(valueH,keyH){
            _.each(valueH.roomtype,function(valueRT,keyRT){
              $scope.listOfPlaces.push({
                "id"        : valueS._id,
                "statename" : valueS.state,
                "regionname": valueR.name,
                "hotelname" : valueH.name,
                "roomtype"  : valueRT
              })
            });
          });
      });
    }else{
      $scope.listOfPlaces.push({
        "id"        : valueS._id,
        "statename" : valueS.state,
        "regionname": "",
        "hotelname" : "",
        "roomtype"  : ""
      })
    }
    
  });
  $('#deleteModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    $scope.deleteData = button.data('whatever') // Extract info from data-* attributes
  });
  $scope.deletePlace = function(typedelete){
    //use $scope.deleteId to delete form mongodb
    if(typedelete == 1){
      
      placeService.deletePlace($scope.deleteData.id).then(function(data){
        alert("State is Deleted");
      });
      $scope.listOfPlaces = _.difference($scope.listOfPlaces,_.where($scope.listOfPlaces, {id: $scope.deleteData.id}));
    }
    if(typedelete == 2){
      
      indexEdit =_.indexOf(_.pluck($scope.listOfPlaces,'id'), $scope.deleteData.id);
      temp = $scope.listOfPlaces;
      var editPlaceData = {};
      editPlaceData.state = temp[indexEdit].state;
      editPlaceData.regions = [];
      _.each(temp[indexEdit].regions,function(value,key){
        if(value.name !=  $scope.deleteData.regionname){
          editPlaceData.regions.push(value);
        }
      });

      placeService.editPlace($scope.deleteData.id,editPlaceData).then(function(data){
        alert("Region is Deleted");
      });
      $scope.listOfPlaces = _.difference($scope.listOfPlaces,_.where($scope.listOfPlaces, {id: $scope.deleteData.id, regionname: $scope.deleteData.regionname}));
    }
    if(typedelete == 3){

      indexEdit =_.indexOf(_.pluck(srhrList,'_id'), $scope.deleteData.id);
      temp = srhrList;
      var editPlaceData = {};
      editPlaceData.state = temp[indexEdit].state;
      editPlaceData.regions = [];
      indexEditRegion= _.indexOf(_.pluck(temp[indexEdit].regions,'name'), $scope.deleteData.regionname);
      indexEditHotel=_.indexOf(_.pluck(temp[indexEdit].regions[indexEditRegion].hotels,'name'), $scope.deleteData.hotelname);
      temp[indexEdit].regions[indexEditRegion].hotels.splice(indexEditHotel, 1);
      editPlaceData.regions = temp[indexEdit].regions;

      placeService.editPlace($scope.deleteData.id,editPlaceData).then(function(data){
        alert("Hotel is Deleted");
      });
      $scope.listOfPlaces = _.difference($scope.listOfPlaces,_.where($scope.listOfPlaces, {id: $scope.deleteData.id, regionname: $scope.deleteData.regionname , hotelname:$scope.deleteData.hotelname}));
    }
    if(typedelete == 4){

      indexEdit =_.indexOf(_.pluck(srhrList,'_id'), $scope.deleteData.id);
      temp = srhrList;
      var editPlaceData = {};
      editPlaceData.state = temp[indexEdit].state;
      editPlaceData.regions = [];
      indexEditRegion= _.indexOf(_.pluck(temp[indexEdit].regions,'name'), $scope.deleteData.regionname);
      indexEditHotel=_.indexOf(_.pluck(temp[indexEdit].regions[indexEditRegion].hotels,'name'), $scope.deleteData.hotelname);
      indexEditRoomType=_.indexOf(temp[indexEdit].regions[indexEditRegion].hotels[indexEditHotel].roomtype, $scope.deleteData.roomtype);
      temp[indexEdit].regions[indexEditRegion].hotels[indexEditHotel].roomtype.splice(indexEditRoomType, 1);
      editPlaceData.regions = temp[indexEdit].regions;
      
      placeService.editPlace($scope.deleteData.id,editPlaceData).then(function(data){
        alert("Room Type is Deleted");
      });
      
      $scope.listOfPlaces = _.difference($scope.listOfPlaces,_.where($scope.listOfPlaces, {id: $scope.deleteData.id, regionname: $scope.deleteData.regionname , hotelname:$scope.deleteData.hotelname , roomtype:$scope.deleteData.roomtype}));
    }
    $('#deleteModal').modal('hide');
  }
  $scope.editOpen = function(place){
    $scope.placeData = place;
    $scope.editContent = {
      "id" : place.id,
      "statename" : place.statename,
      "regionname" : place.regionname,
      "hotelname" : place.hotelname,
      "roomtype" : place.roomtype
    }
  }
  $scope.editPlace = function(isValid){

      if(isValid){
        regions = $scope.placeData.regionname;
        hotels = $scope.placeData.hotelname;
        type = $scope.placeData.roomtype;
        //use $scope.deleteId to delete form mongodb
        i=0,j=0,k=0,l=0;
        temp = $scope.listOfPlaces;
        _.each(temp,function(value,key){
          if($scope.editContent.id == value.id){
            if(i==0){
              indexEdit =_.indexOf(_.pluck(srhrList,'_id'), $scope.editContent.id);
              temp = srhrList;
              var editPlaceData = {};
              editPlaceData.state = $scope.editContent.statename;
              editPlaceData.regions = temp[indexEdit].regions;
              console.log($scope.editContent.id);
              placeService.editPlace($scope.editContent.id,editPlaceData).then(function(data){
                alert("State is Edited");
              });
              i++;
            }
            $scope.listOfPlaces[key]['statename'] = $scope.editContent.statename;
          }
          if($scope.editContent.id == value.id && value.regionname == regions){
            if(j==0){
              indexEdit =_.indexOf(_.pluck(srhrList,'_id'), $scope.editContent.id);
              temp = srhrList;
              var editPlaceData = {};
              editPlaceData.state = temp[indexEdit].state;
              editPlaceData.regions = [];
              indexEditRegion= _.indexOf(_.pluck(temp[indexEdit].regions,'name'), value.regionname);
              temp[indexEdit].regions[indexEditRegion].name = $scope.editContent.regionname;
              editPlaceData.regions = temp[indexEdit].regions;

              placeService.editPlace($scope.editContent.id,editPlaceData).then(function(data){
                alert("Region is Edited");
              });
              j++;
            }
            $scope.listOfPlaces[key]['regionname'] = $scope.editContent.regionname;

          }
          if($scope.editContent.id == value.id && $scope.editContent.regionname == value.regionname && value.hotelname == hotels){
            if(k==0){
              indexEdit =_.indexOf(_.pluck(srhrList,'_id'), $scope.editContent.id);
              temp = srhrList;
              var editPlaceData = {};
              editPlaceData.state = temp[indexEdit].state;
              editPlaceData.regions = [];
              indexEditRegion= _.indexOf(_.pluck(temp[indexEdit].regions,'name'), $scope.editContent.regionname);
              indexEditHotel=_.indexOf(_.pluck(temp[indexEdit].regions[indexEditRegion].hotels,'name'), value.hotelname);
              temp[indexEdit].regions[indexEditRegion].hotels[indexEditHotel].name = $scope.editContent.hotelname
              editPlaceData.regions = temp[indexEdit].regions;

              placeService.editPlace($scope.editContent.id,editPlaceData).then(function(data){
                alert("Hotel is Edited");
              });
            k++;
            }
            $scope.listOfPlaces[key]['hotelname'] = $scope.editContent.hotelname;
          }
          if($scope.editContent.id == value.id && $scope.editContent.regionname == value.regionname && $scope.editContent.hotelname == value.hotelname && value.roomtype == type){
            if(l==0){
              indexEdit =_.indexOf(_.pluck(srhrList,'_id'), $scope.editContent.id);
              temp = srhrList;
              var editPlaceData = {};
              editPlaceData.state = temp[indexEdit].state;
              editPlaceData.regions = [];
              indexEditRegion= _.indexOf(_.pluck(temp[indexEdit].regions,'name'), $scope.editContent.regionname);
              indexEditHotel=_.indexOf(_.pluck(temp[indexEdit].regions[indexEditRegion].hotels,'name'), $scope.editContent.hotelname);
              indexEditRoomType=_.indexOf(temp[indexEdit].regions[indexEditRegion].hotels[indexEditHotel].roomtype, value.roomtype);
              temp[indexEdit].regions[indexEditRegion].hotels[indexEditHotel].roomtype[indexEditRoomType] = $scope.editContent.roomtype;
              editPlaceData.regions = temp[indexEdit].regions;

              placeService.editPlace($scope.editContent.id,editPlaceData).then(function(data){
                alert("Room Type is Edited");
              });
              l++;
            }
            $scope.listOfPlaces[key]['roomtype'] = $scope.editContent.roomtype;
          }
        })
        
        $('#editModal').modal('hide');
      }
  }
}])