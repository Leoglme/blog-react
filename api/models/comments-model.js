const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    },
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: String,
        required: false,
        default: Math.floor(Date.now() / 1000)
    },
    content: {
        type: String
    }

}, { timestamps: true, collection: 'comments'})


const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment }
