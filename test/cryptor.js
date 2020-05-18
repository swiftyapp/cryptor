import test from 'tape'
import { encrypt, decrypt } from '../'

const secret = 'mysecretpassword'
const data = 'sensitive data to encrypt'

test('Encrypts and decrypts data', t => {
  t.plan(1)

  const encrypted = encrypt(data, secret)
  const decrypted = decrypt(encrypted, secret)

  t.equal(decrypted, data)
})

test('Encryptor generates a different value each time', t => {
  t.plan(1)

  const encrypted1 = encrypt(data, secret)
  const encrypted2 = encrypt(data, secret)

  t.notEqual(encrypted1, encrypted2)
})

test('Throws an error if no secret is set for Cryptor', t => {
  t.plan(4)
  t.throws(() => encrypt(data), 'Encryption error: secret must be a non-empty string')
  t.throws(
    () => encrypt(data, null),
    'Encryption error: secret must be a non-empty string'
  )
  t.throws(() => encrypt(data, 0), 'Encryption error: secret must be a non-empty string')

  t.throws(
    () => encrypt(data, Integer(12345678)),
    'Encryption error: secret must be a non-empty string'
  )
})

test('Throws an error if encryption value is null or undefined', t => {
  t.plan(2)

  t.throws(
    () => encrypt(undefined, secret),
    'Cryptor: secret must be a non-empty string'
  )
  t.throws(
    () => cryptor.encrypt(null, secret),
    'Cryptor: secret must be a non-empty string'
  )
})

test('Throws an error if decryption value is null or undefined', t => {
  t.plan(2)

  t.throws(
    () => cryptor.decrypt(undefined, secret),
    'Cryptor: secret must be a non-empty string'
  )
  t.throws(
    () => cryptor.decrypt(null, secret),
    'Cryptor: secret must be a non-empty string'
  )
})
