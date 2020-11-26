const fs = require("fs");
const path = require("path");
const process = require("process");
const crypto = require("crypto");
const logger = require("./logger");
const MODULE_NAME = "[cache]";
const BRIENNE_CACHE_FOLDER = process.env.BRIENNE_CACHE_FOLDER || "cache";

if (!fs.existsSync(BRIENNE_CACHE_FOLDER)) {
  fs.mkdirSync(BRIENNE_CACHE_FOLDER);
}

logger.info(`${MODULE_NAME} Ready.`);

function getURLContent(url) {
  const keyURL = _keyURL(url);
  const cachedFilePath = path.join(BRIENNE_CACHE_FOLDER, keyURL);

  if (!fs.existsSync(cachedFilePath)) {
    return "";
  }

  return fs.readFileSync(cachedFilePath, "utf8");
}

function putURLContent(url, content) {
  const keyURL = _keyURL(url);
  fs.writeFileSync(path.join(BRIENNE_CACHE_FOLDER, keyURL), content);
}

function _keyURL(url) {
  const hash = crypto.createHash("sha1");
  hash.update(url);
  return hash.digest("hex");
}

module.exports = {
  getURLContent,
  putURLContent
}

