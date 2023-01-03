const express = require("express");
const {
  registerUser,
  authorizeUser,
  findUsersUsingSearch,
} = require("../controllers/userController");
const { authProtect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(authProtect, findUsersUsingSearch);
router.route("/login").post(authorizeUser);

module.exports = router;
