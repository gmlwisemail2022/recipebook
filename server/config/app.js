// express package
const express = require('express');
// routes for CRUD operations
const router = require('../routes/index.js');
// routes for authentication
const authRoutes = require('../routes/auth_routes.js');
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


// ROUTES - Authentication
// when using the authRoutes, it will begin at /auth level
app.use('/auth', authRoutes);

// ROUTES
// Home
app.get('/', (req, res) => {
    res.render('home.hbs')
});

// app.get('/auth/login', (req, res) => {
//     res.render('login.hbs')
// });

app.get('/register', (req, res) => {
    res.render('register.hbs')
});

// module is exported to the server
module.exports = app;