const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { graphqlWebpackPlugin } = require('./scripts/graphql/graphql-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [graphqlWebpackPlugin, new CleanWebpackPlugin(), new Dotenv()],
  output: {
    filename: `[name].[hash].bundle.js`,
    chunkFilename: `[name].[hash].bundle.js`,
  },
  devServer: {
    https: true,
    historyApiFallback: {
      disableDotRule: true,
    },
    noInfo: true,
    stats: 'minimal',
  },
});
