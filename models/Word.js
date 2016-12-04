var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WordSchema = new Schema({
    word: { type: String },
    count: { type: Number }
});

const Word = mongoose.model('Word', WordSchema);