const express = require('express');
const router = express.Router();
const { searchBooks, getBookDetailWithReviews } = require('../controllers/book.controllers');


router.get('/books/search', searchBooks); // cari buku
router.get('/books/:bookId', getBookDetailWithReviews); //detail buku + review

module.exports = router;
