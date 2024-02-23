// this is the recipe logic for the client side to handle the recipe page

// -= All event listeners =-

// Favorites (Heart button)
const heartButtons = document.querySelectorAll(".heart-button"); // Get all heart buttons

// Attach event listener to each heart button
heartButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const recipeId = this.getAttribute("data-recipe-id");
    console.log("recipeId", recipeId);
    toggleFavorite(recipeId);
  });
});

// Attach event listener to the form submission
const form = document.getElementById("recipeForm");
form.addEventListener("submit", submitForm);

// all the front-end recipe functions listed below:
// function to filter the recipes by a specific cuisine
async function filterByParam(param) {
  console.log("search for recipe via param ", param);
  try {
    console.log("request url:", `/recipe/${param}`);
    const data = await $.ajax({
      url: `/recipe/${param}`,
      type: "GET",
    });
    //console.log(data);
    // Redirect to the recipe page
    window.location.href = `/recipe/${param}`;
    // Example: displayRecipes(data);
  } catch (error) {
    // Handle any errors that occurred during the AJAX request.
    console.log("request error url:", `/recipe/${param}`);
    console.error(error);
  }
}

async function recipeClick(recipeId) {
  console.log("recipe clicked for recipe", recipeId);
  try {
    console.log("request url:", `/recipe/details/${recipeId}`);
    const data = await $.ajax({
      url: `/recipe/details/${recipeId}`,
      type: "GET",
    });
    // Direct to the recipe Detail page
    window.location.href = `/recipe/details/${recipeId}`;
    //isplayRecipeDetails(data); // Pass the data to the display function
    // Example: displayRecipes(data);
  } catch (error) {
    console.log("request error url:", `/recipe/details/${recipeId}`);
    console.error(error);
  }
}

async function dashboardClick(userId) {
  console.log("dashboard clicked for userid", userId); // Log the original userId first
  userId = 3; // Temporarily set userId to 3
  try {
    await fetch(`/dashboard/${userId}`, {
      method: "GET",
    });
    // Direct to the dashboard page
    window.location.href = `/dashboard/${userId}`;
  } catch (error) {
    // Handle any errors that occurred during the AJAX request.
    console.log("request error url:", `/dashboard/${userId}`);
    console.error(error);
  }
}

// Function to toggle favorite
async function toggleFavorite(recipeId) {
  console.log("checking favorite");

  const button = document.querySelector(
    `.heart-button[data-recipe-id="${recipeId}"]`
  );
  const icon = button.querySelector(".heart-icon");
  const isFavorite = icon.classList.contains("fas");
  const userId = 3; //temporary hardcoded userid
  if (isFavorite) {
    // Remove from favorites
    console.log("removing favorite");
    removeFromFavorites(userId, recipeId);
    icon.classList.remove("fas");
    icon.classList.add("far");
    icon.style.color = ""; // Reset color to default
  } else {
    // Add to favorites
    console.log("adding favorite");
    addToFavorites(userId, recipeId);
    icon.classList.remove("far");
    icon.classList.add("fas");
    icon.style.color = "red";
  }
}

// Function to add to favorites
async function addToFavorites(userId, recipeId) {
  userId = 3; // temp override user id
  try {
    await fetch(`/favorites/${userId}/${recipeId}`, {
      method: "POST",
    });
    console.log("Added recipe with ID:", recipeId, "to favorites");
  } catch (error) {
    console.error("Error adding recipe to favorites:", error);
  }
}

// Function to remove favorites
async function removeFromFavorites(userId, recipeId) {
  userId = 3; // temp override user id
  try {
    await fetch(`/favorites/${userId}/${recipeId}`, {
      method: "DELETE",
    });
    console.log("Removed recipe with ID:", recipeId, "from favorites");
  } catch (error) {
    console.error("Error removing recipe from favorites:", error);
  }
}

// all front-end dashboard related functions below:

async function submitForm(event) {
  event.preventDefault(); // Prevent default form submission behavior

  // Get the form data
  const formData = new FormData(form);
  const recipeData = {
    title: formData.get("title"),
    meal_type: formData.get("meal_type"),
    cuisine: formData.get("cuisine"),
    servings: formData.get("servings"),
    ingredients: formData.get("ingredients"),
    instructions: formData.get("instructions"),
  };

  // Check if any of the required fields are blank
  for (const key in recipeData) {
    if (recipeData[key].trim() === "") {
      alert("Please fill in all the required fields.");
      return false; // Return false to prevent form submission
    }
  }

  console.log("Form data:", recipeData);

  const userId = 3; // Temporary user id
  try {
    const response = await fetch(`/dashboard/submit/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
      body: JSON.stringify(recipeData),
    });
    console.log("Form submitted successfully");
    // Handle the response as needed
  } catch (error) {
    console.error("Error submitting form:", error);
    // Handle any errors that occurred during the form submission
  }
}
