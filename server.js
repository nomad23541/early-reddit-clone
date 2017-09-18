var express = require('express')
var app = express()
var port = process.env.PORT || 8080
var mongoose = require('mongoose')
var passport = require('passport')
var flash = require('connect-flash')

var morgan = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')

var configDB = require('./config/database.js')

// connect to database  
mongoose.connect(configDB.url) 
mongoose.set('debug', true)

// set up express app
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser())

app.use(express.static('static'))
app.set('view engine', 'ejs')

app.use(session({ secret: 'ilovehaedyn123'}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(function(req, res, next) {
    if(req.session.user) {
        res.locals.user = req.session.user
    }

    next()
})

// pass passport for configuration
require('./config/passport')(passport)

// get the routes
require('./app/routes.js')(app, passport)

// launch
app.listen(port)
console.log("Listening on port" + port)