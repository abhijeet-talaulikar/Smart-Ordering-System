var Admins = require('../db/Admin');

var UserModel = {
    AdminStatus: false,
    
    Authenticate: function(req, res, pages) {
        Passport.authenticate('local-login', function(err, user, info) {
        if (err) { return res.redirect(pages.failure); }
        if (!user) { return res.redirect(pages.failure); }
        req.logIn(user, function(err) {
          if (err) { return res.redirect(pages.failure); }
          return res.redirect(pages.success);
        });
        })(req, res, pages);
    },
    
    AdminAuth: function(user) {
        for(var i=0;i<Admins.length;i++) 
            if(Admins[i].username == user.username && Admins[i].password == user.password) return (this.AdminStatus = true);
        return 0;
    },
    
    Deauthenticate: function(req) {
        req.logout();
    },
    
    AdminDeauth: function() {
        this.AdminStatus = false;
    },
    
    GetStatus: function(req) {
        return req.user;
    },
    
    Signup: function(req, res, pages) {
        Passport.authenticate('local-signup', function(err, user, info) {
        if (err) { return res.redirect(pages.failure); }
        if (!user) { return res.redirect(pages.failure); }
        if(user) {
            UserModel.Authenticate(req, res, pages);
        }
        })(req, res, pages);
    }
};

module.exports = UserModel;