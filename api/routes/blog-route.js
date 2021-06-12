const express = require('express');
const Article = require('../models/article-model');
const Category = require('../models/category-model');
const {Comment} = require('../models/comments-model');
const router = express.Router();
const expressValidator = require('express-validator');
const db = require('../database');
const multer = require('multer')
router.use(expressValidator())
const fs = require('fs');
const {promisify} = require('util');
require('util.promisify').shim();
const pipeline = promisify((require('stream').pipeline));


const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, '../app/public/uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${Math.floor(Date.now() / 100) + file.originalname}`)
    }
})

let upload = multer({storage: storage, dest: '../../app/public/uploads/'})
/*Routes*/
router.post('/posts/:login', upload.single('file'), function (req, res, next) {
    const file = req.file;
    console.log(file);
    const article__title = req.body.article__title;
    const article__content = req.body.article__content;
    const article__idUser = req.body.article__idUser;
    const article__username = req.params.login;
    const article__image = req.file === undefined ? 'blogPost2.jpg' : Math.floor(Date.now() / 100) + req.file.originalname;
    const article__category = req.body.article__category === undefined ? null : req.body.article__category;

    req.checkBody('article__title', 'Article title is required').notEmpty();
    req.checkBody('article__title', 'Article title field must be 5 character long').isLength({min: 5});
    req.checkBody('article__title', 'Article title must contain less than 120 characters').isLength({max: 120});

    req.checkBody('article__content', 'Article content is required').notEmpty();
    req.checkBody('article__idUser', 'ID User is required').notEmpty();
    req.checkBody('article__username', 'Username is required').notEmpty();

    // Username already exists NROsolmaga@toto.com
    let errors = req.validationErrors();
    if (errors) {
        console.log("form blog validate errors", errors);
        res.status(500).json({
            error: errors,
            success: false,
        });
    } else {

        let newArticle = new Article({
            article__title: article__title,
            article__content: article__content,
            article__idUser: article__idUser,
            article__username: article__username,
            article__image: article__image,
            article__category: article__category,
        });
        newArticle.save()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'Article created',
                    success: true,
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    success: false,
                });
            })
    }
})
/*Article User*/
router.get('/posts/:login', async function (req, res) {
    const articles = await Article.find({article__username: req.params.login})
    console.log(articles);
    res.status(200).json({
        articles: articles,
        success: true,
    });
})
/*Article All*/
router.get('/posts', async function (req, res) {
    const articles = await Article.find({})
    console.log(articles);
    res.status(200).json({
        articles: articles,
        success: true,
    });
})
/*Article delete*/
router.delete('/posts/:login/:id', async function (req, res) {
    let cond = {_id: req.params.id};
    let removeArticle = await Article.findOneAndDelete(cond)
        .then(() => res.send(200, "Article deleted."))
        .catch(() => res.send(500, "Failed to delete the article."));
    console.log(removeArticle);
})

const storageNew = multer.diskStorage({
    destination: (req, file, callBack) => {
        console.log(req.file);
        callBack(null, '../app/public/uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${Math.floor(Date.now() / 1000) + file.originalname}`)
    }
})
let uploadNew = multer({storage: storageNew, dest: '../../app/public/uploads/'})
/*Article modify*/
router.put('/posts/:login/:id', uploadNew.single('file'), async function (req, res, next) {
    const file = req.body.file;
    const article__title = req.body.article__title;
    const article__content = req.body.article__content;
    const article__idUser = req.body.article__idUser;
    const article__username = req.params.login;
    const article__image = req.file === undefined ? 'blogPost2.jpg' : Math.floor(Date.now() / 1000) + req.file.originalname;

    req.checkBody('article__title', 'Article title is required').notEmpty();
    req.checkBody('article__title', 'Article title field must be 5 character long').isLength({min: 5});
    req.checkBody('article__title', 'Article title must contain less than 120 characters').isLength({max: 120});

    req.checkBody('article__content', 'Article content is required').notEmpty();
    req.checkBody('article__idUser', 'ID User is required').notEmpty();
    req.checkBody('article__username', 'Username is required').notEmpty();
    // Username already exists NROsolmaga@toto.com
    let errors = req.validationErrors();
    const article = await Article.find({_id: req.params.id, article__username: req.params.login});
    const articleExist = article.length !== 0;
    if (!articleExist) {
        console.log("article not exist");
        res.status(500).json({
            error: "Sorry, article do not exit",
            success: false,
        });
    }
    if (errors) {
        console.log("form blog validate errors", errors);
        res.status(500).json({
            error: errors,
            success: false,
        });
    } else {
        let cond = {_id: req.params.id};
        let update = {
            article__title: article__title,
            article__content: article__content,
            article__idUser: article__idUser,
            article__username: article__username,
            article__image: article__image
        };
        let opts = {
            upsert: true,
            new: true
        };
        let updatedArticle = Article.findByIdAndUpdate(cond, update, opts)
            .then((r) => res.status(200).json({
                articles: r,
                success: true,
            }))
            .catch((err) => res.status(500).json({
                error: err,
                success: false,
            }));
    }


})
/*Article by Id (Details)*/
router.get('/posts/details/:id', async function (req, res) {
    const article = await Article.findById({_id: req.params.id})
        .catch(() => res.send(500, "Failed to find the article."))
    res.status(200).json({
        articles: article,
        success: true,
    })
    console.log(article);
})


/*Get all categories*/
router.get('/getCategories', async function (req, res) {
    const categories = await Category.find({})
        .catch(() => res.send(500, "Failed to find categories."))
    res.status(200).json({
        categories: categories,
        success: true,
    })
    console.log(categories);
})

/*Most populaire blog post*/
router.get('/trending/blog', async function (req, res) {
    const Ids = [];
    const comments = await Comment.aggregate([
        {$group: {_id: '$postId', count: {$sum: 1}}},
    ])
    const countMax = 5;
    const count = comments.length < countMax ? comments.length : countMax;
    for (let i = 0; i < count; i++){
        Ids.push(comments[i])
    }
    const populateArticle = await Article.find({_id: Ids})
    res.status(200).json({
        populateArticle: populateArticle,
        success: true,
    })
})

/*Most recent blog post*/
router.get('/newest/blog', async function (req, res){
    const newestArticle =  await Article.find({}, {}, { sort: { 'article__date' : -1 } }).limit(3);
    res.status(200).json({
        populateArticle: newestArticle,
        success: true,
    })
    console.log(newestArticle);
})
module.exports = router;
