const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new Error('Email sudah terdaftar. Masuk atau gunakan email lain.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        image: req.file ? req.file.path.replace(/\\/g, '/') : null,
        createdAt: new Date(),
      },
    });

    if (!data) throw new Error('Gagal membuat akun baru');

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

module.exports = {
  registerUser,
};
