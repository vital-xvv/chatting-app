const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../config/generateToken");
const { matchPassword } = require("../config/encodePassword");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, picture } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Fill out all the Fields");
  }

  const [userExists, _] = await User.findByEmail(email);

  if (userExists.length !== 0) {
    res.status(400);
    throw new Error("User already exists");
  }

  const [user] = await new User({
    name,
    email,
    picture,
    password,
  }).save();

  const [createdUser] = await User.findByEmail(email);

  if (user) {
    res.status(201).json({
      _id: createdUser[0].id,
      name: createdUser[0].name,
      email: createdUser[0].email,
      picture: createdUser[0].picture,
      timestamp: createdUser[0].timestamp,
      token: generateToken(createdUser[0].id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

const authorizeUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const [user] = await User.findByEmail(email);

  if (user.length !== 0 && (await matchPassword(password, user[0].password))) {
    res.status(201).json({
      _id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      picture: user[0].picture,
      timestamp: user[0].timestamp,
      token: generateToken(user[0].id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid E-mail or Password");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const [users] = await User.findAll();
  if (users.length !== 0) {
    res.status(201).json(users);
  } else {
    res.status(401);
    throw new Error("Failed to fetch all users");
  }
});

const findUsersUsingSearch = asyncHandler(async (req, res) => {
  const [users] = await User.find(req.query.search, req.user.id);
  users.filter((u) => u._id !== req.user._id);
  if (users.length !== 0) {
    res.status(201).json(users);
  } else {
    res.status(401);
    throw new Error(`Failed to fetch users by search: ${req.query.search}`);
  }
});

module.exports = { registerUser, authorizeUser, findUsersUsingSearch };
