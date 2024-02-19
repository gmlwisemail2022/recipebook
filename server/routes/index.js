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
// Update a user's password, in the browser. Make sure to use the correct URL: http://localhost:3000/user/:username
router.put("/user/updatePassword/:username", userController.updatePassword);
// Update a user's email, in the browser. Make sure to use the correct URL: http://localhost:3000/user/:username
router.put("/user/updateEmail/:username", userController.updateEmail);
// Update a user's admin status, in the browser. Make sure to use the correct URL: http://localhost:3000/user/:username
router.put("/user/updateAdmin/:username", userController.updateAdmin);
// Update a user's username, in the browser. Make sure to use the correct URL: http://localhost:3000/user/:username
router.put("/user/updateUsername/:user_id", userController.updateUsername);


//recipe routes     -temp- (glen added feb 19)
const recipeService = require("../service/recipe");
router.get("/list", recipeService.list.bind(recipeService)); // get the recipe list
router.get("/search/:keyword", recipeService.search.bind(recipeService)); // search a recipe
router.post("/add", recipeService.add.bind(recipeService)); // add a new recipe
// router.put('/edit/:id', this.edit.bind(this)); // Edit a recipe (not yet in function list)
router.delete("/delete/:id", recipeService.delete.bind(recipeService)); // add a new recipe
router.post("/favorite/:id", recipeService.favorite.bind(recipeService));
router.post("/unfavorite/:id", recipeService.unfavorite.bind(recipeService));

// Export the router to be used in the app.js file
module.exports = router;
