/* Initialize the database connection

    I'm using the default connection details for my local PostgreSQL database.
    I have named the database recipebook on my local machine.
    I have no password and i set a port of 5432 because that's the default port for PostgreSQL.
    Change these details to match your own database connection details.

    Pool is from the pg module, and it's a class that manages a pool of connections to the database.
*/

const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "recipebook",
    password: "",
    port: 5432
});


module.exports = pool;