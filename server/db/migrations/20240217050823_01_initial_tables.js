/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return (
    knex.schema
      .createTable("users", (table) => {
        table.increments("id").primary();
        table.string("username").notNullable();
        table.string("password").notNullable();
        table.stringl("email").notNullable();
        table.string("full_name").notNullable();
        table.boolean("admin").notNullable();
      })
      // create promises - one table at a time
      .then(() => {
        return knex.schema.createTable("recipes", (table) => {
          table.increments("id").primary();
          table.string("title").notNullable();
          table.string("ingredients").notNullable();
          table.string("servings").notNullable();
          table.string("instructions").notNullable();
          table.string("user_id").references("users.id");
        });
      })
      .then(() => {
        return knex.schema.createTable("favorites", (table) => {
          table.increments("id").primary();
          table.string("user_id").references("users.id");
          table.string("recipe_id").references("recipes.id");
        });
      })
  );
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users").then(() => {
    return knex.schema.dropTable("recipes").then(() => {
      return knex.schema.dropTable("favorites");
    });
  });
};
