const path = require('path')

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/index.js',
  output: {
    path: path.resolve('.'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  }
}
