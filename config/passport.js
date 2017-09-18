// config/passport.js

var LocalStrategy = require('passport-local').Strategy;

// load user model
var User = require('../app/models/user')

// expose to app
module.exports = function(passport) {

    /** HANDLE SIGNUP */

    // serialize user for session
    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })

    // deserialize user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user)
        })
    })

    /* Local signup */
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username/password. Override for email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, done) {
        process.nextTick(function() {
            // find user who's email is the same as the form's
            // check to see if user trying to login already exists
            User.findOne({'local.username': username}, function(err, user) {
                if(err) {
                    return done(err)
                }

                // check to see if user exists
                if(user) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'))
                } else {
                    // if there isn't a user with that email
                    var newUser = new User()

                    // set the user's credentials
                    newUser.local.username = username
                    newUser.local.password = newUser.generateHash(password)

                    // save this user
                    newUser.save(function(err) {
                        if(err) {
                            throw err
                        }

                        return done(null, newUser)
                    })
                }
            })
        })
    }
    ))

    /** HANDLE LOGIN */
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.findOne({ 'local.username': username }, function(err, user) {
            if(err) {
                return done(err)
            }

            // if there is no user
            if(!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.'))
            }

            // if user is found but wrong password
            if(!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Wrong username/password combination'))
            }

            // return successful user
            return done(null, user)
        })
    }
    ))
}