const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const DrawingSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    cover_path:{
        type: String,
        default: "",
        required: true
    },
    createdAt:{
        type:Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Drawing',DrawingSchema);