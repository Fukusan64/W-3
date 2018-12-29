const fs = require('fs');
const path = require('path');
module.exports = class FileManager {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }
  getFileList(filter = () => true) {
    return fs
      .readdirSync(this.dirPath)
      .filter(e => fs.statSync(path.join(this.dirPath, e)).isFile())
      .filter(e => filter(e))
    ;
  }
}
