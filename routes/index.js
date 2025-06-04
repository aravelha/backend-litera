const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const bookRoutes = require('./book.routes');
const reviewRoutes = require('./review.routes');

const Router = express.Router();

Router.use(authRoutes);
Router.use(userRoutes);
Router.use(bookRoutes);
Router.use(reviewRoutes);

module.exports = Router;
