const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');
const passport = require('passport');

const config = require('dotenv').config();
global.appRoot = path.resolve(__dirname);
const session = require('express-session');
const cookieParser = require("cookie-parser");
app.use(express.static(path.join(__dirname, '../public')));
// Express Session Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', 'views');
app.set('view engine', 'pug');
app.use(cors({origin: "*"}));
app.use(bodyParser.urlencoded({extended: true}));
// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(session({secret: 'anything', maxAge: Date.now() + (30 * 86400 * 1000)}));

/*Config passport login*/
require('../middleware/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

/*Routes Files*/
let users = require('../routes/member-route')

/*Routes*/
app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});
app.get('/', function (req, res) {
    res.render('index');
});
app.use('/users', users);

/*Server launch*/
const port = process.env.PORT || '4242';
app.listen(port)
app.use(express.static(path.join(__dirname, 'public')));
