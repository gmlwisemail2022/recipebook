/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 * TO RUN MIGRATIONS: npx knex migrate:latest --knexfile db/knexfile.js
 */
exports.up = function (knex) {
  return (
    knex.schema
      .createTable("users", (table) => {
        table.increments("user_id").primary();
        table.string("username").notNullable().unique();
        table.string("password").notNullable();
        table.string("email").notNullable().unique();
        table.string("full_name").notNullable();
        table.boolean("admin").notNullable().defaultTo(false);
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      })
      // create promises - one table at a time
      .then(() => {
        return knex.schema.createTable("recipes", (table) => {
          table.increments("recipe_id").primary();
          table.string("title").notNullable();
          table.string("ingredients").notNullable();
          table.string("servings").notNullable();
          table.string("instructions").notNullable();
          table.timestamp("created_at").defaultTo(knex.fn.now());
          table.timestamp("updated_at").defaultTo(knex.fn.now());
          table.integer("user_id").references("users.user_id");
        });
      })
      .then(() => {
        return knex.schema.createTable("favorites", (table) => {
          table.increments("favorite_id").primary();
          table.timestamp("created_at").defaultTo(knex.fn.now());
          table.timestamp("updated_at").defaultTo(knex.fn.now());
          table.integer("user_id").references("users.user_id");
          table.integer("recipe_id").references("recipes.recipe_id");
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
