// initialize the user service
const userService = require("../service/users.js");

// All user related CRUD operations are handled in the user controller
class UserController {
    // this represents the req and res objects from the server
    // the server receives the req and sends the res
    async createUser(req, res) {
        try {
            // userDto is an object with the following properties: username, password, email, full_name, admin
            // that the client sends in the request body
            const userDto = req.body;
            await userService.createUser(userDto);
            // if the status is 201, we will know that the request was successful
            res.status(201).json({message: `Welcome ${userDto.username}, thanks for creating an account!`});
        } catch (error) {
            // if the status is 500, we will know that there was an error in the server
            res.status(500).json({error: error.message});
        }
    }
    async getUser(req, res) {
        try {
            // the req is the parameter username from the client
            const username = req.params.username;
            // calls the getUser method from the user service
            const user = await userService.getUser(username);
            // if the status is 200, json will return the user object
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
    async updatePassword(req, res) {
        try {
            // the req is the parameter username from the client
            const username = req.params.username;
            // the req is the parameter password from the client
            const password = req.body.password;
            // calls the updatePassword method from the user service
            await userService.updatePassword(username, password);
            res.status(200).json({message: "Password updated"});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
    async updateEmail(req, res) {
        try {
            // the req is the parameter username from the client
            const username = req.params.username;
            // the req is the parameter email from the client
            const email = req.body.email;
            // calls the updateEmail method from the user service
            await userService.updateEmail(username, email);
            res.status(200).json({message: "Email updated"});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
    async updateAdmin(req, res) {
        try {
            // the req is the parameter username from the client
            const username = req.params.username;
            // the req is the parameter admin from the client
            const admin = req.body.admin;
            // calls the updateAdmin method from the user service
            await userService.updateAdmin(username, admin);
            res.status(200).json({message: "Admin status updated"});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
}

module.exports = new UserController;