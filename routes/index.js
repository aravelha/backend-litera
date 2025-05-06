const userRoutes = require('./user.routes');
const express = require('express');
const authRoutes = require('./auth.routes'); 

const Router = express.Router();

Router.use(userRoutes);
Router.use(authRoutes);

module.exports = Router;