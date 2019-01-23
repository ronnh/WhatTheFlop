var path = require('path');

const webpack = require('webpack');
const config = {
    entry: path.resolve( __dirname + '/js/index.js'),
    output: {
        path: path.resolve(__dirname + '/dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
	module: {
	  rules: [
	    {
	      test: /\.js?/,
	      exclude: /node_modules/,
	      use: 'babel-loader'
	    }
	  ]
	},
	plugins: [
    	new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en|zh-tw)$/)
	]
};
module.exports = config;