const express = require('express');
const router = express.Router();
const { searchBooks, getBookDetailWithReviews, getPopularBooks } = require('../controllers/book.controllers');


router.get('/books/search', searchBooks); // cari buku
router.get('/books/popular', getPopularBooks); //buku populer buat di landing page
router.get('/books/:bookId', getBookDetailWithReviews); //detail buku + review

module.exports = router;
