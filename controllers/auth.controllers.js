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
    console.log('Hashed Password:', hashedPassword);

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

async function login(req, res) {
  try {
    const { email, password } = req.body;

    let data = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });

    if (!data) {
      throw new Error('User tidak ditemukan');
    }

    console.log('Password input:', password);
    console.log('Password in DB:', data.password);

    const match = await bcrypt.compare(password, data.password);
    if (!match) {
      throw new Error('Password tidak valid');
    }

    const id = data.id;

    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    data = {
      ...data,
    };

    res.status(200).json({
      success: true,
      message: 'Berhasil login',
      data: data,
      token,
    });
  } catch (error) {
    console.log('Login Error:', error.message);
    res.status(400).json({
      success: false,
      message: 'Gagal login.',
    });
  }
}

module.exports = {
  registerUser,
  login,
};
