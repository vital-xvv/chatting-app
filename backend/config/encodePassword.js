const bcrypt = require("bcryptjs");

const encodePassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const encodedPassword = await bcrypt.hash(password, salt);
  return encodedPassword;
};

const matchPassword = async (password, encodedPassword) => {
  return await bcrypt.compare(password, encodedPassword);
};

module.exports = { encodePassword, matchPassword };
