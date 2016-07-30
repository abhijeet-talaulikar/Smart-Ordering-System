var Mysql = require('mysql');

var DB = {
    Type: "MySQL",
    
    Config: {
               host     : 'localhost',
               user     : 'root',
               password : '',
               database : 'gs'
    },
    
    Tables: {
        Customers: "customers",
        Orders: "orders"
    },
    
    Connect: function() {
        this.Connection = Mysql.createConnection(this.Config);
        this.Connection.connect();
    },
    
    Disconnect: function() {
        this.Connection.end();
    },
    
    Query: function(sql, callback) {
        if(callback === undefined) return this.Connection.query(sql);
        else return this.Connection.query(sql, callback)
    }
};

module.exports = DB;