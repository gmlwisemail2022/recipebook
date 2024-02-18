/* SET UP ROUTER FOR CRUD OPERATIONS 
*/
const express = require("express");
// imports module for handling user related CRUD operations
const userController = require("../controller/users.js");
const router = express.Router();


// CRUD operations
// Create a user in the browser. Make sure to use the correct URL: http://localhost:3000/user
router.post("/user", userController.createUser);
// Read a user in the browser. Make sure to use the correct URL: http://localhost:3000/user/:username
router.get("/user/:username", userController.getUser);

// Export the router to be used in the app.js file
module.exports = router;

