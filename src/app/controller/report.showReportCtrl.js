rsvpApp.controller('report.showReportCtrl', ['$scope','bookingList','bookingService','$cookies','$rootScope',function($scope,bookingList,bookingService,$cookies,$rootScope){
	if($cookies.getObject('user') != null){
    $rootScope.user = $cookies.getObject('user');
  }else{
    $location.path('/');
  }
  $scope.months =["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
  $scope.category = [
    'All',
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
  $scope.selectedCAT = $scope.category[0];
  $scope.today = function() {
    $scope.Start = new Date();
    $scope.End = new Date();
  };
  $scope.today();
  $scope.clear = function () {
    $scope.Start = null;
    $scope.End = null;
  };
  $scope.minDate = null;
  $scope.openStart = function($event) {
    $scope.statusStart.opened = true;
  };
  $scope.openEnd = function($event) {
    $scope.statusEnd.opened = true;
  };
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };
  $scope.formats = ['dd-MMMM-yyyy'];
  $scope.format = $scope.formats[0];
  $scope.statusStart = {
    opened: false
  };
  $scope.statusEnd = {
    opened: false
  };

  
  $scope.data = [];
  $scope.numberofdays = "";
  $scope.diffrentMonths = [];
  $scope.$watchGroup(['Start','End','selectedCAT'],function(newValue,oldValue){
    if(!_.isUndefined(newValue[0]) && !_.isUndefined(newValue[1]) && !_.isUndefined(newValue[2])){
      numberOfMonths = monthDiff(newValue[0],newValue[1]);
      $scope.numberofdays = numberofdays(newValue[0],newValue[1]);
      //console.log($scope.numberofdays);
      $scope.diffrentMonths=[];
      for(i=newValue[0].getMonth();i<newValue[0].getMonth()+numberOfMonths;i++){
        var d = new Date(newValue[0]),
            x = new Date(newValue[0]);
        d.setMonth(i % 12);
        x.setMonth(i);
        $scope.diffrentMonths.push($scope.months[d.getMonth()]+'-'+x.getFullYear());
      }
      if(newValue[2] == 'All'){
        if($rootScope.user.type == 'admin'){
          $scope.data = _.where(bookingList,{ 'varificattion' : 'completed'});
        }else if($rootScope.user.type == 'broker'){
          $scope.data = _.where(bookingList,{ 'Broker_Name' : $rootScope.user.name,'varificattion' : 'completed'});
        }else{
          $scope.data = _.where(bookingList,{ 'Passenger_Name' : $rootScope.user.name,'varificattion' : 'completed'});
        }
      }else{
        if($rootScope.user.type == 'admin'){
          $scope.data = _.where(bookingList,{ 'varificattion' : 'completed','Category' : newValue[2] });
        }else if($rootScope.user.type == 'broker'){
          $scope.data = _.where(bookingList,{ 'Broker_Name' : $rootScope.user.name,'varificattion' : 'completed' , 'Category' : newValue[2] });
        }else{
          $scope.data = _.where(bookingList,{ 'Passenger_Name' : $rootScope.user.name,'varificattion' : 'completed', 'Category' : newValue[2]});
        }
      }   
    }
  });
  $scope.result = [];
  $scope.datapoints1=[];
  $scope.datapoints2=[];
  $scope.datacolumns1=[
    {"id":"top-1","type":"bar","name":"Total"},
    {"id":"top-2","type":"bar","name":"Broker Commission"},
    {"id":"top-3","type":"bar","name":"Commission Own"},
    {"id":"top-4","type":"bar","name":"GST Amount"},
  ];
  $scope.datacolumns2=[
    {"id":"top-1","type":"bar","name":"Number of Room Night"},
  ];
  $scope.datax1={"id":"x"};

  $scope.$watchGroup(['diffrentMonths','data'],function(newValue,oldValue){
    $scope.datapoints1 = [];
    $scope.datapoints2 = [];
    $scope.result = [];
    $scope.userdata = [];
    for(i=0;i<newValue[0].length;i++){
      $scope.result.push({
        'sumNor' : 0,
        'sumPrice' : 0,
        'sumGST_Amount' : 0,
        'sumBroker' : 0,
        'sumCommission' : 0,
      })
    }
    calculate(newValue[0]);
    for(i=0;i<newValue[0].length;i++){
      $scope.datapoints1.push({
        "x": newValue[0][i], 
        "top-1": $scope.result[i].sumPrice, 
        "top-2": $scope.result[i].sumBroker,
        "top-3": $scope.result[i].sumCommission,
        "top-4": $scope.result[i].sumGST_Amount
      });
      $scope.datapoints2.push({
        "x": newValue[0][i], 
        "top-1": $scope.result[i].sumNor, 
      });
    }
    $scope.userusedrate = _.groupBy($scope.userdata,function(data){return data.Passenger_Name});
    $scope.hotelusedrate = _.groupBy($scope.userdata,function(data){return data.Hotel});
    console.log($scope.hotelusedrate);
    //console.log(_.groupBy(_.pluck($scope.result, 'userdata'),function(data){return data.Passenger_Name}));
    $scope.totalR = _.reduce(_.pluck($scope.result, 'sumPrice'), function(memo, num){ return memo + num; }, 0);
    $scope.totalB = _.reduce(_.pluck($scope.result, 'sumBroker'), function(memo, num){ return memo + num; }, 0);
    $scope.totalAB = _.reduce(_.pluck($scope.result, 'sumCommission'), function(memo, num){ return memo + num; }, 0);
    $scope.totalGST = _.reduce(_.pluck($scope.result, 'sumGST_Amount'), function(memo, num){ return memo + num; }, 0);
    $scope.totalNR = _.reduce(_.pluck($scope.result, 'sumNor'), function(memo, num){ return memo + num; }, 0);

  });

  function numberOfDays(year, month) {
      var d = new Date(year, month, 0);
      return d.getDate();
  }

  function monthDiff(d1, d2) {
    var months;
      months = (d2.getFullYear() - d1.getFullYear()) * 12;
      months = months - d1.getMonth() + 1;
      months = months + d2.getMonth();
     return months <= 0 ? 0 : months;
  }
  function numberofdays(d1,d2){
      return (d2 - d1) / (1000*60*60*24);
  }
  function calculate(newValue){
    for(i=0;i<newValue.length;i++){
      for(j=0;j<$scope.data.length;j++){
        d1 = new Date($scope.data[j].Date_In);
        d2 = new Date($scope.data[j].Date_Out);
        diff = Math.ceil((d2 - d1)/(1000 * 3600 * 24));
        d1Month = $scope.months[d1.getMonth()]+'-'+d1.getFullYear();
        d2Month = $scope.months[d2.getMonth()]+'-'+d2.getFullYear();
        if(d1Month == newValue[i] && d2Month == newValue[i]){
          $scope.result[i].sumNor = $scope.result[i].sumNor + diff;
          $scope.result[i].sumPrice = $scope.result[i].sumPrice + diff*$scope.data[j].Rate*$scope.data[j].nor;
          $scope.result[i].sumGST_Amount = $scope.result[i].sumGST_Amount + Math.round(($scope.result[i].sumPrice / 11) * 100) / 100;
          $scope.result[i].sumBroker = $scope.result[i].sumBroker + $scope.result[i].sumPrice * $scope.data[j].Broker_Commissioned_Owed / 100;
          $scope.result[i].sumCommission = $scope.result[i].sumCommission + $scope.result[i].sumPrice * $scope.data[j].Commission_Owed_To_TABS / 100;
          $scope.userdata.push($scope.data[j]);
        }else
        if(d1Month == newValue[i] && d2Month == newValue[i+1]){
          lastdate = numberOfDays(d1.getFullYear(),d1.getMonth());
          dlast = new Date(d1.getFullYear()+'-'+(d1.getMonth()+1)+'-'+lastdate);
          ndif = Math.ceil((dlast - d1)/(1000 * 3600 * 24));
          $scope.result[i].sumNor = $scope.result[i].sumNor + ndif;
          $scope.result[i].sumPrice = $scope.result[i].sumPrice + ndif*$scope.data[j].Rate*$scope.data[j].nor;
          $scope.result[i].sumGST_Amount = $scope.result[i].sumGST_Amount + Math.round(($scope.result[i].sumPrice / 11) * 100) / 100;
          $scope.result[i].sumBroker = $scope.result[i].sumBroker + $scope.result[i].sumPrice * $scope.data[j].Broker_Commissioned_Owed / 100;
          $scope.result[i].sumCommission = $scope.result[i].sumCommission + $scope.result[i].sumPrice * $scope.data[j].Commission_Owed_To_TABS / 100;
          $scope.userdata.push($scope.data[j]);
          dfirst = new Date(d2.getFullYear()+'-'+(d2.getMonth()+1)+'-'+'01');
          tdif = Math.ceil((d2 - dfirst)/(1000 * 3600 * 24));
          $scope.result[i+1].sumNor = $scope.result[i+1].sumNor + tdif;
          $scope.result[i+1].sumPrice = $scope.result[i+1].sumPrice + tdif*$scope.data[j].Rate*$scope.data[j].nor;
          $scope.result[i+1].sumGST_Amount = $scope.result[i+1].sumGST_Amount + Math.round(($scope.result[i+1].sumPrice / 11) * 100) / 100;
          $scope.result[i+1].sumBroker = $scope.result[i+1].sumBroker + $scope.result[i+1].sumPrice * $scope.data[j].Broker_Commissioned_Owed / 100;
          $scope.result[i+1].sumCommission = $scope.result[i+1].sumCommission + $scope.result[i+1].sumPrice * $scope.data[j].Commission_Owed_To_TABS / 100;
        }else{
          if(d1Month != d2Month && _.isUndefined(newValue[i+1])){
            lastdate = numberOfDays(d1.getFullYear(),d1.getMonth());
            dlast = new Date(d1.getFullYear()+'-'+(d1.getMonth()+1)+'-'+lastdate);
            ndif = Math.ceil((dlast - d1)/(1000 * 3600 * 24));
            $scope.result[i].sumNor = $scope.result[i].sumNor + ndif;
            $scope.result[i].sumPrice = $scope.result[i].sumPrice + ndif*$scope.data[j].Rate*$scope.data[j].nor;
            $scope.result[i].sumGST_Amount = $scope.result[i].sumGST_Amount + Math.round(($scope.result[i].sumPrice / 11) * 100) / 100;
            $scope.result[i].sumBroker = $scope.result[i].sumBroker + $scope.result[i].sumPrice * $scope.data[j].Broker_Commissioned_Owed / 100;
            $scope.result[i].sumCommission = $scope.result[i].sumCommission + $scope.result[i].sumPrice * $scope.data[j].Broker_Commissioned_Owed / 100;
            $scope.userdata.push($scope.data[j]);
          }         
        }
      }
    }
  }
}]);