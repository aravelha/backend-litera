const express = require('express');
const { registerUser, login } = require('../controllers/auth.controllers');
const validateUser = require('../middlewares/validation/create-user-validation');
const { uploadSingleImage } = require('../middlewares/imageUpload');
const router = express.Router();

router.post('/auth/register', uploadSingleImage('image'), validateUser, registerUser);
router.post('/auth/login', login);

module.exports = router;
