// app/routes.js
var mongoose = require('mongoose')
var Post = require('../app/models/post.js')
var Posts = mongoose.connection.db.collection('posts')

module.exports = function(app, passport) {
    /* Home Page */
    app.get('/', function(req, res) {
        Posts.find({}).toArray(function(err, docs) {
            if (err) throw err;
            
            res.render('index.ejs', {
                user: req.user,
                posts: docs
            })
        })
    })

    /* Login */
    app.get('/login', function(req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        })
    })

    // process login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }))

    /* Signup */
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        })
    })

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }))

    /* Post */
    app.get('/post', isLoggedIn, function(req, res) {
        res.render('post.ejs', {
            user: req.user
        })
    })

    app.post('/post', function(req, res) {
        var p = new Post()

        p.post.title = req.body.title
        p.post.link = req.body.link
        p.post.user = req.user.local.username

        p.save(function(err) {
            if(err) {
                throw err
            } else {
                console.log('submitted post successfully')
            }
        })

        res.redirect('/')
    })

    /* Profile */
    app.get('/profile', isLoggedIn, function(req, res) {
        Posts.find({}).toArray(function(err, docs) {
            if (err) throw err;
            
            res.render('profile.ejs', {
                user: req.user,
                posts: docs
            })
        })
    })

    /* Logout */
    app.get('/logout', function(req, res) {
        req.logout()
        res.redirect('/')
    })
    
    /* Remove */
    app.get('/remove', isLoggedIn, function(req, res) {
        removeById(req, res, 'Post', req.query.id)
    })
}

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }

    res.redirect('/')
}

function removeById(req, res, model, id) {
    mongoose.model(model).findOneAndRemove({ _id: id }, function(err, doc) {
        if(err) console.log(err)
        res.redirect(req.get('referer')) // refresh current page
    })
}