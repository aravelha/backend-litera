const express = require('express');
const router = express.Router();

const { createReview, getReviewsByBook, updateReview, deleteReview } = require('../controllers/review.controllers');
const authenticate = require('../middlewares/authenticate');

router.post('/reviews', authenticate, createReview);
router.get('/reviews/:bookId', getReviewsByBook);
router.put('/reviews/:reviewId', authenticate, updateReview);
router.delete('/reviews/:reviewId', authenticate, deleteReview);

module.exports = router;
