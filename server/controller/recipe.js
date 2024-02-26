// Import the db variable correctly
const db = require("../db/db");
const RecipeService = require("../service/recipe");
const recipeService = new RecipeService(db);
const app = require("../config/app");
/*added handlebar helper
const Handlebars = require("handlebars");
let favorites = [];
Handlebars.registerHelper("isInFavorites", function (recipeId, favorites) {
  return favorites.includes(recipeId) ? "text-danger" : "";
});
*/

class RecipeController {
  async listAll(req, res) {
    const { param } = req.params;
    console.log("via list all req.params", req.params);
    let recipeList;
    /*
    // Initialize userId
    let userId;
    // Check if user is authenticated
    if (req.isAuthenticated()) {
      userId = req.user.id; // Get user ID if authenticated
    }
    // temp may be  const userId = req.cookies.userId; if the code above does not work

*/
    const userId = 3;
    try {
      // Check the param and fetch recipes accordingly
      switch (true) {
        case !param || param === "List_All":
          recipeList = await recipeService.listAll();
          break;
        case isMealType(param):
          recipeList = await recipeService.listMeal(param);
          break;
        case isCuisine(param):
          recipeList = await recipeService.listCuisine(param);
          break;
        case Number.isInteger(Number(param)):
          recipeList = await recipeService.listRecipe(Number(param));
          break;
        default:
          return res.status(400).json({ error: "Invalid parameter" });
      }

      // If user is authenticated, load their favorites
      /*
      // Map through recipeList to check if each recipe is favorited by the authenticated user
      recipeList = recipeList.map((recipe) => {
        // Check if the recipe ID exists in the favorites of the authenticated user
        const isFavorited = favorites.some(
          (favorite) => favorite.recipe_id === recipe.recipe_id
        );
        // Add a new property to each recipe indicating whether it's favorited by the user
        return { ...recipe, isFavorited };
      });
*/

      // Fetch the user's favorites if userId is available
      let favorites = [];

      if (userId) {
        console.log("list all user id present:", userId);
        favorites = await recipeService.getFavorites(userId);
      }
      // try to attach favorites checking for each recipeList extracted from the table
      recipeList.forEach((recipe) => {
        // Check if the recipe's recipe_id exists in favorites
        const isFavorite = favorites.some(
          (favorite) => favorite.recipe_id === recipe.recipe_id
        );
        // Add isFavorite property to the recipe object
        recipe.isFavorite = isFavorite;
      });

      console.log("favorites present:", favorites.length);

      if (recipeList.length === 0) {
        const message = `No recipe to show for ${param}`;
        res.render("empty-recipe", { message });
      } else {
        console.log("new recipe total from filter", recipeList.length);
        res.render("recipe", {
          recipes: recipeList,
          favorites: favorites,
          isLoggedIn: true,
        });
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

  // get the specific recipe by id for the user to edit
  async getRecipeById(req, res) {
    const { recipeId } = req.params;
    try {
      const recipeData = await recipeService.getRecipe(recipeId);
      res.json(recipeData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // list the details user added recipe
  async listUserRecipe(req, res) {
    console.log("listUserRecipes params", req.params);
    console.log("listUserRecipes bodys", req.body);
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
      const encodedKeyword = req.params.keyword;
      const keyword = decodeURIComponent(encodedKeyword);
      const recipeList = await recipeService.search(keyword);
      console.log("recipeList", recipeList.length);
      if (recipeList.length === 0) {
        console.log("no recipe list!");
        const message = `No recipe to show for your search keyword: ${keyword}`;
        res.render("empty-recipe", { message });
      } else {
        console.log("new recipe total from filter", recipeList.length);
        res.render("recipe", { recipes: recipeList });
      }
    } catch (error) {
      console.log("no recipe found for keyword:", req.params.keyword);
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
      await recipeService.add(recipeData, userId);
      const message = `Recipe ${recipeData.title} Added!`;
      res.status(201).json({ message, redirect: `/dashboard/${userId}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async editRecipe(req, res) {
    console.log("editRecipe - controller");
    try {
      const { userId } = req.params;
      const recipeData = req.body;
      console.log("edit Recipe - controller body:", recipeData);
      await recipeService.edit(recipeData, userId);
      const message = `Recipe ${recipeData.title} Edited!`;
      console.log("return this message for successful edit recipe", message);
      res.status(201).json({ message, redirect: `/dashboard/${userId}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteRecipe(req, res) {
    // note need to add logic to redirect to user login if user currently not logged in (user_id = null). Else, proceed with add recipe request
    //option 2: no need to create check here, simply the user can't see the add feature if not logged in
    //console.log("add params", req.params);
    try {
      const { userId, recipeId } = req.params;
      await recipeService.delete(recipeId);
      // after deleting the recipe, reload the dashboard with updated list of recipes
      console.log("updated recipe list obtained from db to reload dashboard");
      // Send the updated recipe list as a JSON response
      const message = "Recipe deleted!";
      res.status(200).json({ message, redirect: `/dashboard/${userId}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async favorite(req, res) {
    console.log("processing favorite check");
    try {
      const { userId, recipeId } = req.params;
      const favorite = await recipeService.checkFavorites(userId, recipeId);
      console.log("favorite?", favorite);
      if (favorite) {
        // If the favorite already exists, remove it
        console.log("removing favorite - controller");
        await recipeService.unfavorite(userId, recipeId);
        res.status(200).json({ message: "Favorite removed" });
      } else {
        // If the favorite doesn't exist, add it
        console.log("adding favorite - controller");
        await recipeService.favorite(userId, recipeId);
        res.status(200).json({ message: "Favorite added" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  /*
  async unfavorite(req, res) {
    try {
      const { userId, recipeId } = req.params;
      await recipeService.unfavorite(userId, recipeId);
      res.status(201).json("favorite removed!");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  */
}

// server side functions listed here:

// navigation related functions:
//Note: if there would be additional meal types/ cuisine inserted on the navbar dropdown, please add them here:

//function to check if the parameter is a valid meal type
function isMealType(param) {
  console.log("checking meal type where param is", param);
  const validMealTypes = ["appetizer", "entree", "side", "dessert", "drinks"];
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
