import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const SALT_LENGTH = 64
const IV_LENGTH = 16
const TAG_LENGTH = 16

export function Cryptor(secret) {
  if (!secret || typeof secret !== 'string') {
    throw new Error('Cryptor: secret must be a non-empty string')
  }

  this.encrypt = value => {
    checkValue(value)

    const iv = crypto.randomBytes(IV_LENGTH)
    const salt = crypto.randomBytes(SALT_LENGTH)

    const key = generateKey(salt)

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    const encrypted = Buffer.concat([
      cipher.update(String(value), 'utf8'),
      cipher.final()
    ])

    const tag = cipher.getAuthTag()

    return Buffer.concat([salt, iv, tag, encrypted]).toString('hex')
  }

  this.decrypt = value => {
    checkValue(value)

    const stringValue = Buffer.from(String(value), 'hex')

    const salt = getSalt(stringValue)
    const iv = getIV(stringValue)
    const tag = getTag(stringValue)
    const encrypted = getEncryptedValue(stringValue)

    const key = generateKey(salt)

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

    decipher.setAuthTag(tag)

    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
  }

  const generateKey = salt => {
    return crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha512')
  }

  const getSalt = string => {
    return string.slice(0, SALT_LENGTH)
  }

  const getIV = string => {
    return string.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
  }

  const getTag = string => {
    return string.slice(
      SALT_LENGTH + IV_LENGTH,
      SALT_LENGTH + IV_LENGTH + TAG_LENGTH
    )
  }

  const getEncryptedValue = string => {
    return string.slice(SALT_LENGTH + IV_LENGTH + 16)
  }

  const checkValue = value => {
    if (!value) {
      throw new Error('Cryptor: value must not be null or undefined')
    }
    return true
  }
}
