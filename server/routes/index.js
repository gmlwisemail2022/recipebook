const express = require("express");
const userController = require("../controller/users.js");

const router = express.Router();
router.post("/user", userController.createUser);
router.get("/user/:username", userController.getUser);

module.exports = router;

