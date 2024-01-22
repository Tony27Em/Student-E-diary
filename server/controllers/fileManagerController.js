const path = require('path');
const DATA_FOLDER_PATH = path.join(__dirname, '../data/students');
const createMulter = require('../config/multer');

class FileManagerController {

  // ---------- FOR STUDENTS ----------
  async downloadTask(req, res, next) {
    try {
      const userID = JSON.parse(req.cookies.refresh_token).user.id;
      const filename = req.params.filename;
      const encodedFilename = encodeURIComponent(filename);
      const filePath = path.join(DATA_FOLDER_PATH, userID, filename);

      res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);

      res.sendFile(filePath, (err) => {
        if (err) {
          console.error('Ошибка при скачивании файла:', err);
          res.status(500).json({ message: 'Ошибка при скачивании файла' });
        }
      });
    } catch(err) {
      next(err);
    }
  }

  uploadHomework(req, res, next) {
    const userID = JSON.parse(req.cookies.refresh_token).user.id;
    const upload = createMulter(path.join(DATA_FOLDER_PATH, userID));
    const uploadMiddleware = upload.single('file');

    try {
      uploadMiddleware(req, res, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Произошла ошибка при загрузке файла.');
        }

        res.json({ message: 'Файл успешно загружено' });
      });
    } catch(err) {
      next(err);
    }
  }

  
  // ---------- FOR TEACHERS ----------
  async downloadHomework(req, res, next) {
    try {
      
    } catch(err) {
      next(err);
    }
  }

  async uploadTask(req, res, next) {
    try {
      
    } catch(err) {
      next(err);
    }
  }
}

module.exports = new FileManagerController();