const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    if (user.image) {
      user.image = `http://localhost:3000/${user.image}`; //turn image routes into url
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}

async function deleteUserById(req, res) {
  try {
    const { id } = req.params;

    // Cek apakah user ada
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    await prisma.user.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

async function updateUserById(req, res) {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    const updatedData = {
      username,
      email,
      password,
      image: req.file ? req.file.path.replace(/\\/g, '/') : undefined,
    };

    const user = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    user.image = user.image ? `http://localhost:3000/${user.image}` : null;

    res
      .status(200)
      .json({ success: true, message: 'User berhasil diupdate', data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = {
  getAllUser,
  getUserById,
  deleteUserById,
  updateUserById,
};
