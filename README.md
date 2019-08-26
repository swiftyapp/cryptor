# Swifty Cryptor
Basic encrypt and decrypt node module

### Install
```
yarn add @swiftyapp/cryptor
```
or 
```
npm install @swiftyapp/cryptor
```

### Use

```javascript
const Cryptor = require('@swiftyapp/cryptor')

const cryptor = new Cryptor('secretpassword')

const encrypted = cryptor.encrypt('some sensitive data')
console.log(encrypted) // 79e103b37586b83002e92cc9...

const decrypted = cryptor.decrypt(encrypted)
console.log(decrypted) // some sensitive data
```
