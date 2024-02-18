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
}

module.exports = new UserController;