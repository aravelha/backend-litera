const express = require('express');
const Router = express.Router();

const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const bookRoutes = require('./book.routes');

Router.use(userRoutes);
Router.use(authRoutes);
Router.use(bookRoutes);

module.exports = Router;
