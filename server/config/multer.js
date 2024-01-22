const path = require('path');
const multer = require('multer');

const createMulter = (folderPath) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      const newFilename = `${req.user.id}${extension}`;
      cb(null, newFilename);
    }
  });

  return multer({ storage });
};

module.exports = createMulter;

