import test from 'tape'
import { pad, unpad } from '../src/pkcs7'

test('Adds padding to a string', t => {
  t.plan(1)

  t.equal(
    pad('lorem ipsum'),
    'lorem ipsum\x05\x05\x05\x05\x05'
  )
})

test('Removes padding from a string', t => {
  t.plan(1)

  t.equal(
    unpad('lorem ipsum\x05\x05\x05\x05\x05'),
    'lorem ipsum'
  )
})

test('Invalid padding', t => {
  t.plan(1)

  t.throws(() => unpad('lorem ipsum\x05\x03\x05\x05\x05'))
})
