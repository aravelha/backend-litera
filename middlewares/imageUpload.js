const multer = require('multer');
const path = require('path');

function getPath(imageType) {
  if (imageType === 'image') {
    return 'uploads/profiles';
  } else {
    return 'uploads';
  }
}

function uploadSingleImage(imageType) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, getPath(imageType));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png/;
      const mimeType = fileTypes.test(file.mimetype);
      const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      if (mimeType && extname) {
        return cb(null, true);
      } else {
        return cb(
          new Error('Hanya file .jpeg, .jpg, dan .png yang diperbolehkan')
        );
      }
    },
  });

  return upload.single(imageType);
}

module.exports = { uploadSingleImage };
