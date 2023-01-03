const express = require("express");
const { authProtect } = require("../middlewares/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");

const router = express.Router();

router.route("/").post(authProtect, accessChat);
router.route("/").get(authProtect, fetchChats);
router.route("/group").post(authProtect, createGroupChat);
router.route("/rename").put(authProtect, renameGroup);
router.route("/add").put(authProtect, addToGroup);
router.route("/remove").put(authProtect, removeFromGroup);

module.exports = router;
