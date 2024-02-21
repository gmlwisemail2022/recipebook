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
      console.log(recipeList);
      return recipeList;
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      throw error;
    }
  }

  //list only recipes added by a specific user
  async listAdded(id) {
    try {
      const recipeList = await this.db("recipes")
        .select("*")
        .where({ user_id: id });
      console.log(recipeList);
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

  //add recipe
  async add(recipeData) {
    try {
      const { title, ingredients, servings, instructions, user_id } =
        recipeData; //<< to pass user_id as well

      const newRecipe = await this.db("recipes")
        .insert({
          title,
          ingredients,
          servings,
          instructions,
          user_id,
          created_at: new Date().toISOString(), // Set the created_at value to the current timestamp
          updated_at: new Date().toISOString(), // same create and update date during creation
        })
        .returning("*");
      return newRecipe[0];
    } catch (error) {
      throw new Error("Error creating recipe: " + error.message);
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

  //favorite recipe
  async favorite(userId, recipeId) {
    try {
      const newFavorite = await this.knex("favorites")
        .insert({
          user_id: userId,
          recipe_id: recipeId,
          created_at: new Date().toISOString(), // Set the created_at value to the current timestamp
        })
        .returning("*");
      return newFavorite[0];
    } catch (error) {
      throw new Error("Error favoriting recipe: " + error.message);
    }
  }

  //unfavorite recipe
  async unfavorite(userId, recipeId) {
    try {
      const deletedFavorite = await this.knex("favorites")
        .where({ user_id: userId, recipe_id: recipeId })
        .delete()
        .returning("*");
      return deletedFavorite[0];
    } catch (error) {
      throw new Error("Error unfavoriting recipe: " + error.message);
    }
  }
}

module.exports = RecipeService;
