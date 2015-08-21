rsvpApp.controller('booking.editBookingCtrl', ['$scope','bookingList','bookingService','usersList','srhrList','$cookies','$rootScope','$stateParams',function($scope,bookingList,bookingService,usersList,srhrList,$cookies,$rootScope,$stateParams){
  if($cookies.getObject('user') != null){
    $rootScope.user = $cookies.getObject('user');
  }else{
    $location.path('/');
  }
  $scope.id = $stateParams.bookingId;
  $scope.currentBooking = _.where(bookingList,{"_id":$scope.id});
  console.log($scope.currentBooking[0]);
  $scope.invoice = $scope.currentBooking[0].Invoice;
  $scope.rate = $scope.currentBooking[0].Rate;
  $scope.nor = $scope.currentBooking[0].nor;
  $scope.CCSA = $scope.currentBooking[0].Credit_Card_Surcharge_Amount;
  $scope.rcn = $scope.currentBooking[0].Reservation_Confirmation_Number;
  $scope.comments = $scope.currentBooking[0].Comments;
  $scope.tin = $scope.currentBooking[0].Tax_Invoice_Number;
  $scope.selectedUser = $scope.currentBooking[0].Passenger_Name;
  $scope.BCO = $scope.currentBooking[0].Broker_Commissioned_Owed;
  $scope.anzorcba = ['ANZ','CBA'];
  $scope.selectedAC = $scope.currentBooking[0].Was_Invoice_ANZ_or_CBA;
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
  $scope.selectedCAT = $scope.currentBooking[0].Category;
  $scope.today = function() {
    $scope.DIwS = new Date($scope.currentBooking[0].Date_Invoice_Was_Sent);
    $scope.DPwD = new Date($scope.currentBooking[0].Date_Payment_Is_Due);
    $scope.CBD = new Date($scope.currentBooking[0].Client_Booking_Date);
    $scope.DI = new Date($scope.currentBooking[0].Date_In);
    $scope.DO = new Date($scope.currentBooking[0].Date_Out);
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
  $scope.selectedHIBP = $scope.currentBooking[0].Has_Invoice_Been_Paid;
  $scope.HTRBRs = ['YES','NO'];
  $scope.selectedHTRBR = $scope.currentBooking[0].Has_Tax_Receipt_Been_Requested;
  $scope.TRRFPs = ['YES','NO'];
  $scope.selectedTRRFP = $scope.currentBooking[0].Tax_Receipts_Received_From_Properties;;
  $scope.listOfUsers = usersList;
  if($rootScope.user.type == 'admin'){
    $scope.listOfBrokers = _.where(usersList,{ 'type' : 'broker'});
  }else{
    $scope.listOfBrokers = _.where(usersList,{ 'type' : 'broker' , 'email' : $rootScope.user.email});
  }
  $scope.selectedBroker = _.where($scope.listOfBrokers,{"name":$scope.currentBooking[0].Broker_Name})[0];
  $scope.$watch('selectedBroker', function(newValue, oldValue) {
    if(_.isObject(newValue)){
      $scope.listOfCompanies = newValue.details;
      $scope.selectedCompany = _.where($scope.listOfCompanies,{"brokercompany":$scope.currentBooking[0].Company_Name})[0];
    }
  });
  $scope.listOfStates = srhrList;
  console.log($scope.currentBooking[0].State);
  $scope.selectedState = _.findWhere($scope.listOfStates,{"state" : $scope.currentBooking[0].State});
  $scope.selectedRegion = _.findWhere($scope.selectedState.regions,{"name" : $scope.currentBooking[0].Region});
  $scope.selectedHotel = _.findWhere($scope.selectedRegion.hotels,{"name" : $scope.currentBooking[0].Hotel});
  $scope.selectedRoomtype = $scope.currentBooking[0].Room_Type;
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
  $scope.selectedTypeb = $scope.currentBooking[0].Type_of_Booking;
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
  $scope.selectedCCSPR = _.where($scope.CCSPRs,{"percentage" : $scope.currentBooking[0].Credit_Card_Surcharge_Percentage_Rate})[0];
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
  $scope.selectedCOTab = _.where($scope.COTabs ,{"percentage":$scope.currentBooking[0].Commission_Owed_To_TABS})[0];
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
    }
    indexEdit =_.indexOf(_.pluck(bookingList,'_id'), $scope.id);
     bookingList[indexEdit].Invoice = $scope.invoice;
     bookingList[indexEdit].Was_Invoice_ANZ_or_CBA = $scope.selectedAC;
     bookingList[indexEdit].Category = $scope.selectedCAT;
     bookingList[indexEdit].Date_Invoice_Was_Sent = new Date($scope.DIwS);
     bookingList[indexEdit].Date_Payment_Is_Due = new Date($scope.DPwD);
     bookingList[indexEdit].Has_Invoice_Been_Paid = $scope.selectedHIBP;
     bookingList[indexEdit].Has_Tax_Receipt_Been_Requested = $scope.selectedHTRBR;
     bookingList[indexEdit].Tax_Receipts_Received_From_Properties = $scope.selectedTRRFP;
     bookingList[indexEdit].Tax_Invoice_Number = $scope.tin;
     bookingList[indexEdit].Client_Booking_Date = new Date($scope.CBD);
     bookingList[indexEdit].Passenger_Name = $scope.selectedUser;
     bookingList[indexEdit].Broker_Name = $scope.selectedBroker.name;
     bookingList[indexEdit].Company_Name = $scope.selectedCompany.brokercompany;
     bookingList[indexEdit].State = $scope.selectedState.state;
     bookingList[indexEdit].Region = $scope.selectedRegion.name;
     bookingList[indexEdit].Hotel = $scope.selectedHotel.name;
     bookingList[indexEdit].Room_Type = $scope.selectedRoomtype;
     bookingList[indexEdit].Date_In =  new Date($scope.DI);
     bookingList[indexEdit].Date_Out = new Date($scope.DO);
     bookingList[indexEdit].Year = $scope.byear;
     bookingList[indexEdit].Month_of_Booking = $scope.bmonth;
     bookingList[indexEdit].Reservation_Confirmation_Number = $scope.rcn;
     bookingList[indexEdit].Type_of_Booking = $scope.selectedTypeb;
     bookingList[indexEdit].nor = $scope.nor;
     bookingList[indexEdit].Number_of_Room_Nights = $scope.norns;
     bookingList[indexEdit].Rate = $scope.rate;
     bookingList[indexEdit].Credit_Card_Surcharge_Percentage_Rate = $scope.selectedCCSPR.percentage;
     bookingList[indexEdit].Credit_Card_Surcharge_Amount = $scope.CCSA;
     bookingList[indexEdit].Total_Value = $scope.totalValue;
     bookingList[indexEdit].GST_Amount = $scope.GSTAmount;
     bookingList[indexEdit].Broker_Commissioned_Owed = $scope.BCO;
     bookingList[indexEdit].Commission_Owed_To_TABS = $scope.selectedCOTab.percentage;
     bookingList[indexEdit].Total_Commission = $scope.totalComm;
     bookingList[indexEdit].Comments = $scope.comments;
    bookingService.editBooking($scope.id,bookingData).then(function(data){
      alert("Booking is edited");
    })
    console.log(bookingData);
  }
}]);
