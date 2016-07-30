var cart = angular.module('cart', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('//');
    $interpolateProvider.endSymbol('//');
});
cart.controller('myCtrl', function($scope, $http) {
    
    $scope.user = {};
    $scope.fetchUserData = function() {
        $http({
			method : 'GET',
			url : '/fetchuser'
		}).then(function(response) {
			$scope.user = response.data;
		}, function(response) {
			window.alert("error");
		});
    };
    $scope.count = 0;
	$scope.items = [];
	$scope.item_names = [];
	$scope.item_prices = [];
	$scope.item_images = [];
	$scope.item_qbox = [];
	$scope.item_db_names = [];
	$scope.populate = function() {
		$http.get('/inventory')
		.then(function(response) {
			var d = response.data;
			for(var i=0;i<d.length;i++) {
				$scope.item_names.push(d[i].name);
				$scope.item_prices.push(parseInt(d[i].price));
				$scope.item_images.push(d[i].image);
				$scope.item_qbox.push(d[i].qbox);
				$scope.item_db_names.push(d[i].dbname);
				$scope.items.push(0);
			}
		});
        $scope.fetchUserData();
        $scope.fetchOrders();
	};
    $scope.getCounter = function(n) {
        return String.fromCharCode('A'.charCodeAt(0)+parseInt(n));
    };
	$scope.reCount = function() {
		$scope.count = 0;
		for(var i=0;i<$scope.items.length;i++) $scope.count += $scope.items[i];
	};
	$scope.reset = function() {
		$scope.count = 0;
		for(var i=0;i<$scope.items.length;i++) $scope.items[i]=0;
	};
	$scope.total = function() {
		var sum = 0;
		for(var i=0;i<$scope.items.length;i++) 	sum += $scope.items[i] * $scope.item_prices[i];
		return sum;
	};
	$scope.add = function(index) {
		var quantity = parseInt(document.getElementById($scope.item_qbox[index]).value);
		$scope.items[index] += quantity;
		$scope.count += quantity;
    };
	$scope.remove = function(index) {
		$scope.count -= $scope.items[index];
		$scope.items[index] = 0;
    };
	$scope.purchase = function() {
        var d = {
            total: $scope.total()
        };
        for(var i=0;i<$scope.item_db_names.length;i++) d[$scope.item_db_names[i]] = $scope.items[i];
        d.cid = $scope.user.cid;
		$http({
			method : 'POST',
			url : '/purchase',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data : $.param(d)
		}).then(function(response) {
			loadPage("success");
			$scope.reset();
			for(var i=0;i<$scope.items.length;i++) document.getElementById($scope.item_qbox[i]).value = "1";
		}, function(response) {
			loadPage("failure");
		});
	};
	$scope.fetchOrders = function() {
		$http({
			method : 'POST',
			url : '/fetchOrders',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data : $.param({cid:$scope.user.cid})
		}).then(function(response) {
			$scope.orders = response.data;
		}, function(response) {
		});
	};
    $scope.removeOrder = function(oid, index) {
        var i = 0;
        var r = setInterval(function() {
            $http({
                method : 'DELETE',
                url : '/admin/remove/order/'+oid
            }).then(function(response) {
                if(i==1) $scope.orders.splice(index, 1);
            }, function(response) {
                window.alert("error");
            });
            i++;
            if(i==2) clearInterval(r);
        },500);
    };
});