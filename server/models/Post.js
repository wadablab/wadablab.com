const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const PostSchema = new Schema({
    type:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    cover_path:{
        type: String,
        default: ""
    },
    audio_path:{
        type: String,
        default:""
    },
    video_path:{
        type: String,
        default:""
    },
    insta_link:{
        type: String,
        defalut: ""
    },
    soundcloud_link:{
        type: String,
        defalut: ""
    },
    pinterest_link:{
        type: String,
        defalut: ""
    },
    youtube_link:{
        type: String,
        defalut: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post',PostSchema);