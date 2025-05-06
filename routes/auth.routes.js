const express = require('express');
const { registerUser } = require('../controllers');
const validateUser = require('../middlewares/validation/create-user-validation');
const { uploadSingleImage } = require('../middlewares/imageUpload');
const router = express.Router();

router.post('/auth/register', uploadSingleImage('image'), validateUser, registerUser);

module.exports = router;
