const userDAO = require("../data_access_object/users.js");

class UserService {
    async createUser(userDto) {
        const {username, password, email, full_name, admin} = userDto;
        const id = await userDAO.createUser(username, password, email, full_name, admin);
        return id;
    }
    async getUser(username) {
        const user = await userDAO.getUser(username);
        return user;
    }
}

module.exports = new UserService;