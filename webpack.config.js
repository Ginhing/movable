const path = require('path')

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const babelOptions = {
  'presets': [
    ['env', {
      'targets': IS_PRODUCTION ? {ie: 10} : {chrome: 54},
      'modules': false,
      'loose': true
    }],
    'stage-2',
  ]
}

module.exports = {
  entry: IS_PRODUCTION ? './src/index.js' : './example/index.js',
  output: {
    path: IS_PRODUCTION ? path.resolve(__dirname, 'dist') : path.resolve(__dirname, 'example'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {test: /\.js$/, loader: 'babel-loader', options: babelOptions}
    ]
  },
  devtool: IS_PRODUCTION ? 'source-map' : 'eval',
  devServer: {
    contentBase: './example'
  }
}
