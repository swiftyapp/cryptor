import crypto from 'crypto'

export const hash = (value, algorithm = 'sha512') => {
  return crypto.createHash(algorithm).update(value).digest('base64')
}
