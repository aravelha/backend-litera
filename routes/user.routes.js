const express = require('express');
const { addNewUser, getAllUser } = require('../controllers');
const validateUser = require('../middlewares/validation/create-user-validation');
const router = express.Router();

router.get('/users/all', getAllUser);
router.post('/user/new', validateUser, addNewUser);

module.exports = router;
