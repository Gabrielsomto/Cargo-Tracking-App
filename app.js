const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const { connected } = require('process');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();


//passport config
require('./config/passport')(passport);

// DB config
 const db = require('./config/keys').MongoURI;

 // Connect to Mongo
 mongoose.connect(db, { useNewUrlParser: true })
    .then( () => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


// STATIC FILES
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));


// EJS

app.use(expressLayouts);
app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'));


// Bodyparser
app.use(express.urlencoded({ extended: false }));


// Express Session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());


// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/about', require('./routes/index'));
app.use('/news', require('./routes/index'));
app.use('/contact', require('./routes/index'));
app.use('/track', require('./routes/index'));
app.use('/our-service', require('./routes/index'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));