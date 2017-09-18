// app/models/user.js

var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')

// define schema for user model
var userSchema = mongoose.Schema({
    local: {
        username: String,
        password: String,
    }
})

// generate hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// check if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password)
}

// create the model for users and expose to the app
module.exports = mongoose.model('User', userSchema)