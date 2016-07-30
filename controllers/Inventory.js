var InventoryModel = require('../models/Inventory');
InventoryModel.Load();

var InventoryController = {
    Get: function() {
        return InventoryModel.Get();
    },
    
    GetBy: function(name) {
        return InventoryModel.GetBy(name);
    },
    
    GetByDbName: function(dbname) {
        return InventoryModel.GetByDbName(dbname);
    },
    
    GetItem: function(id) {
        return InventoryModel.GetItem(id);
    },
    
    GetItemProperty: function(id, prop) {
        return InventoryModel.GetItemProperty(id, prop);
    },
    
    GetDBNames: function() {
        return InventoryModel.DBNames;
    },
    
    GetLastId: function() {
        return InventoryModel.GetLastId();
    },
    
    Add: function(req, res) {
        return InventoryModel.Add(req, res);
    },
    
    DecrementStock: function(id, by) {
        return InventoryModel.DecrementStock(id, by);
    },
    
    Delete: function(id) {
        return InventoryModel.Delete(id);
    },
    
    Load: function() {
        InventoryModel.Load();
    }
};

module.exports = InventoryController;