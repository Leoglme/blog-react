const mongoose = require('mongoose');
const db = require('../database');
// create an schema
const students = new mongoose.Schema({
    id: Number,
    lastname: String,
    firstname: String,
    email: {
        type: String,
        trim: true,
        unique: true,
        required: 'Email address is required',
        match: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/, 'Please fill a valid email address']
    },
    phone: {
        type: Number,
        match: [/^(\d{2}[-. ]?){5}$/, 'Please fill a valid phone number'],
        required: [true, 'User phone number required']
    },
    validated: {
        type: String,
        enum: ['in progress', 'validated', 'rejected'],
        default: 'in progress'
    },
    admin: Boolean
}, {collection: 'membre'});
studentsTable = mongoose.model('students', students);

module.exports = {
    getStudents: function (callback) {
        const studentsData = studentsTable.find({});
        studentsData.exec(function (err, data) {
            console.log("DATA => ", data);
            if (err) throw err;
            return callback(data);
        })
    }
}
