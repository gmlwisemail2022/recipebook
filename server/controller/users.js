// initialize the user service
const userService = require("../service/users.js");

// All user related CRUD operations are handled in the user controller
class UserController {
    async createUser(req, res) {
        try {
            const userDto = req.body;
            await userService.createUser(userDto);
            res.status(201).json({message: `Welcome ${userDto.username}, thanks for creating an account!`});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
    async getUser(req, res) {
        try {
            const username = req.params.username;
            const user = await userService.getUser(username);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
}

module.exports = new UserController;