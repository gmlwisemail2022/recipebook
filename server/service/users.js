// imports the data access object for users and creates a user service class
const userDAO = require("../data_access_object/users.js");
const bcrypt = require("bcrypt");

class UserService {
    // userDto is an object with the following properties: username, password, email, full_name, admin
    async createUser(userDto) {
        const hashedPassword = await bcrypt.hash(userDto.password, 10);
        userDto.password = hashedPassword;
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
    async getUserByEmail(email) {
        // calls the getUserByEmail method from the userDAO
        const user = await userDAO.getUserByEmail(email);
        return user;
    }
    async updatePassword(username, password) {
        // calls the updatePassword method from the userDAO
        await userDAO.updatePassword(username, password);
    }
    async updateEmail(username, email) {
        // calls the updateEmail method from the userDAO
        await userDAO.updateEmail(username, email);
    }
    async updateAdmin(username, admin) {
        // calls the updateAdmin method from the userDAO
        await userDAO.updateAdmin(username, admin);
    }
    async updateUsername(user_id, username) {
        // calls the updateUsername method from the userDAO
        await userDAO.updateUsername(user_id, username);
    }
    async updateFullName(user_id, full_name) {
        // calls the updateFullName method from the userDAO
        await userDAO.updateFullName(user_id, full_name);
    }
    async deleteUser(username) {
        // calls the deleteUser method from the userDAO
        await userDAO.deleteUser(username);
    }
}

module.exports = new UserService;