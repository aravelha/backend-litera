const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const axios = require('axios');

async function createReview(req, res) {
  try {
    const { bookId, comment } = req.body;
    const userId = req.user.id;

    // cek books availability in database
    let book = await prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes/${bookId}`
      );
      const volumeInfo = response.data.volumeInfo;

      book = await prisma.book.create({
        data: {
          id: bookId,
          title: volumeInfo.title,
          authors: volumeInfo.authors?.join(', ') || null,
          thumbnail: volumeInfo.imageLinks?.thumbnail || null,
          description: volumeInfo.description || null,
          genre: volumeInfo.categories || [],
          createdAt: new Date(),
        },
      });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        bookId,
        comment,
        createdAt: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Review berhasil ditambahkan',
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getReviewsByBook(req, res) {
  try {
    const { bookId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { bookId },
      include: { user: true },
    });

    res.status(200).json({
      success: true,
      data: reviews.map((r) => ({
        user: r.user.username,
        comment: r.comment,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil review',
      error: error.message,
    });
  }
}

async function updateReview(req, res) {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    // Only allow the owner to update
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review || review.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { comment },
    });

    res.status(200).json({
      success: true,
      message: 'Review updated',
      data: updated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Only allow the owner to delete
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review || review.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await prisma.review.delete({ where: { id: reviewId } });

    res.status(200).json({
      success: true,
      message: 'Review deleted',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = {
  createReview,
  getReviewsByBook,
  updateReview,
  deleteReview,
};
