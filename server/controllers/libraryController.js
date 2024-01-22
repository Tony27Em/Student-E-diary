const path = require('path');
const libraryService = require('../services/library-service');
const FILES_FOLDER_PATH = path.join(__dirname, '../data/library/practical');

class LibraryController {
  async getLibrary(req, res, next) {
    try {
      const library = await libraryService.getLibrary();      
      return res.json(library[0]);
    } catch(err) {
      next();
    }
  }

  async downloadPractical(req, res, next) {
    const filename = req.params.filename;
    const encodedFilename = encodeURIComponent(filename);
    const filePath = path.join(FILES_FOLDER_PATH, filename);

    res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
    res.sendFile(filePath, (err) => {
      if(err) {
        console.error('Ошибка при скачивании файла:', err);
        res.status(500).json({ message: 'Ошибка при скачивании файла' });
      }
    });  
  }
}

module.exports = new LibraryController();