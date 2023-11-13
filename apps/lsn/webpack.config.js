const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: `[name].[chunkHash].bundle.js`,
    chunkFilename: `[name].[chunkHash].bundle.js`,
  },
});
