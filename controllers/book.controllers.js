const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function searchBooks(req, res) {
  try {
    const { q } = req.query;
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}`
    );

    const books = response.data.items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
      description: item.volumeInfo.description || null,
      genre: item.volumeInfo.categories || [],
    }));

    res.status(200).json({ success: true, books });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data buku',
      error: err.message,
    });
  }
}

async function getBookDetailWithReviews(req, res) {
  try {
    const { bookId } = req.params;

    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes/${bookId}`
    );
    const book = response.data;

    const reviews = await prisma.review.findMany({
      where: { bookId },
      include: { user: true },
    });

    res.status(200).json({
      success: true,
      book: {
        id: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors,
        description: book.volumeInfo.description,
        thumbnail: book.volumeInfo.imageLinks?.thumbnail,
        genre: book.volumeInfo.categories,
      },
      reviews: reviews.map((r) => ({
        user: r.user.username,
        comment: r.comment,
        createdAt: r.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail buku',
      error: err.message,
    });
  }
}

async function getPopularBooks(req, res) {
  try {
    const response = await axios.get(
      'https://www.googleapis.com/books/v1/volumes?q=bestseller&maxResults=10'
    );

    const books = response.data.items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
      description: item.volumeInfo.description || null,
      genre: item.volumeInfo.categories || [],
      rating: item.volumeInfo.averageRating || 0,
    }));

    res.status(200).json({ success: true, books });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil buku populer',
      error: err.message,
    });
  }
}

module.exports = {
  searchBooks,
  getBookDetailWithReviews,
  getPopularBooks,
};
