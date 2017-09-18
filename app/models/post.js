// app/models/post.js

var mongoose = require('mongoose')

// define schema for post model
var postSchema = mongoose.Schema({
    post: {
        title: String,
        link: String,
        user: String
    }
})

// create the model for posts and expose to the app
module.exports = mongoose.model('Post', postSchema)