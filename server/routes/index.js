/* SET UP ROUTER FOR CRUD OPERATIONS
 */
const express = require("express");
// imports module for handling user related CRUD operations
const userController = require("../controller/users.js");
const router = express.Router();

// CRUD operations for users table
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
// Update a user's full name, in the browser. Make sure to use the correct URL: http://localhost:3000/user/:username
router.put("/user/updateFullName/:username", userController.updateFullName);
// Delete a user in the browser. Make sure to use the correct URL: http://localhost:3000/user/:username
router.delete("/user/:username", userController.deleteUser);

//recipe routes     -temp- (glen added feb 19)
// temp note: flow change index.js >> recipeController >> RecipeService instead of index.js >> RecipeService
const recipeController = require("../controller/recipe.js");

// list all the recipes via url http://localhost:3000/recipe/list
router.get("/recipe", recipeController.listAll.bind(recipeController));
// lets user see the list of added recipe (don't include recipe from other users) via url http://localhost:3000/recipe/list/:userId
router.get(
  "/recipe/list/:userId",
  recipeController.listAdded.bind(recipeController)
);
//search a recipe via url http://localhost:3000/recipe/:keyword
router.post(
  "/recipe/search/:keyword",
  recipeController.search.bind(recipeController)
);
//add a recipe via url http://localhost:3000/recipe/add
router.post("/recipe/add", recipeController.add.bind(recipeController)); // add a new recipe
// lets user edit added recipe via url http://localhost:3000/recipe/edit/:recipeId
router.put(
  "/recipe/edit/:recipeId",
  recipeController.edit.bind(recipeController)
);
// lets user delete added recipe via url http://localhost:3000/recipe/delete/:recipeId
router.delete(
  "/recipe/delete/:recipeId",
  recipeController.delete.bind(recipeController)
);

// all routes above are tested ok via postman (except for: http://localhost:3000/recipe/list/:userId)
/*
// may not to be routed via url instead use a button and directly update the database when a button is clicked on the front end
router.post("/favorite/:id", recipeService.favorite.bind(recipeService));
router.post("/unfavorite/:id", recipeService.unfavorite.bind(recipeService));
*/

// Export the router to be used in the app.js file
module.exports = router;
