var router = express.Router();
var upload = multer({ dest: './public/images/items'});

/*var validKeys = require('../db/APIKeys');
var isValid = function(key) {
    if(validKeys.indexOf(key)>=0) return true;
    return false;
};

router.all(function(req, res, next) {
    if(isValid(req.get('api-key'))) next();
    else res.end();
});*/

router.get('/get/counter/stat', function(req, res) {
    Order.GetCounterStat(req, res);
});

//api for order
router.get('/get/order/:oid', function(req, res) {
    if(req.params.oid == "all") res.json(Order.GetOrders());
	else res.json(Order.GetOrder(req.params.oid));
});

router.get('/get/order/search/:name', function(req, res) {
    res.json(Order.GetOrdersOfCustomerBy(req.params.name));
});

router.post('/add/order', function(req, res) {
	Order.Add(req.body, req, res);
});

router.post('/fulfil/order/', function(req, res) {
    Order.Fulfil(req, res, req.body.oid)
});

router.delete('/remove/order/:oid', function(req, res) {
	res.send(Order.Delete(req.params.oid));
});



//api for inventory
router.get('/get/inventory/last', function(req, res) {
    res.json({id:Inventory.GetLastId()});
});

router.get('/get/inventory/:id', function(req, res) {
    if(req.params.id == "all") res.json(Inventory.Get());
	else res.json(Inventory.GetItem(req.params.id));
});

router.get('/get/inventory/search/:name', function(req, res) {
    res.json(Inventory.GetBy(req.params.name));
});

router.post('/add/inventory', upload.single('image'), Inventory.Add);

router.delete('/remove/inventory/:id', function(req, res) {
	res.send(Inventory.Delete(req.params.id));
});



//api for customer
router.get('/get/customer/:cid', function(req, res) {
	res.json(Customer.Get(req.params.cid));
});

router.get('/get/customer/search/:name', function(req, res) {
	res.json(Customer.GetBy(req.params.name));
});

router.post('/add/customer', function(req, res) {
	res.send(Customer.Add(req.body));
});

router.delete('/remove/customer/:cid', function(req, res) {
    res.send(Customer.Delete(req.params.cid));
});

module.exports = router;