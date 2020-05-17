import crypto from 'crypto'

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
  const salt = buffer.slice(0, SALT_LENGTH).toString('base64')
  const iv = buffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH).toString('base64')
  const tag = buffer.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH)
  const encrypted = buffer.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH).toString('base64')

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

const pad = (data, size = 16) => {
  let out = data
  const padLen = size - data.length % size
  const padChar = String.fromCharCode(padLen)
  for (let i = 0; i < padLen; i++) {
    out += padChar
  }
  return out
}

const unpad = (data) => {
  let out = data
  const padLen = data.charCodeAt(data.length - 1)
  let i, end
  for (i = data.length - 2, end = data.length - padLen; i >= end; i--) {
    if (data.charCodeAt(i) !== padLen) {
      end = data.length
      throw new Error('unpad(): found a padding byte of ' + data.charCodeAt(i) +
        ' instead of ' + padLen + ' at position ' + i)
    }
  }
  out = data.substring(0, end)
  return out
}
