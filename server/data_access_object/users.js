const db = require("../db/db.js");

class UserDAO {
    async createUser(username, password, email, full_name, admin) {
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
    async getUser(username) {
        const user = await db('users')
            .where({username})
            .first();

        return user;
    }
}

module.exports = new UserDAO;