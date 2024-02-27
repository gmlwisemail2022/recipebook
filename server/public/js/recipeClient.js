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
    userId = 3; // Temporary user id to bypass cookie //hardcoded //hardcoded
    if (!userId) {
      // If user ID is not found, redirect to the register page
      window.location.href = "/auth/login";
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
      const userId = 3; //hardcoded
      const recipeId = button.getAttribute("data-recipe-id");

      // Show the modal
      const modal = document.getElementById("deleteModal");
      const confirmButton = modal.querySelector(".btn-confirm-delete");

      // Set up the confirmation button listener
      confirmButton.addEventListener("click", async () => {
        try {
          // Call deleteRecipe if the user confirms
          await deleteRecipe(userId, recipeId);
        } catch (error) {
          console.error("Error deleting recipe:", error);
        } finally {
          // Close the modal
          const bootstrapModal = bootstrap.Modal.getInstance(modal);
          bootstrapModal.hide();
        }
      });

      // Show the modal when the delete button is clicked
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    });
  });
});

// Event listener for Edit buttons
document.addEventListener("DOMContentLoaded", () => {
  const editButtons = document.querySelectorAll(".btn-edit");
  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const recipeId = button.getAttribute("data-recipe-id");

      // Fetch the recipe data and populate the form fields
      fetch(`/recipe/edit/${recipeId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // Log the response data
          populateEditForm(data); // Function to populate form fields
          $("#editModal").modal("show"); // Show the modal
        })
        .catch((error) => console.error("Error fetching recipe data:", error));
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Event listener for Save Changes button in the edit modal
  const editRecipeSubmitButton = document.getElementById("editRecipeSubmit");
  const editRecipeForm = document.getElementById("editRecipeForm"); // Get the edit form element

  editRecipeSubmitButton.addEventListener("click", async () => {
    console.log("Save Changes button clicked");
    event.preventDefault(); // Prevent default button behavior
    const formData = new FormData(editRecipeForm);
    const recipeData = {
      recipe_id: formData.get("hidden_recipe_id"), // Include the recipe_id in the payload
      title: formData.get("edit_title"),
      meal_type: formData.get("edit_meal_type"),
      cuisine: formData.get("edit_cuisine"),
      servings: formData.get("edit_servings"),
      ingredients: formData.get("edit_ingredients"),
      instructions: formData.get("edit_instructions"),
    };

    // Send the updated recipe data to the server
    try {
      console.log("passong to server the RecipeData", recipeData);
      userId = 3; //hardcoded
      const response = await fetch(`/recipe/edit/save/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });
      if (response.ok) {
        console.log("Recipe updated successfully");
        $("#editModal").modal("hide"); // Hide the modal
        const data = await response.json();
        console.log(
          "edit form modal closed so redirect to dashboard/user with user in:",
          data
        );
        const redirectUrl = data.redirect;
        console.log("redirect url after edit", redirectUrl);
        // Display alert message that the recipe has been updated
        alert(data.message);
        window.location.href = redirectUrl;
      } else {
        console.error("Failed to update recipe");
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  });
});

//==================================================

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
  userId = 3; // Temporarily set userId to 3 //hardcoded
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

async function searchRecipes() {
  const keyword = document.getElementById("search-input").value.trim();
  console.log("search for recipe via keyword ", keyword);

  if (keyword !== "") {
    try {
      const response = await fetch(`/recipe/search/${keyword}`, {
        method: "GET",
      });

      if (response.ok) {
        // If the response is successful, redirect to the search results page
        window.location.href = `/recipe/search/${keyword}`;
      } else {
        // Handle errors if any
        console.error("Error searching recipes:", response.statusText);
      }
    } catch (error) {
      // Handle any network errors
      console.error("Network error:", error);
    }
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
      //icon.classList.toggle("fas", !icon.classList.contains("fas")); // Toggle red color
      //icon.classList.toggle("far");

      // Toggle the 'text-danger' class based on whether the recipe is a favorite
      icon.classList.toggle("text-danger");
    } else {
      console.error("Failed to toggle favorite for recipe ID:", recipeId);
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
}

// Function to add to favorites
async function addToFavorites(userId, recipeId) {
  userId = 3; // temp override user id //hardcoded
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
  userId = 3; // temp override user id //hardcoded
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

// function to submit form (for add)
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

  //const userId = getCookie("userId"); // Get the user ID from cookie
  const userId = 3; // Temporary user id to bypass cookie //hardcoded
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
      const data = await response.json();
      const redirectUrl = data.redirect;
      console.log("redirect url after edit", redirectUrl);
      // Display alert message that the recipe has been updated
      alert(data.message);
      window.location.href = redirectUrl;
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
  //const userId = 3; // Temporary user id //hardcoded
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

// Function to populate the edit form fields with recipe data
function populateEditForm(recipe) {
  console.log("populate recipe form with", recipe);
  document.getElementById("hidden_recipe_id").value = recipe[0].recipe_id;
  document.getElementById("edit_title").value = recipe[0].title;
  document.getElementById("edit_meal_type").value = recipe[0].meal_type;
  document.getElementById("edit_cuisine").value = recipe[0].cuisine;
  document.getElementById("edit_servings").value = recipe[0].servings;
  document.getElementById("edit_ingredients").value = recipe[0].ingredients;
  document.getElementById("edit_instructions").value = recipe[0].instructions;
}

function clearForm() {
  // Get all input fields in the form
  var inputs = document.querySelectorAll(
    "#recipeForm input, #recipeForm select, #recipeForm textarea"
  );
  // Loop through each input field and set its value to an empty string
  inputs.forEach(function (input) {
    input.value = "";
  });
}
