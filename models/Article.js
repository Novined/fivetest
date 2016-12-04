var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: { type: String },
    link: { type: String },
    date: { type: Date },
});

const Article = mongoose.model('Article', ArticleSchema);