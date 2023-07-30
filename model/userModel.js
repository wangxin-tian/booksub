const mongoose = require('mongoose');

const userType = {
    username: String,
    password: String,
    email: String,
    info: String,
    avatar: String
}

const userModel = mongoose.model('user', new mongoose.Schema(userType, { collection: 'user' , _id: true}));

module.exports = userModel;