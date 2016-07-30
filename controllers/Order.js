var OrderModel = require('../models/Order');

var OrderController = {
    GetCounterStat: function(req, res) {
        OrderModel.GetCounterStat(req, res);
    },
    
    Fulfil: function(req, res, oid) {
        OrderModel.Fulfil(req, res, oid);
    },
    
    GetOrder: function(oid) {
        return OrderModel.GetOrder(oid);
    },
    
    GetOrders: function() {
        return OrderModel.GetOrders();
    },
    
    GetOrdersOfCustomer: function(cid) {
        return OrderModel.GetOrdersOfCustomer(cid);
    },
    
    GetOrdersOfCustomerBy: function(name) {
        return OrderModel.GetOrdersOfCustomerBy(name);
    },
    
    Add: function(data, req, res) {
        return OrderModel.Add(data, req, res);
    },
    
    Delete: function(oid) {
        return OrderModel.Delete(oid);
    },
    
    DeleteOrdersOfCustomer: function(cid) {
        return OrderModel.DeleteOrdersOfCustomer(cid);
    }
};

module.exports = OrderController;