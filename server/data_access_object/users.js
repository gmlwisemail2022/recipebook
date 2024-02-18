// Purpose: Define the data access object for the users table in the database.
// This file is used to interact with the database to perform CRUD operations on the users table.
const db = require("../db/db.js");

class UserDAO {
    // Create a new user
    // first input each parameter as an argument
    async createUser(username, password, email, full_name, admin) {
        // inserts each element into the users table in this order
        // PSQL equivalent: INSERT INTO users (username, password, email, full_name, admin) VALUES (username, password, email, full_name, admin)
        const [id] = await db('users')
            .insert({
                username,
                password,
                email,
                full_name,
                admin,
            })
            .returning("user_id");
        return id;
    }
    // Function to get a user by their username
    async getUser(username) {
        // waits for db query to finish
        // the query is for the table named users
        const user = await db('users')
        // filters results based on the username parameter
        // PSQL equivalent: SELECT * FROM users WHERE username = username
            .where({username})
            // returns the first result in the query
            .first();
        return user;
    }
}

module.exports = new UserDAO;