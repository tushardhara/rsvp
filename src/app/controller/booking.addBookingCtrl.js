rsvpApp.controller('booking.addBookingCtrl', ['$scope','bookingList','bookingService','usersList','srhrList','$cookies','$rootScope',function($scope,bookingList,bookingService,usersList,srhrList,$cookies,$rootScope){
  if($cookies.getObject('user') != null){
    $rootScope.user = $cookies.getObject('user');
  }else{
    $location.path('/');
  }
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
  if($rootScope.user.type == 'admin'){
    $scope.listOfBrokers = _.where(usersList,{ 'type' : 'broker'});
  }else{
    $scope.listOfBrokers = _.where(usersList,{ 'type' : 'broker' , 'email' : $rootScope.user.email});
  }
  $scope.selectedBroker = $scope.listOfBrokers[0];
  $scope.$watch('selectedBroker', function(newValue, oldValue) {
    if(_.isObject(newValue)){
      $scope.listOfCompanies = newValue.details;
      $scope.selectedCompany = $scope.listOfCompanies[0];
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
  $scope.$watchGroup(['totalValue','selectedCompany','selectedCOTab'],function(newValue,oldValue){
    if(!_.isUndefined(newValue[0]) && !_.isUndefined(newValue[1]) && !_.isUndefined(newValue[2])){
      $scope.totalComm = (newValue[0] * newValue[2].percentage / 100) + (newValue[0] * newValue[1].brokerpercentage / 100);
    }
    if(!_.isUndefined(newValue[0])){
      $scope.GSTAmount = Math.round((newValue[0] / 11) * 100) / 100;
    }
    if(!_.isUndefined(newValue[1])){
      $scope.BCO = newValue[1].brokerpercentage;
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
  });

  $scope.COTabs = [
    {"name": "5.00 %","percentage":5.00},
    {"name": "5.25 %","percentage":5.25},
    {"name": "5.50 %","percentage":5.50},
    {"name": "5.75 %","percentage":5.75},
    {"name": "6.00 %","percentage":6.00},
    {"name": "6.25 %","percentage":6.25},
    {"name": "6.50 %","percentage":6.50},
    {"name": "6.75 %","percentage":6.75},
    {"name": "7.00 %","percentage":7.00},
    {"name": "7.25 %","percentage":7.25},
    {"name": "7.50 %","percentage":7.50},
    {"name": "7.75 %","percentage":7.75},
    {"name": "8.00 %","percentage":8.00},
    {"name": "8.25 %","percentage":8.25},
    {"name": "8.50 %","percentage":8.50},
    {"name": "8.75 %","percentage":8.75},
    {"name": "9.00 %","percentage":9.00},
    {"name": "9.25 %","percentage":9.25},
    {"name": "9.50 %","percentage":9.50},
    {"name": "9.75 %","percentage":9.75},
    {"name": "10.00 %","percentage":10.00},
    {"name": "10.25 %","percentage":10.25},
    {"name": "10.50 %","percentage":10.50},
    {"name": "10.75 %","percentage":10.75},
    {"name": "11.00 %","percentage":11.00},
    {"name": "11.25 %","percentage":11.25},
    {"name": "11.50 %","percentage":11.50},
    {"name": "11.75 %","percentage":11.75},
    {"name": "12.00 %","percentage":12.00},
    {"name": "12.25 %","percentage":12.25},
    {"name": "12.50 %","percentage":12.50},
    {"name": "12.75 %","percentage":12.75},
    {"name": "13.00 %","percentage":13.00},
    {"name": "13.25 %","percentage":13.25},
    {"name": "13.50 %","percentage":13.50},
    {"name": "13.75 %","percentage":13.75},
    {"name": "14.00 %","percentage":14.00},
    {"name": "14.25 %","percentage":14.25},
    {"name": "14.50 %","percentage":14.50},
    {"name": "14.75 %","percentage":14.75},
    {"name": "15.00 %","percentage":15.00}
  ];
  $scope.selectedCOTab = $scope.COTabs[0];
  $scope.addBooking = function(isValid){
    bookingData = {
      'Invoice':$scope.invoice,
      'Was_Invoice_ANZ_or_CBA':$scope.selectedAC,
      'Category':$scope.selectedCAT,
      'Date_Invoice_Was_Sent':new Date($scope.DIwS),
      'Date_Payment_Is_Due':new Date($scope.DPwD),
      'Has_Invoice_Been_Paid':$scope.selectedHIBP,
      'Has_Tax_Receipt_Been_Requested':$scope.selectedHTRBR,
      'Tax_Receipts_Received_From_Properties':$scope.selectedTRRFP,
      'Tax_Invoice_Number':$scope.tin,
      'Client_Booking_Date':new Date($scope.CBD),
      'Passenger_Name':$scope.selectedUser,
      'Broker_Name':$scope.selectedBroker.name,
      'Company_Name':$scope.selectedCompany.brokercompany,
      'State':$scope.selectedState.state,
      'Region':$scope.selectedRegion.name,
      'Hotel':$scope.selectedHotel.name,
      'Room_Type':$scope.selectedRoomtype,
      'Date_In': new Date($scope.DI),
      'Date_Out':new Date($scope.DO),
      'Year':$scope.byear,
      'Month_of_Booking':$scope.bmonth,
      'Reservation_Confirmation_Number':$scope.rcn,
      'Type_of_Booking':$scope.selectedTypeb,
      'nor':$scope.nor,
      'Number_of_Room_Nights':$scope.norns,
      'Rate':$scope.rate,
      'Credit_Card_Surcharge_Percentage_Rate':$scope.selectedCCSPR.percentage,
      'Credit_Card_Surcharge_Amount':$scope.CCSA,
      'Total_Value':$scope.totalValue,
      'GST_Amount':$scope.GSTAmount,
      'Broker_Commissioned_Owed':$scope.BCO,
      'Commission_Owed_To_TABS':$scope.selectedCOTab.percentage,
      'Total_Commission':$scope.totalComm,
      'Comments':$scope.comments,
      'varificattion' : 'pending'
    }
    bookingService.addBooking(bookingData).then(function(data){
      alert("Booking is added for admin varificattion");
    })
    console.log(bookingData);
  }
}]);
