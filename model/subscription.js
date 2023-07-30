const mongoose = require('mongoose');

const subscriptionType = {
    user_id: String,
    book_id: String
}

const subscriptionModel = mongoose.model('subscription', 
        new mongoose.Schema(subscriptionType, { collection: 'subscription' , _id: true}));

module.exports = subscriptionModel;