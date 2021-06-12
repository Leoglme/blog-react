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
const Products = require('../models/products-model');
app.use(express.static(path.join(__dirname, '../public')));
// Express Session Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', 'views');
app.set('view engine', 'pug');
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({origin: "http://localhost:3000", credentials: true}));

app.use(session({
    secret: 'secretcode', maxAge: 365 * 24 * 60 * 60 * 1000, resave: true,
    rolling: true,
    saveUninitialized: false,
}));
app.use(cookieParser("secretcode"));
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
let admin = require('../routes/admin-route')
let blog = require('../routes/blog-route')
let comments = require('../routes/comments-route')

/*Routes*/
app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});
app.get('/', function (req, res) {
    const isConnected = req.user !== undefined;
    if(!isConnected){
        res.redirect('/users/login');
    }
    res.render('index');
});
app.use('/users', users);
app.use('/admin', admin);
app.use('/blog', blog);
app.use('/api/comments', comments);
app.get('/shop', async function (req, res) {
    const isConnected = req.user !== undefined;
    if(!isConnected){
        res.redirect('/users/login');
    }
    const products = await Products.find({})
    res.render('shop-index', {products});
});
app.get('/shop/:id', async function (req, res) {
    const isConnected = req.user !== undefined;
    if(!isConnected){
        res.redirect('/users/login');
    }
    const product = await Products.findById({_id: req.params.id})
    console.log(product);
    res.render('shop-details', {product});
});

app.get('/user/details', function (req, res) {
    const isConnected = req.user !== undefined;
    if(!isConnected){
        res.status(500).json({
            message: "user not connected",
            success: false,
        });
    }
    res.status(200).json({
        message: "user has been connected ! :)",
        success: true,
        user: req.user
    });
});

/*Server launch*/
const port = process.env.PORT || '4242';
app.listen(port)
app.use(express.static(path.join(__dirname, 'public')));
