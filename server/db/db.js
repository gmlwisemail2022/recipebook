// Database connection
const knex = require("knex");
// Connection to the knexfile.js
const config = require("./knexfile.js");

// Set the environment to development, the environment we are currently working in the knexfile.js
const db = knex(config.development);

// export the database connection
module.exports = db;