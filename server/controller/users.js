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
    async getUserByEmail(req, res) {
        try {
            // the req is the parameter email from the client
            const email = req.params.email;
            // calls the getUserByEmail method from the user service
            const user = await userService.getUserByEmail(email);
            // if the status is 200, json will return the user object
            // res.status(200).json(user);
        } catch (error) {
            // res.status(500).json({error: error.message});
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
            res.status(200).json({message: "Successful Update: Password updated for " + username + " account."});
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
            res.status(200).json({message: "Successful Update: Email updated to " + email + " for " + username + " account."});
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
            res.status(200).json({message: "Successful Update: Admin status updated to " + admin + " for " + username + " account."});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
    async updateUsername(req, res) {
        try {
            // the req is the parameter username from the client
            const user_id = req.params.user_id;
            // the req is the parameter newUsername from the client
            const username = req.body.username;
            // calls the updateUsername method from the user service
            await userService.updateUsername(user_id, username);
            res.status(200).json({message: "Successful Update: Username updated to " + username});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
    async updateFullName(req, res) {
        try {
            // the req is the parameter username from the client
            const username = req.params.username;
            // the req is the parameter full_name from the client
            const full_name = req.body.full_name;
            // calls the updateFullName method from the user service
            await userService.updateFullName(username, full_name);
            res.status(200).json({message: "Successful Update: Full name updated to " + full_name + " for " + username + " account."});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
    async deleteUser(req, res) {
        try {
            // the req is the parameter username from the client
            const username = req.params.username;
            // calls the deleteUser method from the user service
            await userService.deleteUser(username);
            res.status(200).json({message: "User: " + username + " has been deleted."});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
    // login user POST request
    async loginUser(req, res) {
        try {
            // the req is the parameter username from the client
            const username = req.params.username;
            // the req is the parameter password from the client
            const password = req.body.password;
            // calls the loginUser method from the user service
            const user = await userService.loginUser(username, password);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
    async getUserByEmail(req, res) {
        try {
            // the req is the parameter email from the client
            const email = req.params.email;
            // calls the getUserByEmail method from the user service
            const user = await userService.getUserByEmail(email);
            res.status(200).json(user);
        } catch (error) {
            console.log('error in the controller');
            // res.status(500).json({error: error.message});
        }
    }

}

module.exports = new UserController;