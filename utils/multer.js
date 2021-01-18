const multer = require('multer');
const path = require('path');

const memoryStorage = multer.memoryStorage();

const cloudUpload = multer({
  storage: memoryStorage,
  fileFilter: (req, file, callback) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(res.end('Upload image file only'), null);
    }
    callback(null, true);
  },
}).single('photo');

module.exports = cloudUpload;
