// initialize the user service
const db = require("../db/db"); // Import the db variable correctly
const RecipeService = require("../service/recipe");
const recipeService = new RecipeService(db);

const app = require("../config/app");

class RecipeController {
  // this represents the req and res objects from the server
  // the server receives the req and sends the res
  async listAll(req, res) {
    try {
      const recipeList = await recipeService.listAll();
      //res.json(recipeList);
      //res.redirect("/recipe"); // Redirect to the "/recipe" page
      res.render("recipe", { recipes: recipeList });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listAdded(req, res) {
    try {
      const recipeList = await recipeService.listAdded();
      res.json(recipeList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async search(req, res) {
    try {
      const { keyword } = req.params;
      const recipeList = await recipeService.search(keyword);
      res.json(recipeList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async add(req, res) {
    // note need to add logic to redirect to user login if user currently not logged in (user_id = null). Else, proceed with add recipe request
    //option 2: no need to create check here, simply the user can't see the add feature if not logged in
    //console.log("add params", req.params);
    try {
      const recipeData = req.body;
      await recipeService.add(recipeData);
      res.status(201).json("Recipe added!");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async edit(req, res) {
    // note need to add logic to redirect to user login if user currently not logged in (user_id = null). Else, proceed with add recipe request
    //option 2: no need to create check here, simply the user can't see the add feature if not logged in
    //console.log("add params", req.params);
    try {
      const recipeData = req.body;
      const { recipeId } = req.params;
      await recipeService.edit(recipeData, recipeId);
      res.status(201).json("Recipe updated!");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    // note need to add logic to redirect to user login if user currently not logged in (user_id = null). Else, proceed with add recipe request
    //option 2: no need to create check here, simply the user can't see the add feature if not logged in
    //console.log("add params", req.params);
    try {
      //const recipeData = req.body;
      const { recipeId } = req.params;
      await recipeService.delete(recipeId);
      res.status(201).json("Recipe deleted!");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new RecipeController();
