const LibraryModel = require('../models/library-model');

class LibraryService {
  async getLibrary() {
    const result = await LibraryModel.find();
    return result;
  }
}

module.exports = new LibraryService();