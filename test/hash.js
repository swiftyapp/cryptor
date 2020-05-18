import test from 'tape'
import { hash } from '../'

const secret = 'mysecretpassword'

test('Hashes password', t => {
  t.plan(1)

  t.equal(
    hash(secret),
    'g77caZVpk1o1u2YaNSkV2nCHA3W3xwvjEk1aPs+BGmxu3uETsEMIykwBppLOEl+oumzbsEJy67yrTzZtyAazWg=='
  )
})
