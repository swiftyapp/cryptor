import test from 'tape'
import { Cryptor } from '../'

const secret = 'mysecretpassword'
const data = 'sensitive data to encrypt'

test('Encrypts and decrypts data', t => {
  t.plan(1)

  const cryptor = new Cryptor(secret)
  const encrypted = cryptor.encrypt(data)
  const decrypted = cryptor.decrypt(encrypted)

  t.equal(decrypted, data)
})

test('Another cryptor instance can decrypt data', t => {
  t.plan(1)

  const cryptor1 = new Cryptor(secret)
  const encrypted = cryptor1.encrypt(data)

  const cryptor2 = new Cryptor(secret)
  const decrypted = cryptor2.decrypt(encrypted)

  t.equal(decrypted, data)
})

test('Encryptor generates a different value each time', t => {
  t.plan(1)

  const cryptor = new Cryptor(secret)
  const encrypted1 = cryptor.encrypt(data)
  const encrypted2 = cryptor.encrypt(data)

  t.notEqual(encrypted1, encrypted2)
})

test('Throws an error if no secret is set for Cryptor', t => {
  t.plan(5)
  t.throws(() => new Cryptor(), 'Cryptor: secret must be a non-empty string')
  t.throws(
    () => new Cryptor(null),
    'Cryptor: secret must be a non-empty string'
  )
  t.throws(() => new Cryptor(0), 'Cryptor: secret must be a non-empty string')

  t.throws(
    () => new Cryptor(Integer(12345678)),
    'Cryptor: secret must be a non-empty string'
  )

  t.throws(
    () => new Cryptor(Buffer.from('12345678')),
    'Cryptor: secret must be a non-empty string'
  )
})

test('Throws an error if encryption value is null or undefined', t => {
  t.plan(2)

  const cryptor = new Cryptor(secret)
  t.throws(
    () => cryptor.encrypt(),
    'Cryptor: secret must be a non-empty string'
  )
  t.throws(
    () => cryptor.encrypt(null),
    'Cryptor: secret must be a non-empty string'
  )
})

test('Throws an error if decryption value is null or undefined', t => {
  t.plan(2)

  const cryptor = new Cryptor(secret)
  t.throws(
    () => cryptor.decrypt(),
    'Cryptor: secret must be a non-empty string'
  )
  t.throws(
    () => cryptor.decrypt(null),
    'Cryptor: secret must be a non-empty string'
  )
})
