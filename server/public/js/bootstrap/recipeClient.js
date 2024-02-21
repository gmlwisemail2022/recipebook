// Get all heart icons
const heartIcons = document.querySelectorAll(".heart-icon");

// Attach event listener to each heart icon
heartIcons.forEach((icon) => {
  icon.addEventListener("click", toggleFavorite);
});

// Function to toggle favorite
function toggleFavorite(event) {
  console.log("checking favorite");
  var icon = event.target;
  var recipeId = icon.getAttribute("data-recipe-id");
  var isFavorite = icon.classList.contains("fas");

  if (isFavorite) {
    // Remove from favorites
    console.log("removing favorite");
    removeFromFavorites(recipeId);
    icon.classList.remove("fas");
    icon.classList.add("far");
    icon.style.color = ""; // Reset color to default
  } else {
    // Add to favorites
    console.log("adding favorite");
    addToFavorites(recipeId);
    icon.classList.remove("far");
    icon.classList.add("fas");
    icon.style.color = "red";
  }
}
// Function to remove from favorites (replace with your implementation)
function removeFromFavorites(recipeId) {
  // Implement your logic to remove the recipe with the given ID from favorites
  console.log("Removing recipe with ID:", recipeId, "from favorites");
}

// Function to add to favorites (replace with your implementation)
function addToFavorites(recipeId) {
  // Implement your logic to add the recipe with the given ID to favorites
  console.log("Adding recipe with ID:", recipeId, "to favorites");
}
