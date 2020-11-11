const mongoose = require('mongoose');
const { schema } = require('./post');
const Schema = mongoose.Schema;

const hermUnitSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Unit', hermUnitSchema);
