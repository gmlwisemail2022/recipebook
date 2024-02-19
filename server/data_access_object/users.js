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
    // Function to update a user's password
    async updatePassword(username, password) {
        await db('users')
        // PSQL equivalent: UPDATE users SET password = password WHERE username = username
            .where({username})
            .update({password});
    }
    // Function to update a user's email
    async updateEmail(username, email) {
        await db('users')
        // PSQL equivalent: UPDATE users SET email = email WHERE username = username
            .where({username})
            .update({email});
    }
    // Function to update users admin status
    async updateAdmin(username, admin) {
        await db('users')
        // PSQL equivalent: UPDATE users SET admin = admin WHERE username = username
            .where({username})
            .update({admin});
    }
}

module.exports = new UserDAO;