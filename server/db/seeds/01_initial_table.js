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
      meal_type: "appetizer",
      cuisine: "European",
      ingredients:
        "3 1/2 c Chicken broth; homemade|1 lb Fresh spinach; wash/trim/chop|1 Egg|1 c Grated parmesan cheese; --or--|1 c Romano cheese; freshly grated|Salt and pepper; to taste.",
      servings: "4 servings",
      instructions:
        'Bring 1 cup of the broth to a boil. Add spinach and cook until softened but still bright green. Remove spinach with a slotted spoon and set aside. Add remaining broth to pot. Bring to a boil. Meanwhile, beat egg lightly with a fork. Beat in 1/4 cup of cheese. When broth boils pour in egg mixture, stirring constantly for a few seconds until it cooks into "rags." Add reserved spinach, salt and pepper. Serve immediately, passing remaining cheese. NOTES: Someone asked for this recipe a while back. I believe this soup, known as "Stracciatella" is synonymous with Italian Wedding Soup, however, I seem to remember from I-don"t-know-where that Italian Wedding Soup is the same as this but with the addition of tiny meatballs.',
      user_id: 1,
    },
    {
      title: "Italian Wedding Soup",
      meal_type: "appetizer",
      cuisine: "European",
      ingredients:
        "1/2 lb Ground beef|1/2 lb Ground veal|1/4 c Italian seasoned bread crumb|1 Egg|1 tb Parsley|Salt and pepper to taste|4 c Chicken broth|2 c Spinach leaves cut into piec|1/4 c Grated Pecorino Romano cheese",
      servings: "1 Servings",
      instructions:
        "Combine the ground meat, bread crumbs, egg, parsley, salt and pepper in a bowl. Mix well and form into tiny meat balls. Bake on a cookie sheet for 30 minutes at 350F. Meanwhile, bring broth to a boil and add spinach. Cover and boil for 5 minutes. Add the meatballs to the hot broth, bring to a simmer. Stir in the cheese and serve immediately. Rita in Scottsdale 01/02/92 01:41 am",
      user_id: 2,
    },
    {
      title: "Chinese Dumplings",
      meal_type: "appetizer",
      cuisine: "Asian",
      ingredients:
        " 3 cups all-purpose flour, 1/4 teaspoon kosher salt, 1 1/4 cups cold water, 1 pound ground pork or ground beef, 1 tablespoon soy sauce, 1 teaspoon kosher salt, 1 tablespoon Chinese rice wine or dry sherry, 1/4 teaspoon freshly ground white pepper, 3 tablespoons sesame oil, 1/2 medium scallion, finely minced, 1 1/2 cups finely shredded napa cabbage, 1/4 cup shredded bamboo shoots, 1 tablespoon minced fresh ginger, 1 clove garlic, minced",
      servings: "15 Servings",
      instructions:
        " Place the flour in a bowl and stir in the salt. Slowly stir in the cold water, adding only as much as is necessary to form a smooth dough. Slightly lumpy dumpling dough in a bowl. Place the dough on a flat surface and knead into a smooth ball. Cover the dough and let it rest for at least 30 minutes. While the dough is resting, make the filling. Place the meat in a bowl and add the soy sauce, salt, rice wine, and pepper. Stir in only one direction. Add the remaining filling ingredients and mix well, stirring in the same direction until the mixture is sticky. Knead the dough again until it forms a smooth ball. Divide the dough into 60 pieces, with each piece weighing about 1/2 ounce (15 grams). Roll each piece out into a circle about 3 inches in diameter, lightly flouring the surface as needed to keep the dough from sticking. Place a small portion (about 1 level tablespoon) of the filling into the middle of each wrapper. Wet the edges of the dumpling with water. For a pleated look, gently lift the edges of the wrapper over the filling and bring it together at the top center. Crimp the edges of the wrapper several times along the edge and pinch together to seal. For an easier option, simply fold the dough over the filling into a half-moon shape and pinch the edges to seal. Repeat with the remaining wrappers and filling. Bring a large pot of water to a boil. Add half the dumplings, giving them a gentle stir so they don't stick together. Once the water returns to a boil, add 1/2 cup of cold water and cover the pot. Once the water returns to a boil, add another 1/2 cup of cold water and cover.When the water comes to a boil again, the dumplings should be fully cooked and ready to be removed from the pot and drained. You can cut open a test dumpling just to make sure. If desired, they can be pan-fried at this point. Add 3 tablespoons of oil to a frying pan and cook until slightly golden.",
      user_id: 3,
    },
  ]);
  await knex("favorites").insert([
    { user_id: 1, recipe_id: 1 },
    { user_id: 2, recipe_id: 2 },
    { user_id: 3, recipe_id: 2 },
  ]);
};
