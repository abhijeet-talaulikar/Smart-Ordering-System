express = require('express');
sess = require('express-session');
bodyParser = require('body-parser');
cookieParser = require('cookie-parser');
var connect = require('connect');
var http = require('http');
fs = require('fs');
multer  = require('multer');
Database = require('./config/mysql');
Passport = require('passport');
p = require('./config/passport')(Passport);
var flash = require('connect-flash');

Customer = require('./controllers/Customer');
Order = require('./controllers/Order');
Inventory = require('./controllers/Inventory');
User = require('./controllers/User');

views = __dirname + "/views/";
LoginView = views + "customer_login.html";
DashboardView = views + "dashboard.html";
AdminView = views + "admin.html";
AdminLogin = views + "admin_login.html";

var app = express();
var admin = require('./admin');

data_json = [];
data_boolean = [];

app.use(express.static(__dirname + "/public/"));
app.use(cookieParser());
app.use(sess({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(Passport.initialize());
app.use(Passport.session());
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/admin', admin);

Database.Connect();

app.all('*', function(req, res, next) {
    Inventory.Load();
    next();
});

app.get('/', function (req, res) {
	res.redirect( "/login" );
});

app.get('/admin', function (req, res) {
    if(User.Admin()) res.sendFile(AdminView);
    else res.sendFile(AdminLogin);
});

app.post('/admin/login', function(req, res) {
    User.AdminAuth(req.body);
    res.redirect('/admin');
});

app.get('/admin/logout', function(req, res) {
    User.AdminDeauth();
    res.redirect('/admin');
});

app.get('/login', function (req, res) {
	if(User.GetStatus(req)) res.redirect( "/dashboard" );
    else res.sendFile(LoginView);
});

app.post('/authenticate', function(req, res) {
    User.Authenticate(req, res, {
        success: '/dashboard',
        failure: '/login'
    });
});

app.post('/signup', function(req, res) {
    User.Signup(req, res, {
        success: '/dashboard',
        failure: '/login'
    });
});

app.get('/logout', function (req, res) {
    User.Deauthenticate(req);
	res.redirect( "/login" );
});

app.get('/dashboard', function (req, res) {
    if(User.GetStatus(req)) res.sendFile(DashboardView);
    else res.redirect( "/login" );
});

app.get('/fetchuser', function (req, res) {
	res.json(User.GetDetail(req));
});

app.post('/purchase', function (req, res) {
    Order.Add(req.body, req, res);
});

app.post('/fetchOrders', function (req, res) {
    res.json(Order.GetOrdersOfCustomer(req.body.cid));
});

app.get('/inventory', function (req, res) {
	res.json(Inventory.Get());
});

app.get('/:dir/:file', function (req, res) {
	res.sendFile( __dirname + "/public/" + req.params.dir + "/" + req.params.file );
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("App listening at http://%s:%s", host, port);
});