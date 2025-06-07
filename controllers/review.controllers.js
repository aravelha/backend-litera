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
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
      
      if (!response.data || !response.data.volumeInfo || !response.data.volumeInfo.title) {
        return res.status(404).json({
          success: false,
          message: 'Buku tidak ditemukan di Google Books API',
  }   );
}

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
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Map reviews with complete user data
    const mappedReviews = reviews.map((review) => ({
      id: review.id,
      userId: review.userId,
      username: review.user.username, // Get username from user relationship
      userImage: review.user.image,
      comment: review.comment,
      createdAt: review.createdAt
    }));

    res.status(200).json({
      success: true,
      data: mappedReviews
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

async function getAllReviews(req, res) {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: true,
        book: true,
      },
    });

    res.status(200).json({
      success: true,
      data: reviews.map((r) => ({
        user: r.user.username,
        bookTitle: r.book.title,
        comment: r.comment,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil semua review',
      error: error.message,
    });
  }
}

async function getMyReviews(req, res) {
  try {
    const userId = req.user.id;

    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        book: true,
        user: true,
      },
    });

    res.status(200).json({
      success: true,
      data: reviews.map((r) => ({
        id: r.id,
        comment: r.comment,
        createdAt: r.createdAt,
        userId: r.userId,
        username: r.user?.username || '', // pastikan ada username
        bookId: r.bookId,
        bookTitle: r.book?.title || '',
        bookAuthors: r.book?.authors || '',
        bookThumbnail: r.book?.thumbnail || '',
        bookDescription: r.book?.description || '',
        // tambahkan field lain jika perlu
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil review milik user ini',
      error: error.message,
    });
  }
}


module.exports = {
  createReview,
  getReviewsByBook,
  updateReview,
  deleteReview,
  getAllReviews,
  getMyReviews,
};
