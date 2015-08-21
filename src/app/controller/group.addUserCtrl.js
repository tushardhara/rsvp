rsvpApp.controller('group.addUserCtrl', ['$scope','userService','$cookies','$rootScope',function($scope,userService,$cookies,$rootScope){
	if($cookies.getObject('user') != null){
      $rootScope.user = $cookies.getObject('user');
    }else{
      $location.path('/');
    }
	$scope.des = ['Mr','Ms','Mrs'];
    $scope.selectedDes = $scope.des[0];
	$scope.addUser = function(isValid){
	    if(isValid){
	      	$scope.addUserData = {
	      		'name' : $scope.selectedDes +" "+$scope.firstname+" "+$scope.lastname,
		        'email' : $scope.useremail,
		        'type' : 'user',
		        'password' : 'qwerty@#143'
	      	};
	      	userService.addUser($scope.addUserData).then(function(data){
	      		alert("User is Added");
	      		$scope.selectedDes = $scope.des[0];
	      		$scope.firstname = "";
	      		$scope.lastname = "";
	      	})
	    }
	}
	$scope.massadd = false;
	$scope.testClick = function(){
		users = $scope.test.split("\n");
		_.each(users,function(value,key){
			$scope.addUserData = {
	      		'name' : value,
		        'email' : "test@gmail.com",
		        'type' : 'user',
		        'password' : 'qwerty@#143'
	      	};
	      	userService.addUser($scope.addUserData).then(function(data){
	      		console.log("User is Added");
	      	})
		})
	}
}]);