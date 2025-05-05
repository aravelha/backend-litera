const userRoutes = require('./user.routes');

const express = require('express');

const Router = express.Router();

Router.use(userRoutes);

module.exports = Router;