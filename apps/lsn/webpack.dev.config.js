const merge = require('webpack-merge');
const common = require('./webpack.common.js');
//const { graphqlWebpackPlugin } = require('./scripts/graphql/graphql-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [new CleanWebpackPlugin()],
  output: {
    filename: `[name].[hash].bundle.js`,
    chunkFilename: `[name].[hash].bundle.js`,
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    stats: 'minimal',
  },
});
