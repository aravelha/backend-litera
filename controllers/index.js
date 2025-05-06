const {
  getAllUser,
  getUserById,
  deleteUserById,
  updateUserById,
} = require('./user.controllers');

const {
  registerUser,
} = require('./auth.controllers');

module.exports = {
  getAllUser,
  getUserById,
  deleteUserById,
  updateUserById,
  registerUser,
};
