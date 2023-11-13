const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['@babel/polyfill', './src/index.tsx'],
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, './dist'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [new HtmlWebpackPlugin({ template: './public/index.html' })],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
            },
          },
          {
            loader: 'eslint-loader',
            options: { fix: true },
          },
        ],
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.(gif|jpe?g|png|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },

      {
        test: /\.mjs$/,
        include: /node_modules\/graphql/,
        type: 'javascript/auto',
      },
    ],
  },
  resolve: {
    symlinks: true,
    mainFields: ['module-ts', 'browser', 'module', 'main'],
    extensions: ['.mjs', '.ts', '.tsx', '.js'],
  },
};
