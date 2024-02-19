// imports the data access object for users and creates a user service class
const userDAO = require("../data_access_object/users.js");

class UserService {
    // userDto is an object with the following properties: username, password, email, full_name, admin
    async createUser(userDto) {
        const {username, password, email, full_name, admin} = userDto;
        // calls the createUser method from the userDAO
        const id = await userDAO.createUser(username, password, email, full_name, admin);
        return id;
    }
    async getUser(username) {
        // calls the getUser method from the userDAO
        const user = await userDAO.getUser(username);
        return user;
    }
    async updatePassword(username, password) {
        // calls the updatePassword method from the userDAO
        await userDAO.updatePassword(username, password);
    }
}

module.exports = new UserService;