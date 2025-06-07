const express = require('express');
const router = express.Router();

const {
  createReview,
  getReviewsByBook,
  updateReview,
  deleteReview,
  getAllReviews,
  getMyReviews,
} = require('../controllers/review.controllers');
const authenticate = require('../middlewares/authenticate');

router.post('/reviews', authenticate, createReview);
router.get('/reviews/:bookId', getReviewsByBook);
router.put('/reviews/:reviewId', authenticate, updateReview);
router.delete('/reviews/:reviewId', authenticate, deleteReview);
router.get('/reviews', getAllReviews);
router.get('/my-reviews', authenticate, getMyReviews); //review dari user yg sedang login


module.exports = router;
