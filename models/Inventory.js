var InventoryModel = {
    Data: JSON.parse(fs.readFileSync("db/inventory.json")),
    
    DBNames: [],
    
    Load: function() {
        this.Data = JSON.parse(fs.readFileSync("db/inventory.json"));
        this.LoadItems();
    },
    
    LoadItems: function() {
        this.DBNames = [];
        for(var i=0;i<this.Data.length;i++) this.DBNames.push(this.Data[i].dbname);
    },
    
    Get: function() {
        return this.Data;
    },
    
    GetBy: function(name) {
        var items = [];
        for(var i=0;i<this.Data.length;i++) if(this.Data[i].name.toLowerCase().indexOf(name.toLowerCase()) >= 0) items.push(this.Data[i]);
        return items;
    },
    
    GetByDbName: function(dbname) {
        for(var i=0;i<this.Data.length;i++)
            if(this.Data[i].dbname == dbname) return this.Data[i];
        return {};
    },
    
    GetItem: function(id) {
        for(var i=0;i<this.Data.length;i++)
            if(this.Data[i].id == id) return this.Data[i];
        return {};
    },
    
    GetItemProperty: function(id, prop) {
        var index = -1;
        for(var i=0;i<this.Data.length;i++)
            if(this.Data[i].id == id) index = i;
        if(index < 0) return null;
        return this.Data[i][prop];
    },
    
    GetLastId: function() {
        return this.Data[this.Data.length-1].id;
    },
    
    Add: function(req, res) {
        var new_item = {
            id: this.GetLastId()+1,
            name: req.body.name,
            price: req.body.price,
            image: '/'+req.file.originalname,
            qbox: "q_" + req.body.name.replace(/ /g,'_'),
            dbname: req.body.name.replace(/ /g,'_'),
            stock: Math.floor(req.body.stock)
        };
        
        var path = 'public/images/items/';
        fs.rename(path + req.file.filename, path + req.file.originalname);
        
        this.Data.push(new_item);
        fs.writeFileSync("db/inventory.json", JSON.stringify(this.Data));

        //add column in Orders table
        Database.Query("ALTER TABLE " + Database.Tables.Orders + " ADD " + new_item.dbname + " INT DEFAULT 0;",
                function(err, rows, fields) {

        });
        //end
        res.end("<script>window.close();</script>");
    },
    
    DecrementStock: function(id, by) {
        var index = -1;
        for(var i=0;i<this.Data.length;i++) if(this.Data[i].id == id) index = i;
        if(index < 0) return false;
        this.Data[index].stock = parseInt(this.Data[index].stock) - by;
        fs.writeFileSync("db/inventory.json", JSON.stringify(this.Data));
        return true;
    },
    
    Delete: function(id) {
        var index = -1;
        for(var i=0;i<this.Data.length;i++) if(this.Data[i].id == id) index = i;
        if(index < 0) return false;
        if(this.Data.splice(index, 1)) {
            fs.writeFileSync("db/inventory.json", JSON.stringify(this.Data));
            return true;
        } else return false;
    }
};

module.exports = InventoryModel;