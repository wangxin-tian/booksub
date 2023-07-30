const mongoose = require('mongoose');

const bookType = {
    title: String,
    author: String,
    publisher: String,
    cateName: String,
    imgUrl: String,
    info: String
}
const bookModel = mongoose.model('book', new mongoose.Schema(bookType, { collection: 'book', _id: true }));

module.exports = bookModel;