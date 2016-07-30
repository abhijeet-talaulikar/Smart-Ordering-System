var OrderModel = {
    GetCounterStat: function(req, res) {
        var SQL = '\
SELECT DISTINCT \
(SELECT COUNT(*) FROM ' + Database.Tables.Orders + ' WHERE counter=0) AS A,\
(SELECT COUNT(*) FROM ' + Database.Tables.Orders + ' WHERE counter=1) AS B,\
(SELECT COUNT(*) FROM ' + Database.Tables.Orders + ' WHERE counter=2) AS C FROM ' + Database.Tables.Orders + ';';
        
        Database.Query(SQL,
                    function(err, rows, fields) {
                        var status = {
                            counters: rows[0],
                            thresholds: [2, 8, 9]
                        };
                        res.json(status);
        });
    },
    
    Fulfil: function(req, res, oid) {
        Database.Query("SELECT * FROM " + Database.Tables.Orders + " WHERE oid = "+oid+";",
                    function(err, rows, fields) {
                        if(!err) {
                            var order = rows[0];
                            if(parseInt(order.status)) res.status(403).end("Order fulfilled!");
                            else {
                                //check stock
                                var flag = true;
                                for (var x in order)
                                    if(x != 'total') 
                                        if(order[x] > parseInt(Inventory.GetByDbName(x).stock)) {
                                            flag = false;
                                            break;
                                        }
                                //end check

                                if(flag) {
                                    //decrement stock
                                    for(var x in order) {
                                        var a = ['total','status','cid','oid','counter'];
                                        if(order.hasOwnProperty(x) && a.indexOf(x) < 0)
                                            Inventory.DecrementStock(Inventory.GetByDbName(x).id, order[x]);
                                    }
                                    Database.Query("UPDATE " + Database.Tables.Orders + " SET status = 1, counter = NULL WHERE oid = "+oid+";",
                                                function(err, rows, fields) {
                                                    if(!err) res.status(200).end();
                                                    else res.status(403).end("Please try again later!");
                                    });
                                } else res.status(403).end("Not enough items in stock!");
                            }
                        }
        });
    },
    
    GetOrder: function(oid) {
        Database.Query("SELECT * FROM " + Database.Tables.Orders + " WHERE oid = "+oid+";",
                    function(err, rows, fields) {
                        if(!err) data_json[1] = rows[0];
        });
        return data_json[1];
    },
    
    GetOrders: function() {
        Database.Query("SELECT * FROM " + Database.Tables.Orders + " ORDER BY oid;",
                    function(err, rows, fields) {
                        if(!err) data_json[10] = rows;
        });
        return data_json[10];
    },
    
    GetOrdersOfCustomer: function(cid) {
        Database.Query("SELECT * FROM " + Database.Tables.Orders + " WHERE cid = "+cid+" ORDER BY oid;",
                    function(err, rows, fields) {
                        if(!err) data_json[2] = rows;
        });
        return data_json[2];
    },
    
    GetOrdersOfCustomerBy: function(name) {
        Database.Query("SELECT * FROM " + Database.Tables.Customers + " AS c," + Database.Tables.Orders + " AS o WHERE c.cid = o.cid AND c.username LIKE '%" + name + "%' ORDER BY oid;",
                    function(err, rows, fields) {
                        if(!err) data_json[8] = rows;
        });
        return data_json[8];
    },
    
    Add: function(data, req, res) {
        var SQL = '\
SELECT DISTINCT \
(SELECT COUNT(*) FROM ' + Database.Tables.Orders + ' WHERE counter=0) AS c0,\
(SELECT COUNT(*) FROM ' + Database.Tables.Orders + ' WHERE counter=1) AS c1,\
(SELECT COUNT(*) FROM ' + Database.Tables.Orders + ' WHERE counter=2) AS c2 FROM ' + Database.Tables.Orders + ';';
        
        Database.Query(SQL,
                    function(err, rows, fields) {
                        if(!err) {
                            var counter = null;
                            var counters = [0, 0, 0];
                            var thresholds = [2, 8, 9];
                            var HoursPerOrder = [5, 4, 1];
                            var Load = function(c) {
                                return counters[c] * HoursPerOrder[c];
                            };
                            if(typeof rows[0] === "undefined") counter = 0;
                            else {
                                for(var i=0;i<counters.length;i++) counters[i] = parseInt(rows[0]['c'+i]);
                                var min = Load(0);
                                for(var i=0;i<counters.length;i++) 
                                    if(counters[i] < thresholds[i] && Load(i) < min) {
                                        counter = i;
                                        min = Load(i);
                                    }
                            }
                            if(counter == null && counters[0] < thresholds[0]) counter = 0;
                            if(counter == null) res.status(403).end();
                            else {
                                Date.prototype.addHours= function(h){
                                    this.setHours(this.getHours()+h);
                                    return this;
                                }
                                
                                var date = new Date().addHours(HoursPerOrder[counter] * (counters[counter]+1)).toUTCString();
                                //prepare purchase query
                                var SQL = "INSERT INTO " + Database.Tables.Orders + " (total,";
                                for(var i=0;i<Inventory.GetDBNames().length;i++) SQL += Inventory.GetDBNames()[i] + ",";
                                SQL += "cid, counter, scheduled) VALUES (" + data.total + ",";
                                for(var i=0;i<Inventory.GetDBNames().length;i++) SQL += data[Inventory.GetDBNames()[i]] + ",";
                                SQL += data.cid + "," + counter + ",'" + date + "');";
                                //end query
                                
                                Database.Query(SQL,
                                          function(err, rows, fields) {
                                                if(!err) res.status(200).end();
                                                else {
                                                    console.log('shats');
                                                    res.status(403).end();
                                                }
                                    });
                            }
                        }
        });
    },
    
    Delete: function(oid) {
        Database.Query("DELETE FROM " + Database.Tables.Orders + " WHERE oid = "+oid+";",
                    function(err, rows, fields) {
                        if(!err) data_boolean[2] = true;
                        else data_boolean[2] = false;
        });
        return data_boolean[2];
    },
    
    DeleteOrdersOfCustomer: function(cid) {
        Database.Query("DELETE FROM " + Database.Tables.Orders + " WHERE cid = "+cid+";",
                    function(err, rows, fields) {
                        if(!err) data_boolean[6] = true;
                        else data_boolean[6] = false;
        });
        return data_boolean[6];
    }
};

module.exports = OrderModel;