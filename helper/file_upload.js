const multer = require('multer');
// const fs = require('fs');
const path = require('path');
const AppError = require('../utils/appError');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (file.fieldname === 'profile_photo') {
      cb(null, path.join(__dirname, '../public/users'));
    }
  },
  filename: function(req, file, cb) {
    const fileExt = file.originalname.split('.')[
      file.originalname.split('.').length - 1
    ];
    const uniqueSuffix = Math.round(Math.random() * 1e9)`.${fileExt}`;
    cb(null, uniqueSuffix);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 404));
  }
};

const fileUpload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5
  // },
  fileFilter: fileFilter
});
module.exports = { fileUpload };
