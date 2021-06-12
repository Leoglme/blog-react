const express = require('express');
const Category = require('../models/category-model');
const Products = require('../models/products-model')
const router = express.Router();
const expressValidator = require('express-validator');
const db = require('../database');
router.use(expressValidator())
/*Routes*/
// Category Form
router.get('/add/category', async (req, res) => {
    const isAdmin = req.user === undefined ? false : req.user.admin;
    const isConnected = req.user !== undefined;
    if (!isConnected) {
        res.redirect('/users/login');
    } else if (!isAdmin) {
        res.redirect('/');
    }
    res.render('admin-category');
});
router.post('/add/category', (req, res) => {
    const category_name = req.body.category_name;
    req.checkBody('category_name', 'Category name is required').notEmpty();
    req.checkBody('category_name', 'Category name field must be 5 character long').isLength({min: 5});
    req.checkBody('category_name', 'Category name field must contain less than 5 characters').isLength({max: 20});

    let errors = req.validationErrors();

    if (errors) {
        res.render('admin-category', {errors: errors});
    } else {
        Category.findOne({category_name: category_name})
            .then((category) => {
                if (category) {
                    let errors = [];
                    errors.push({msg: category_name + ' category already exists'});
                    res.render('admin-category', {errors: errors});
                } else {
                    let newCategory = new Category({
                        category_name: category_name
                    });
                    newCategory.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.flash('success', 'your ' + category_name + ' category has been created ');
                            res.redirect('/admin/add/category');
                        }
                    })
                }
            })
    }
});

//Article shop admin route
router.get('/add', async (req, res) => {
    const categories = await Category.find({})
    const isAdmin = req.user === undefined ? false : req.user.admin;
    const isConnected = req.user !== undefined;
    if (!isConnected) {
        res.redirect('/users/login');
    } else if (!isAdmin) {
        res.redirect('/');
    } else {
        res.render('admin-product', {categories});
    }
});
router.post ('/add', async(req, res) => {
    const product_title = req.body.product_title;
    const product_price = req.body.product_price;
    const product_description = req.body.product_description;
    const product_category = req.body.product_category;

    /*Verify title*/
    req.checkBody('product_title', 'Product title is required').notEmpty();
    req.checkBody('product_title', 'Product title field must be 5 character long').isLength({min: 5});
    req.checkBody('product_title', 'Product title field must contain less than 50 characters').isLength({max: 50});

    /*Verify price*/
    req.checkBody('product_price', 'Product price is required').notEmpty();
    req.checkBody('product_price', 'Product price field must contain less than 20 characters').isLength({max: 20});

    /*Verify description*/
    req.checkBody('product_description', 'Product description is required').notEmpty();
    req.checkBody('product_description', 'Product description field must be 5 character long').isLength({min: 5});
    req.checkBody('product_description', 'Product description field must contain less than 255 characters').isLength({max: 255});

    /*Verify category*/
    req.checkBody('product_category', 'Product category is required').notEmpty();

    let errors = req.validationErrors();
    const categories = await Category.find({})
    if (errors) {
        res.render('admin-product', {errors: errors, categories});
    } else {
        let newProduct = new Products({
            product_title: product_title,
            product_price: product_price,
            product_description: product_description,
            product_category: product_category
        });
        newProduct.save( function (err) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                console.log(categories);
                req.flash('success', product_title + ' has been added !');
                res.redirect('/admin/add');
            }
        })
    }
});
module.exports = router;
