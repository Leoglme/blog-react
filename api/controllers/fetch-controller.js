const studentsModel = require('../models/students-model');
const path = require("path");
const db = require('../database')
const mongoose = require('mongoose');
module.exports = {
    getStudents: function (req, res) {
        studentsModel.getStudents(function(data){
            res.send(data)
        })
    }
}
