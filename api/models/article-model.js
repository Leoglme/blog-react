const mongoose = require('mongoose');
function dateNow(){
    function join(t, a, s) {
        function format(m) {
            let f = new Intl.DateTimeFormat('en', m);
            return f.format(t);
        }
        return a.map(format).join(s);
    }

    let a = [{month: 'short'}, {day: 'numeric'}, {year: 'numeric'}];
    return join(new Date, a, ' ');
}
/*Member schema*/
const ArticleSchema = new mongoose.Schema({
    article__title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 120
    },
    article__content: {
        type: String,
        required: true,
    },
    article__idUser: {
        type: String,
        required: true,
    },
    article__username: {
        type: String,
        required: true,
    },
    article__date: {
        type: String,
        required: false,
        default: Math.floor(Date.now() / 1000)
    },
    article__image: {
        type: String,
        required: false,
        default: 'article__image.png'
    },
    article__category: {
        type: Array || String,
        required: false,
        default: null
    }

}, {collection: 'articles'})
const Article = module.exports = mongoose.model('Article', ArticleSchema);
