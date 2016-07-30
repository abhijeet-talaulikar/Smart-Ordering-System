var CustomerModel = require('../models/Customer');

var CustomerController = {
    Get: function(cid) {
        return CustomerModel.Get(cid);
    },
    
    GetBy: function(name) {
        return CustomerModel.GetBy(name);
    },
    
    GetDetail: function(cid, detail) {
        return CustomerModel.GetDetail(cid, detail);
    },
    
    Add: function(data) {
        return CustomerModel.Add(data);
    },
    
    Delete: function(cid) {
        return CustomerModel.Delete(cid);
    }
};

module.exports = CustomerController;