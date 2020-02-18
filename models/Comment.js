var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    title: {
        type: String,
        default: ""
    },
    
    body: {
        type: String,
        default: ""
    }
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;