if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const flash = require('express-flash')
const mongoose = require('mongoose')
const passport = require('passport')
const methodOverride = require('method-override')
const LogMiddleware = require("./middleware/log.middleware");

//passport config
require('./passport-config')(passport)

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'absolute secret',
    resave: false,
    saveUninitialized: false
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use(methodOverride('_method'))

mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true }
)

//Import route
const indexRoute = require('./routes/index')
const adminRoute = require('./routes/admin')
const coorRoute = require('./routes/coordinator')
const userRoute = require('./routes/user')

const APIs = require('./api')

app.use('/api', APIs);

//Route middleware
app.use('/', [LogMiddleware], indexRoute)
app.use('/admin', adminRoute)
app.use('/coordinator', coorRoute)
app.use('/user', userRoute)



app.listen(3000)
