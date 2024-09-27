const path = require('path');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: './src/zv-player-sdk.js',
  output: {
    filename: 'zv-player-sdk.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'VPlayer',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      extensions: ['js'],
      fix: true,
    }),
  ],
  mode: 'production',
};