const mongoose = require('mongoose');

/*Member schema*/
const UserSchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 20
    }
}, {collection: 'categories'})
const Category = module.exports = mongoose.model('Category', UserSchema);
