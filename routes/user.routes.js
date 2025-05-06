const express = require('express');
const { addNewUser, getAllUser, getUserById, deleteUserById, updateUserById } = require('../controllers');
const validateUser = require('../middlewares/validation/create-user-validation');
const { uploadSingleImage } = require('../middlewares/imageUpload');
const router = express.Router();

router.get('/users/all', getAllUser);
router.get('/user/:id', getUserById);
router.delete('/user/:id', deleteUserById);
router.put('/user/:id', uploadSingleImage('image'), updateUserById);

module.exports = router;
