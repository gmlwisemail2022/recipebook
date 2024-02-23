// Set up all recipe services/ methods here:
// current list of methods are: list, search, add, *edit, delete, favorite, and unfavorite

const { config } = require("dotenv");
const db = require("../db/db");

class RecipeService {
  constructor(db) {
    this.db = db;
  }

  // insert recipe methods here:

  //list all recipes
  async listAll() {
    try {
      const recipeList = await this.db("recipes").select("*");
      console.log("total otabined:", recipeList.length);
      return recipeList;
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      throw error;
    }
  }

  //list all recipes by meal type
  async listMeal(param) {
    try {
      const recipeList = await this.db("recipes")
        .select("*")
        .where({ meal_type: param });
      console.log("obtained all recipes for param", param);
      console.log("total otabined:", recipeList.length);
      return recipeList;
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      throw error;
    }
  }

  //list all recipes by cuisine
  async listCuisine(param) {
    try {
      const recipeList = await this.db("recipes")
        .select("*")
        .where({ cuisine: param });
      console.log("obtained all recipes for param", param);
      console.log("total otabined:", recipeList.length);
      return recipeList;
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      throw error;
    }
  }

  //list specific recipe by recipeId
  async listDetail(recipeId) {
    try {
      const recipeList = await this.db("recipes")
        .select("*")
        .where({ recipe_id: recipeId });
      return recipeList;
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      throw error;
    }
  }

  //list only recipes added by a specific user (for dashboard listing)
  async listUserRecipe(userId) {
    console.log("looking for user added recipe in db");
    try {
      //temp override
      userId = 3;
      const recipeList = await this.db("recipes")
        .select("*")
        .where({ user_id: userId });
      console.log("recipe obtained by user: ", recipeList[0].user_id);
      return recipeList;
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      throw error;
    }
  }

  //search recipe
  async search(keyword) {
    try {
      const recipes = await this.db("recipes")
        .whereRaw(`LOWER(title) LIKE LOWER('%${keyword}%')`) // we convert both search string and database search
        .orWhereRaw(`LOWER(ingredients) LIKE LOWER('%${keyword}%')`) // into lower case to make it case-insensitive
        .orWhereRaw(`LOWER(instructions) LIKE LOWER('%${keyword}%')`)
        .select("*");
      return recipes; // returns array of valid rows
    } catch (error) {
      throw new Error("Error searching for recipes: " + error.message);
    }
  }

  // Add recipe method

  async add(recipeData, userId) {
    try {
      console.log("adding new recipe to db");
      // Insert the new recipe into the database
      const newRecipe = await this.db("recipes")
        .insert({
          title: recipeData.title,
          meal_type: recipeData.meal_type,
          cuisine: recipeData.cuisine,
          servings: recipeData.servings,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .returning("*");

      return newRecipe[0];
    } catch (error) {
      throw new Error("Error adding recipe: " + error.message);
    }
  }

  //edit recipe
  async edit(recipeData, recipeId) {
    try {
      const { title, ingredients, servings, instructions, user_id } =
        recipeData; //<< to pass user_id as well

      const newRecipe = await this.db("recipes")
        .update({
          title,
          meal_type,
          cuisine,
          ingredients,
          servings,
          instructions,
          user_id,
          updated_at: new Date().toISOString(), // update only the update date (create date reamin unchanged)
        })
        .where({ user_id: user_id })
        .where({ recipe_id: recipeId })
        .returning("*");
      console.log("returned edited", newRecipe);
      return newRecipe[0];
    } catch (error) {
      throw new Error("Error updating recipe: " + error.message);
    }
  }

  //delete recipe (delete a specific recipe and all its favorites)
  async delete(recipeId) {
    const deleteFavoritesResult = await this.db("favorites") //delete favorites first because this is the sub table
      .delete()
      .where({ recipe_id: recipeId });
    const deleteRecipeResult = await this.db("recipes") // delete recipe
      .delete()
      .where({ recipe_id: recipeId });
    if (deleteFavoritesResult === 0 && deleteRecipeResult === 0) {
      throw new Error("Item not found");
    }
    return "Done";
  }

  //favorite a recipe
  async favorite(userId, recipeId) {
    try {
      // Check if the recipeId exists in the favorites table
      const favorite = await this.db("favorites")
        .where("user_id", userId)
        .where("recipe_id", recipeId)
        .first();

      if (favorite) {
        console.log(
          `Recipe with ID: ${recipeId} is already in favorites for user with ID: ${userId}`
        );
      } else {
        // The userId and recipeId are not found in favorites, so add them
        const newFavorite = await this.db("favorites")
          .insert({
            user_id: userId,
            recipe_id: recipeId,
            created_at: new Date().toISOString(), // Set the created_at value to the current timestamp
          })
          .returning("*");

        if (newFavorite.length > 0) {
          console.log(
            `Added recipe with ID: ${recipeId} to favorites for user with ID: ${userId}`
          );
          return newFavorite[0];
        } else {
          throw new Error(
            `Failed to add recipe with ID: ${recipeId} to favorites for user with ID: ${userId}`
          );
        }
      }
    } catch (error) {
      console.error("Error adding recipe to favorites:", error);
      return null;
    }
  }

  // unfavorite recipe
  async unfavorite(userId, recipeId) {
    try {
      // Check if the recipeId exists in the favorites table
      const favorite = await this.db("favorites")
        .where("user_id", userId)
        .where("recipe_id", recipeId)
        .first();

      if (favorite) {
        // The userId and recipeId are found in favorites, so delete it
        const deletedFavorite = await this.db("favorites")
          .where("user_id", userId)
          .where("recipe_id", recipeId)
          .delete()
          .returning("*");
        console.log(`Removed recipe with ID: ${recipeId} from favorites`);
        return favorite;
      } else {
        console.log(
          `Recipe with ID: ${recipeId} is not in favorites for user with ID: ${userId}`
        );
      }
    } catch (error) {
      console.error("Error removing recipe from favorites:", error);
    }
  }
}

module.exports = RecipeService;
