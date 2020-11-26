const logger = require("../logger");
const MODULE_NAME = "[inputs.cursor]";

class Cursor {
  constructor(websites) {
    this._websites = websites;
    this._position = 0;
  }

  next() {
    const website = this._websites[this._position];
    this._position += 1;
    logger.info(`${MODULE_NAME} ${this._position} / ${this._websites.length} (${Math.ceil(this._position / this._websites.length * 100)}%).`);
    return website;
  }

  hasNext() {
    return this._position < this._websites.length;
  }
}

module.exports = {
  Cursor
}