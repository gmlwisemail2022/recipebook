// Initialize the server
// Load the server configuration
const app = require('./config/app.js');

// Select the port
const port = process.env.PORT || 3000;

// Start the server by inputting ('npm start') in the terminal
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});