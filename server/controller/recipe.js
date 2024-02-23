// initialize the user service
const db = require("../db/db"); // Import the db variable correctly
const RecipeService = require("../service/recipe");
const recipeService = new RecipeService(db);

const app = require("../config/app");

class RecipeController {
  // this represents the req and res objects from the server
  // the server receives the req and sends the res

  // list all recipe depending on the param filters
  async listAll(req, res) {
    const { param } = req.params;
    console.log("via list all req.parms", req.params);
    let recipeList;

    // checks whether there is param or none
    switch (true) {
      case !param: // if not param, get all recipes
        // No parameter provided, list all recipes
        recipeList = await recipeService.listAll();
        break;

      case param === "List_All": // if param is List_All, get all recipes
        // No parameter provided, list all recipes
        recipeList = await recipeService.listAll();
        break;

      case isMealType(param): // if param is a valid meal type, get all recipes by meal type
        console.log("obtained param", param);
        // Parameter matches a meal type (isMealType function contains valid meal types)
        recipeList = await recipeService.listMeal(param);
        break;

      case isCuisine(param): // if param is a valid cuisine, get all recipes by cuisine
        console.log("obtained param", param);
        // Parameter matches a cuisine (isCuisine function contains valid cuisines)
        recipeList = await recipeService.listCuisine(param);
        break;

      default:
        console.log("invalid param", param);
        // Invalid parameter, handle error or redirect to a default page
        return res.status(400).json({ error: "Invalid parameter" });
    }

    try {
      if (recipeList.length === 0) {
        const message = `No recipe to show for ${param}`;
        res.render("empty-recipe", { message });
      } else {
        console.log("new recipe total from filter", recipeList.length);
        res.render("recipe", { recipes: recipeList });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // list the details of a recipe
  async listDetail(req, res) {
    const { recipeId } = req.params;
    console.log("req.parms recipeId", req.params);
    try {
      const recipeDetail = await recipeService.listDetail(recipeId);
      console.log("recipe details are:", recipeDetail.length);
      // Split ingredients by comma or semicolon
      recipeDetail[0].ingredients = recipeDetail[0].ingredients.split(/[;,]/);

      // Split instructions by period
      recipeDetail[0].instructions = recipeDetail[0].instructions.split(".");

      res.render("recipe-detail", { recipe: recipeDetail[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // list the details user added recipe

  async listUserRecipe(req, res) {
    const { userId } = req.params;
    console.log(
      "processing list user recipes - controller - user Id is ",
      req.params
    );
    try {
      const recipeList = await recipeService.listUserRecipe(userId);
      res.render("dashboard", { recipes: recipeList });
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
    console.log("add recipe - controller");
    // note need to add logic to redirect to user login if user currently not logged in (user_id = null). Else, proceed with add recipe request
    //option 2: no need to create check here, simply the user can't see the add feature if not logged in
    //console.log("add params", req.params);
    const recipeData = req.body;
    const { userId } = req.params;
    console.log("recipeData", recipeData.length, "userId", userId);
    try {
      const newRecipe = await recipeService.add(recipeData, userId);
      res.status(201).json(newRecipe);
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

  async favorite(req, res) {
    try {
      const { userId, recipeId } = req.params;
      await recipeService.favorite(userId, recipeId);
      res.status(201).json("favorite added!");
    } catch (error) {
      res.status(500).json({ error: "Favorite not updated!" });
    }
  }

  async unfavorite(req, res) {
    try {
      const { userId, recipeId } = req.params;
      await recipeService.unfavorite(userId, recipeId);
      res.status(201).json("favorite removed!");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// server side functions listed here:

// navigation related functions:
//Note: if there would be additional meal types/ cuisine inserted on the navbar dropdown, please add them here:

//function to check if the parameter is a valid meal type
function isMealType(param) {
  console.log("checking cuisine where param is", param);
  const validMealTypes = [
    "Appetizers",
    "Entrees",
    "Sides",
    "Desserts",
    "Drinks",
  ];
  return validMealTypes.includes(param);
}
//function to check if the parameter is a valid cuisine
function isCuisine(param) {
  console.log("checking cuisine where param is", param);
  const validCuisines = [
    "Western",
    "European",
    "Asian",
    "Mediterranean",
    "African",
  ];
  return validCuisines.includes(param);
}

module.exports = new RecipeController();
