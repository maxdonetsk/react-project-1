var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');

module.exports = function (env) {

  var dev = JSON.stringify(JSON.parse(env.mode === 'development'));

  return {
    entry: './src/js/app',
    output: {
      filename: './public_html/bundle.js'
    },
    devtool: 'source-map',
    module: {
      loaders: [
	{
	  test: /\.js$/,
	  loader: 'babel-loader',
	  query: {
	    presets: ['es2015', 'react', 'stage-0']
	  }
	},
	{
	  test: /\.scss$/,
	  loaders: ['style-loader', 'css-loader', 'sass-loader']
	},
	{
	  test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
	  loader: 'url-loader?limit=10000&mimetype=application/font-woff'
	},
	{
	  test: /\.ttf?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
	  loader: 'url-loader?limit=10000&mimetype=application/x-font-truetype'
	},
	{
	  test: /\.eot?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
	  loader: 'url-loader?limit=10000&mimetype=application/vnd.ms-fontobject'
	},
	{
	  test: /\.svg?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
	  loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
	}
      ]
    },
    plugins: [
      new CopyWebpackPlugin([
	{from: './src/index.html', to: './public_html/index.html'},
	{from: './src/assets', to: './public_html/assets'}
      ]),
      new webpack.DefinePlugin({
	__DEV__: dev
      })
    ],
    devServer: {
      publicPath: '/',
      contentBase: "./public_html",
      hot: true,
      historyApiFallback: true
    },
    node: {
      dns: 'empty',
      net: 'empty'
    }
  };
};
