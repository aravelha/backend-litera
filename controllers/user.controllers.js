const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addNewUser(req, res) {
  try {
    //mengambil data dari body
    const { username, email, password } = req.body;

    //periksa apakah sudah ada email yang sama
    const dataUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (dataUser) {
      throw new Error(
        'Email sudah terdaftar. Masuk atau gunakan email lain untuk mendaftar.'
      );
    }

    //mengirim data ke database
    const data = await prisma.user.create({
      data: {
        username,
        email,
        password,
        createdAt: new Date(),
      },
    });

    if (!data) {
      throw new Error('Gagal membuat akun baru');
    }

    res.status(201).json({
      success: true,
      message: 'Berhasil membuat akun',
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getAllUser(req, res) {
  try {
    const allUserData = await prisma.user.findMany();

    if (!allUserData) {
      throw new Error('Data user tidak ditemukan');
    }
    res.status(200).json({ success: true, data: allUserData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = { addNewUser, getAllUser };
