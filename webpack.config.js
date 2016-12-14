/* eslint-env node */
const path = require('path')
const webpackConfig = require('webdev-201x')

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const devConfig = webpackConfig()
devConfig.entry = './example/index.js'
devConfig.output.path = path.resolve(__dirname, 'example')
devConfig.devServer = {
  contentBase: './example'
}

module.exports = IS_PRODUCTION
  ? webpackConfig
  : devConfig
