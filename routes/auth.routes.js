const express = require('express');
const { registerUser, login, logout } = require('../controllers/auth.controllers');
const validateUser = require('../middlewares/validation/create-user-validation');
const { uploadSingleImage } = require('../middlewares/imageUpload');
const router = express.Router();

router.post('/auth/register', uploadSingleImage('image'), validateUser, registerUser);
router.post('/auth/login', login);
router.post('/auth/logout', logout);

module.exports = router;
