const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    url: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    order: {
        type: Number,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
}, {
    collection: 'links',
});

module.exports = mongoose.model('link', linkSchema);