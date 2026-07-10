const mongoose = require('mongoose');

const KnowledgeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    keywords: {
        type: String,
        default: ""
    },

    category: {
        type: String,
        default: ""
    },

    content: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Knowledge", KnowledgeSchema);