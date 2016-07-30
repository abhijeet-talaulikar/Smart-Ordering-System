var CustomerModel = {    
    Get: function(cid) {
            var SQL = "SELECT * FROM " + Database.Tables.Customers + " WHERE cid = " + cid + ";";
            Database.Query(SQL, function(err, rows, fields) {
                if(!err) data_json[3] = rows;
            });
            return data_json[3];
    },
    
    GetBy: function(name) {
            var SQL = "SELECT * FROM " + Database.Tables.Customers + " WHERE username LIKE '%" + name + "%';";
            Database.Query(SQL, function(err, rows, fields) {
                if(!err) data_json[7] = rows;
            });
            return data_json[7];
    },
    
    GetDetail: function(cid, detail) {
        var SQL = "SELECT * FROM " + Database.Tables.Customers + " WHERE cid = " + cid + ";";
            Database.Query(SQL, function(err, rows, fields) {
                if(!err) data_json[4] = rows[0][detail];
            });
            return data_json[4];
    },
    
    Add: function(data) {
            //prepare purchase query
            var SQL = "INSERT INTO " + Database.Tables.Customers + "(firstname,lastname,email,password,username) VALUES ('" +                                   data.firstname + "','" + data.lastname + "','" 
                + data.email + "','" + data.password + "','" 
                + data.username + "');";
            //end query

            Database.Query(SQL,
                      function(err, rows, fields) {
                           if(!err) data_boolean[3] = true;
                            else data_boolean[3] = false;
                });
                return data_boolean[3];
    },
    
    Delete: function(cid) {
            var SQL = "DELETE FROM " + Database.Tables.Customers + " WHERE cid = " + cid + ";";
            Database.Query(SQL, function(err, rows, fields) {
                if(!err) data_boolean[4] = true;
                else data_boolean[4] = false;
            });
            return data_boolean[4];
    }
};

module.exports = CustomerModel;