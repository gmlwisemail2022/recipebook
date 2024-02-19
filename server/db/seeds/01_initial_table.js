/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 * TO RUN SEEDS: npx knex seed:run --knexfile db/knexfile.js
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("recipes").del();
  await knex("favorites").del();
  await knex("users").insert([
    {
      username: "Sam",
      password: "password",
      email: "sam@sam.com",
      full_name: "Sam Walters",
      admin: false,
    },
    {
      username: "Dominic",
      password: "password",
      email: "dominic@dominic.com",
      full_name: "Dominic Francis",
      admin: true,
    },
    {
      username: "Glen",
      password: "password",
      email: "glen@glen.com",
      full_name: "Glen Lau",
      admin: true,
    },
  ]);
  await knex("recipes").insert([
    {
      title: "Stracciatella (Italian Wedding Soup)",
      ingredients:
        "3 1/2 c Chicken broth; homemade|1 lb Fresh spinach; wash/trim/chop|1 Egg|1 c Grated parmesan cheese; --or--|1 c Romano cheese; freshly grated|Salt and pepper; to taste.",
      servings: "4 servings",
      instructions:
        'Bring 1 cup of the broth to a boil. Add spinach and cook until softened but still bright green. Remove spinach with a slotted spoon and set aside. Add remaining broth to pot. Bring to a boil. Meanwhile, beat egg lightly with a fork. Beat in 1/4 cup of cheese. When broth boils pour in egg mixture, stirring constantly for a few seconds until it cooks into "rags." Add reserved spinach, salt and pepper. Serve immediately, passing remaining cheese. NOTES: Someone asked for this recipe a while back. I believe this soup, known as "Stracciatella" is synonymous with Italian Wedding Soup, however, I seem to remember from I-don"t-know-where that Italian Wedding Soup is the same as this but with the addition of tiny meatballs.',
    },
    {
      title: "Italian Wedding Soup",
      ingredients:
        "1/2 lb Ground beef|1/2 lb Ground veal|1/4 c Italian seasoned bread crumb|1 Egg|1 tb Parsley|Salt and pepper to taste|4 c Chicken broth|2 c Spinach leaves cut into piec|1/4 c Grated Pecorino Romano cheese",
      servings: "1 Servings",
      instructions:
        "Combine the ground meat, bread crumbs, egg, parsley, salt and pepper in a bowl. Mix well and form into tiny meat balls. Bake on a cookie sheet for 30 minutes at 350F. Meanwhile, bring broth to a boil and add spinach. Cover and boil for 5 minutes. Add the meatballs to the hot broth, bring to a simmer. Stir in the cheese and serve immediately. Rita in Scottsdale 01/02/92 01:41 am",
    },
  ]);

  await knex("stock").insert([
    { user_id: 1, recipe_id: 1 },
    { user_id: 1, recipe_id: 2 },
    { user_id: 2, recipe_id: 2 },
  ]);
};
