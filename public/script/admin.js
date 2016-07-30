var admin = angular.module('admin', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('//');
    $interpolateProvider.endSymbol('//');
});
admin.controller('myCtrl', function($scope, $http) {
    $scope.user = {};
    $scope.results = [];
    $scope.o_count = 0;
    $scope.p_count = 0;
    $scope.i_count = 0;
    
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
			}
		});
        $scope.fetchOrders();
        $scope.GetCounterStat();
    };
    
    $scope.getCounter = function(n) {
        return String.fromCharCode('A'.charCodeAt(0)+parseInt(n));
    };
    
    $scope.GetCounterStat = function() {
        $http({
                method : 'GET',
                url : '/admin/get/counter/stat'
            }).then(function(response) {
                $scope.counterStat = response.data;
            }, function(response) {
                window.alert("error");
            });
    };
    
    $scope.cstat = function(c) {
        if($scope.counterStat.counters[c] < $scope.counterStat.thresholds[c.charCodeAt(0)-65])
            return 'alert-success';
        else return 'alert-danger';
    };
    
    $scope.fetchOrders = function() {
        var i = 0;
        var r = setInterval(function() {
            $http({
                method : 'GET',
                url : '/admin/get/order/all'
            }).then(function(response) {
                $scope.results = response.data;
                $scope.o_count = $scope.results.length;
                //$('.r_count').show();
            }, function(response) {
                window.alert("error");
            });
            i++;
            if(i==2) clearInterval(r);
        },500);
    };
    
    $scope.searchOrders = function() {
        var name = $('#search_o').val();
        if(name) {
            var i = 0;
            var r = setInterval(function() {
                $http({
                    method : 'GET',
                    url : '/admin/get/order/search/'+name
                }).then(function(response) {
                    $scope.results = response.data;
                    $scope.o_count = $scope.results.length;
                    $('.r_count').show();
                }, function(response) {
                    window.alert("error");
                });
                i++;
                if(i==2) clearInterval(r);
            },500);
        }
    };
    
    $scope.FulfilOrder = function(oid, index) {
        var i=0,flag=0;
        var r = setInterval(function() {
            $http({
                method : 'POST',
                url : '/admin/fulfil/order/',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data : $.param({oid:oid})
            }).then(function(response) {
                $scope.results[index].status = 1;
            }, function(response) {
                if(!flag++) window.alert(response.data);
            });
            i++;
            if(i==2) clearInterval(r);
        },500);
    };
    
    $scope.removeOrder = function(oid, index) {
        var i = 0;
        var r = setInterval(function() {
            $http({
                method : 'DELETE',
                url : '/admin/remove/order/'+oid
            }).then(function(response) {
                if(i==1) $scope.results.splice(index, 1);
            }, function(response) {
                window.alert("error");
            });
            i++;
            if(i==2) clearInterval(r);
        },500);
    };
    
    $scope.searchPeople = function() {
        var name = $('#search_n').val();
        if(name) {
            var i = 0;
            var r = setInterval(function() {
                $http({
                    method : 'GET',
                    url : '/admin/get/customer/search/'+name
                }).then(function(response) {
                    $scope.results = response.data;
                    $scope.p_count = $scope.results.length;
                }, function(response) {
                    window.alert("error");
                });
                if($scope.results[0]) $('#people_r').show();
                i++;
                if(i==2) clearInterval(r);
            },500);
        }
    };
    
    $scope.createItem = function() {
        document.getElementById('i_create').submit();
        document.getElementById('i_create').reset();
        $('#i_done').show();
        setTimeout(function(){ $('#i_done').hide(); }, 8000);
    };
    
    $scope.searchItems = function() {
        var name = $('#search_i').val();
        if(name) {
            var i = 0;
            var r = setInterval(function() {
                $http({
                    method : 'GET',
                    url : '/admin/get/inventory/search/'+name
                }).then(function(response) {
                    $scope.results = response.data;
                    $scope.i_count = $scope.results.length;
                }, function(response) {
                    window.alert("error");
                });
                if($scope.results[0]) $('#inv_r').show();
                i++;
                if(i==2) clearInterval(r);
            },500);
        }
    };
    
    $scope.removeItem = function(id, index) {
        var i = 0;
        var r = setInterval(function() {
            $http({
                method : 'DELETE',
                url : '/admin/remove/inventory/'+id
            }).then(function(response) {
                if(i==1) $scope.results.splice(index, 1);
            }, function(response) {
                window.alert("error");
            });
            i++;
            if(i==2) clearInterval(r);
        },500);
    };
});