const mongoose = require('mongoose');

/*Member schema*/
const ProductSchema = new mongoose.Schema({
    product_title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    product_price: {
        type: Number,
        required: true,
        maxlength: 20
    },
    product_description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    product_category: {
        type: String,
        required: true,
    },
}, {collection: 'products'})
const Products = module.exports = mongoose.model('Products', ProductSchema);
