// this is the recipe logic for the client side to handle the recipe page

// -= All event listeners =-

// ------------- event listeners for recipe.hbs: -----------------------
// Favorites (Heart button)
const heartButtons = document.querySelectorAll(".heart-button"); // Get all heart buttons

// Attach event listener to each heart button
heartButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const recipeId = this.getAttribute("data-recipe-id");
    var userId = getCookie("userId"); // Get the user ID from cookie
    console.log("recipeId", recipeId);
    // check if a user is logged in
    userId = 3; // Temporary user id to bypass cookie
    if (!userId) {
      // If user ID is not found, redirect to the register page
      window.location.href = "/register";
      return; // Stop further execution
    }

    toggleFavorite(userId, recipeId);
  });
});

// -------------- event listeners for dashboard.hbs: ---------------------
// Attach event listener to the form submission
const form = document.getElementById("recipeForm");
form.addEventListener("submit", submitForm);

// Add an event listener to the delete button
document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".btn-delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const userId = getCookie("userId"); // Get the user ID from cookie
      //const userId = 3; // Temporary user id
      const recipeId = button.getAttribute("data-recipe-id");
      deleteRecipe(userId, recipeId);
    });
  });
});

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
async function toggleFavorite(userId, recipeId) {
  console.log("checking favorite - user/ recipeId", userId, "/", recipeId);
  try {
    const response = await fetch(`/favorites/${userId}/${recipeId}`, {
      method: "POST",
    });
    if (response.ok) {
      console.log("Toggled favorite for recipe ID:", recipeId);
      const icon = document.querySelector(
        `.heart-button[data-recipe-id="${recipeId}"] .heart-icon`
      );
      icon.classList.toggle("fas", !icon.classList.contains("fas")); // Toggle red color
      //icon.classList.toggle("far");
      // Optionally, change the color or style here
    } else {
      console.error("Failed to toggle favorite for recipe ID:", recipeId);
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
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

// function to submit form (for add and edit)
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

  const userId = getCookie("userId"); // Get the user ID from cookie
  userId = 3; // Temporary user id to bypass cookie
  if (!userId) {
    // If user ID is not found, redirect to the register page
    window.location.href = "/register";
    return; // Stop further execution
  }

  try {
    const response = await fetch(`/dashboard/submit/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
      body: JSON.stringify(recipeData),
    });
    if (response.ok) {
      console.log("Form submitted successfully");
      // Optionally, handle success response
    } else {
      console.error("Failed to submit form");
      // Optionally, handle failed response
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    // Handle any errors that occurred during the form submission
  }
}

// function to delete the recipe
async function deleteRecipe(userId, recipeId) {
  //const userId = 3; // Temporary user id
  try {
    const response = await fetch(`/dashboard/${userId}/delete/${recipeId}`, {
      method: "DELETE",
    });
    console.log("Delete recipe with ID:", recipeId);
    if (response.status === 200) {
      const data = await response.json();
      const redirectUrl = data.redirect;
      window.location.href = redirectUrl;
    }
  } catch (error) {
    console.error("Error adding recipe to favorites:", error);
  }
}

// Function to get cookie value by name
function getCookie(name) {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}
