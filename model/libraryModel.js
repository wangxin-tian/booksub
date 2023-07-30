const mongoose = require('mongoose');
const lib = require('node-dev');

const chapterSchema = new mongoose.Schema({
  chapterNumber: Number,
  content: String
});

const bookSchema = {
  title: String,
  author: String,
  chapters: [chapterSchema]
};

const libModel = mongoose.model('library', new mongoose.Schema(bookSchema,{collection: 'library', _id: true }));

module.exports = libModel;