const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './src/index.ts',
  plugins: [
    new webpack.ProgressPlugin(),
    new CopyPlugin([
      { from: 'src/static', to: 'src/static' },
      { from: 'src/static', to: 'static' },
    ]),
  ],

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        include: [path.resolve(__dirname, 'src')], // eslint-disable-line no-undef
        exclude: [/node_modules/],
        options: {
          configFile: 'tsconfig.json',
        },
      },
    ],
  },

  externals: {
    express: 'require("express")',
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },
};
