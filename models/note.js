const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Note", noteSchema);
