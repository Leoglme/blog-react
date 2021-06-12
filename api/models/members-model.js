const mongoose = require('mongoose');

/*Member schema*/
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 20,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        required: false,
        default: false,
    },
})

module.exports.getUser = function(username) {
    const query = { username: username }
    return User
        .findOne(query)
        .then(user => {
            return user
        })
        .catch(err => {
            throw (err);
        })
};
const User = module.exports = mongoose.model('User', UserSchema);
