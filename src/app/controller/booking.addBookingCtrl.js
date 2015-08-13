rsvpApp.controller('booking.addBookingCtrl', ['$scope','bookingList','bookingService','usersList','srhrList',function($scope,bookingList,bookingService,usersList,srhrList){
  $scope.anzorcba = ['ANZ','CBA'];
  $scope.selectedAC = $scope.anzorcba[0];
  $scope.category = [
    'Corporate FIT – Contracted',
    'Corporate FIT – Non-Contracted',
    'Leisure FIT',
    'Govt FIT – Contracted',
    'Govt FIT – Non-Contracted',
    'Meetings',
    'Conferences',
    'Exhibitions',
    'Dinner Event',
    'Lunch Event',
    'Breakfast Event',
    'Weddings'
  ];
  $scope.selectedAC = $scope.anzorcba[0];
  $scope.selectedCAT = $scope.category[0];
  $scope.today = function() {
    $scope.DIwS = new Date();
    $scope.DPwD = new Date();
    $scope.CBD = new Date();
    $scope.DI = new Date();
    $scope.DO = new Date();
  };
  $scope.today();
  $scope.clear = function () {
    $scope.DIwS = null;
    $scope.DPwD = null;
    $scope.CBD = null;
    $scope.DI = null;
    $scope.DO = null;
  };
  $scope.minDate = null;
  $scope.openDIwS = function($event) {
    $scope.statusDIwS.opened = true;
  };
  $scope.openDPwD = function($event) {
    $scope.statusDPwD.opened = true;
  };
  $scope.openCBD = function($event) {
    $scope.statusCBD.opened = true;
  };
  $scope.openDI = function($event) {
    $scope.statusDI.opened = true;
  };
  $scope.openDO = function($event) {
    $scope.statusDO.opened = true;
  };
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };
  $scope.formats = ['dd-MMMM-yyyy'];
  $scope.format = $scope.formats[0];
  $scope.statusDIwS = {
    opened: false
  };
  $scope.statusDPwD = {
    opened: false
  };
  $scope.statusCBD = {
    opened: false
  };
  $scope.statusDI = {
    opened: false
  };
  $scope.statusDO = {
    opened: false
  };
  $scope.HIBPs = ['YES','YES - SHORT','NO'];
  $scope.selectedHIBP = $scope.HIBPs[0];
  $scope.HTRBRs = ['YES','NO'];
  $scope.selectedHTRBR = $scope.HTRBRs[0];
  $scope.TRRFPs = ['YES','NO'];
  $scope.selectedTRRFP = $scope.TRRFPs[0];
  $scope.listOfUsers = usersList;
  $scope.listOfBrokers = _.where(usersList,{ 'type' : 'broker'});
  $scope.$watch('selectedBroker', function(newValue, oldValue) {
    if(_.isObject(newValue)){
      $scope.listOfCompanies = newValue.details;
    }
  });
  $scope.listOfStates = srhrList;
  $scope.$watch('selectedState', function(newValue, oldValue) {
    if(_.isObject(newValue)){
      $scope.listOfRegions = newValue.regions;
    }
  });
  $scope.$watch('selectedRegion', function(newValue, oldValue) {
    if(_.isObject(newValue)){
      $scope.listOfHotels = newValue.hotels;
    }
  });
  $scope.$watch('selectedHotel', function(newValue, oldValue) {
    if(_.isObject(newValue)){
      $scope.roomtypes = newValue.roomtype;
    }
  });
  $scope.$watchGroup(['DI','DO'],function(newValue,oldValue){
    if(!_.isUndefined(newValue[0])){
      var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      var date = new Date(newValue[0]);
      $scope.byear = date.getFullYear();
      $scope.bmonth = monthNames[date.getMonth()];
    }
    if(!_.isUndefined(newValue[0]) && !_.isUndefined(newValue[1])){
      var dateDO = new Date(newValue[1]);
      var dateDI = new Date(newValue[0]);
      $scope.norns =  Math.ceil((dateDO - dateDI)/(1000 * 3600 * 24));
    }
  });
  $scope.$watchGroup(['nor','norns','rate'],function(newValue,oldValue){
    if(!_.isUndefined(newValue[0]) && !_.isUndefined(newValue[1]) && !_.isUndefined(newValue[2])){
      $scope.totalValue = newValue[0] * newValue[1] * newValue[2];
    }
  });
  $scope.$watchGroup(['totalValue','selectedCompany'],function(newValue,oldValue){
    if(!_.isUndefined(newValue[0]) && !_.isUndefined(newValue[1])){
      $scope.BCO = newValue[1].brokerpercentage;
      $scope.totalComm = newValue[0] * newValue[1].brokerpercentage / 100;
    }
    if(!_.isUndefined(newValue[0])){
      $scope.GSTAmount = Math.round((newValue[0] / 11) * 100) / 100;
    }
  })
  $scope.typeofbookings = [
    'Number of Rooms Required',
    'DCP',
    'Delegates or Attendees'
  ];
  $scope.selectedTypeb = $scope.typeofbookings[0];
  $scope.CCSPRs = [
    {"name": "No Surcharge","percentage":0},
    {"name": "0.25 %","percentage":0.25},
    {"name": "0.50 %","percentage":0.50},
    {"name": "0.75 %","percentage":0.75},
    {"name": "1.00 %","percentage":1.00},
    {"name": "1.25 %","percentage":1.25},
    {"name": "1.50 %","percentage":1.50},
    {"name": "1.75 %","percentage":1.75},
    {"name": "2.00 %","percentage":2.00},
    {"name": "2.25 %","percentage":2.25},
    {"name": "2.50 %","percentage":2.50},
    {"name": "2.75 %","percentage":2.75},
    {"name": "3.00 %","percentage":3.00},
    {"name": "3.25 %","percentage":3.25},
    {"name": "3.50 %","percentage":3.50},
    {"name": "3.75 %","percentage":3.75},
    {"name": "4.00 %","percentage":4.00},
    {"name": "4.25 %","percentage":4.25},
    {"name": "4.50 %","percentage":4.50},
    {"name": "4.75 %","percentage":4.75},
    {"name": "5.00 %","percentage":5.00},
    {"name": "5.25 %","percentage":5.25},
    {"name": "5.50 %","percentage":5.50},
    {"name": "5.75 %","percentage":5.75},
    {"name": "6.00 %","percentage":6.00},
    {"name": "6.25 %","percentage":6.25},
    {"name": "6.50 %","percentage":6.50},
    {"name": "6.75 %","percentage":6.75},
    {"name": "7.00 %","percentage":7.00}
  ];
  $scope.selectedCCSPR = $scope.CCSPRs[0];
  $scope.$watchGroup(['totalValue','selectedCCSPR'],function(newValue,oldValue){
    if(!_.isUndefined(newValue[0]) && !_.isUndefined(newValue[1])){
      $scope.CCSA = Math.round( (newValue[0] * newValue[1].percentage / 100) * 100) / 100;
    }
  })

  $scope.$watchGroup(['CBD','DI'],function(newValue,oldValue){
    if(!_.isUndefined(newValue[0]) && !_.isUndefined(newValue[1])){
      var today = new Date();
      var dateDI = new Date(newValue[1]);
      var dateCBD = new Date(newValue[0]);
      temp = Math.ceil((dateDI - today)/(1000 * 3600 * 24));
      if(temp >=0 ){
        $scope.vidtsd =   temp + " days";
      }else{
        $scope.vidtsd =  "Date Passed";
      }
    }
    
  })
}]);
