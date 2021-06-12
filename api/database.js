const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27042/shop', {useNewUrlParser: true});
const conn = mongoose.connection;
conn.on('connected', function (req, res) {
    console.log('Connection successfull.');
});
conn.on('disconnected', function (req, res) {
    console.log('Connection failed.');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;
