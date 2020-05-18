import crypto from 'crypto'
import { pad, unpad } from './pkcs7'

const ALGORITHM = 'aes-256-gcm'
const SALT_LENGTH = 64
const IV_LENGTH = 16
const TAG_LENGTH = 16
const KEY_LENGTH = 32
const KEY_ITERATIONS_COUNT = 100000

export const encrypt = (cleartext, password, encoding = 'base64') => {
  const salt = generateSalt()
  const iv = generateIV()
  const key = pbkdf2(password, salt)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([
    cipher.update(String(pad(cleartext)), 'utf8'),
    cipher.final()
  ])
  const tag = cipher.getAuthTag()

  return Buffer.concat([salt, iv, tag, encrypted]).toString(encoding)
}

export const decrypt = (ciphertext, password, encoding = 'base64') => {
  const buffer = Buffer.from(String(ciphertext), encoding)
  const salt = buffer.slice(0, SALT_LENGTH)
  const iv = buffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
  const tag = buffer.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH)
  const encrypted = buffer.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH)

  const key = pbkdf2(password, salt)

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

  decipher.setAuthTag(tag)

  let cleartext = decipher.update(encrypted, 'base64', 'utf8')
  try {
    cleartext += decipher.final('utf8')
  } catch (e) {
    console.log('Warning: Failed to authenticate data')
  }

  return unpad(cleartext)
}

const pbkdf2 = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, KEY_ITERATIONS_COUNT, KEY_LENGTH, 'sha512')
}

const generateSalt = () => {
  return crypto.randomBytes(SALT_LENGTH)
}

const generateIV = () => {
  return crypto.randomBytes(IV_LENGTH)
}
