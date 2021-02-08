const multer = require('multer');
const path = require('path');

const fileStorage = multer.memoryStorage();
const uploadFile = multer({
  storage: fileStorage,
  fileFilter: (req, file, callback) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== '.csv'
    ) {
      return callback('Upload CSV file only', null);
    }
    callback(null, true);
  },
}).single('file');

module.exports = uploadFile;
