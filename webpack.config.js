// const webpack = require('webpack');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isModeProd = process.env.NODE_ENV === 'production';
const isModeDev = !isModeProd;

function resolvePath(pathQuery = 'src') {
  return path.resolve(__dirname, pathQuery);
}

function filename(ext) {
  return isModeDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
}

function jsLoaders() {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ];

  if (isModeDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
}

module.exports = {
  mode: 'development',
  context: resolvePath(),
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: filename('js'),
    path: resolvePath('build'),
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': resolvePath(),
      '@core': resolvePath('src/core'),
      '@styles': resolvePath('src/styles'),
    },
  },
  devServer: {
    static: {
      directory: resolvePath('build'),
    },
    compress: true,
    port: 9000,
    open: true,
  },
  devtool: isModeDev && 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'index.html',
      minify: {
        collapseWhitespace: isModeProd,
        removeComments: isModeProd,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolvePath('src/favicon.ico'),
          to: resolvePath('build'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s(a|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.m?js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.m?js$/i,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
    ],
  },
};
