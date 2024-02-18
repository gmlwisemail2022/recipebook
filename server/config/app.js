// express package
const express = require('express');
// routes for CRUD operations
const router = require('../routes')
// handlebars package
const {engine} = require('express-handlebars');
// app
const app = express();
// change localhost port here

// STATIC FILES
// when using handlebars, etc. it will begin at public level.
// VERY IMPORTANT
app.use(express.static('public'));

// Parse Application
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Set up handlebars
app.engine('hbs', engine({extname: '.hbs'}));
app.set('view engine', 'hbs');

// ROUTES - CRUD operations
app.use(router);


// ROUTES
// Home
app.get('/', (req, res) => {
    res.render('home.hbs')
});

// module is exported to the server
module.exports = app;