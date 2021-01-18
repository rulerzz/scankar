const multer = require('multer');
const path = require('path');

const fileStorage = multer.memoryStorage();
const uploadFile = multer({
  storage: fileStorage,
  fileFilter: (req, file, callback) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== '.xlsx' &&
      ext !== '.xlsm' &&
      ext !== '.xlsb' &&
      ext !== '.xltx' &&
      ext !== '.xltm' &&
      ext !== '.xls' &&
      ext !== '.xlt' &&
      ext !== '.xlts' &&
      ext !== '.xml' &&
      ext !== '.xlam' &&
      ext !== '.xla' &&
      ext !== '.xlw' &&
      ext !== '.xlr'
    ) {
      return callback(res.end('Upload excel file only'), null);
    }
    callback(null, true);
  },
}).single('excel');

module.exports = uploadFile;
