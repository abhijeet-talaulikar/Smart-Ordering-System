var UserModel = require('../models/User');

var UserController = {
    GetStatus: function(req) {
        return UserModel.GetStatus(req);
    },
    
    Authenticate: function(req, res, pages) {
        return UserModel.Authenticate(req, res, pages);
    },
    
    Admin: function() {
        return UserModel.AdminStatus;
    },
    
    AdminAuth: function(user) {
        UserModel.AdminAuth(user);
    },
    
    Signup: function(req, res, pages) {
        return UserModel.Signup(req, res, pages);
    },
    
    Deauthenticate: function(req) {
        UserModel.Deauthenticate(req);
    },
    
    AdminDeauth: function() {
        UserModel.AdminDeauth();
    },
    
    GetDetail: function(req, detail) {
        if(detail === undefined) return req.user;
        else return req.user[detail];
    },
    
    GetOrders: function(oid) {
        if(oid === undefined) return Order.GetOrdersOfCustomer(this.GetDetail('cid'));
        else return Order.GetOrdersOfCustomer(this.GetDetail('cid')).find(function(i) {
                return (i.oid == oid);
            });
    }
};

module.exports = UserController;