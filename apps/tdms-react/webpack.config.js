const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const Dotenv = require('dotenv-webpack');

// TODO: Update Dotenv to use a production .env file
module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: `[name].[chunkHash].bundle.js`,
    chunkFilename: `[name].[chunkHash].bundle.js`,
  },
  plugins: [new Dotenv()],
});
