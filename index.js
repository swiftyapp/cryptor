"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cryptor = Cryptor;

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ALGORITHM = 'aes-256-gcm';
var SALT_LENGTH = 64;
var IV_LENGTH = 16;
var TAG_LENGTH = 16;

function Cryptor(secret) {
  if (!secret || typeof secret !== 'string') {
    throw new Error('Cryptor: secret must be a non-empty string');
  }

  this.encrypt = function (value) {
    checkValue(value);

    var iv = _crypto["default"].randomBytes(IV_LENGTH);

    var salt = _crypto["default"].randomBytes(SALT_LENGTH);

    var key = generateKey(salt);

    var cipher = _crypto["default"].createCipheriv(ALGORITHM, key, iv);

    var encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher["final"]()]);
    var tag = cipher.getAuthTag();
    return Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
  };

  this.decrypt = function (value) {
    checkValue(value);
    var stringValue = Buffer.from(String(value), 'hex');
    var salt = getSalt(stringValue);
    var iv = getIV(stringValue);
    var tag = getTag(stringValue);
    var encrypted = getEncryptedValue(stringValue);
    var key = generateKey(salt);

    var decipher = _crypto["default"].createDecipheriv(ALGORITHM, key, iv);

    decipher.setAuthTag(tag);
    return decipher.update(encrypted, 'hex', 'utf8') + decipher["final"]('utf8');
  };

  var generateKey = function generateKey(salt) {
    return _crypto["default"].pbkdf2Sync(secret, salt, 100000, 32, 'sha512');
  };

  var getSalt = function getSalt(string) {
    return string.slice(0, SALT_LENGTH);
  };

  var getIV = function getIV(string) {
    return string.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  };

  var getTag = function getTag(string) {
    return string.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  };

  var getEncryptedValue = function getEncryptedValue(string) {
    return string.slice(SALT_LENGTH + IV_LENGTH + 16);
  };

  var checkValue = function checkValue(value) {
    if (!value) {
      throw new Error('Cryptor: value must not be null or undefined');
    }

    return true;
  };
}