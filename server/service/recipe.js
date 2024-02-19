// Set up all recipe services/ methods here:
// current list of methods are: list, search, add, *edit, delete, favorite, and unfavorite

class RecipeService {
  constructor(knex) {
    this.knex = knex;
  }

  // insert recipe methods here:

  //list recipe (get all recipe >>> to determine how many recipes will be selected or to get all then split into pages)
  async list() {
    recpieList = await this.knex("recipes").select("*");
    return recipeList;
  }

  //search recipe
  async search(keyword) {
    try {
      const recipes = await this.knex("recipes")
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
      const newRecipe = await this.knex("recipes")
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

  //edit recipe (shelf - not priority as of the moment)

  //delete recipe (delete a specific recipe)
  async delete(id) {
    await this.knex("favorites") //delete favorites first because this is the sub table
      .delete()
      .where({ recipe_id: id });
    await this.knex("recipes") // delete recipe
      .delete()
      .where({ recipe_id: id });
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

module.exports = new RecipeService();
