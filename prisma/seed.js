const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // 1. user baru
  const hashedPassword = await bcrypt.hash('TestPassword123', 10);

  const user = await prisma.user.create({
    data: {
      username: 'AdminLitera',
      email: 'litera@gmail.com',
      password: hashedPassword,
      createdAt: new Date()
    }
  });

  // 2. fetch buku from gbooks api
  const keyword = 'laut bercerita';
  const googleRes = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(keyword)}`);
  const googleBook = googleRes.data.items[0];

  if (!googleBook) throw new Error('Buku tidak ditemukan dari Google Books API');

  const volume = googleBook.volumeInfo;

  // 3. simpan buku ke db
  const book = await prisma.book.create({
    data: {
      id: googleBook.id,
      title: volume.title,
      authors: volume.authors?.join(', ') || 'Unknown',
      thumbnail: volume.imageLinks?.thumbnail || null,
      description: volume.description || '',
      genre: volume.categories || [],
      createdAt: new Date()
    }
  });

  // 4. buat review dari user
  await prisma.review.create({
    data: {
      userId: user.id,
      bookId: book.id,
      comment: 'Buku ini sangat seru! Recommended!',
      createdAt: new Date()
    }
  });

  console.log('✅ Data berhasil diisi dari Google Books API!');
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
