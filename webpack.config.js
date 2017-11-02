var path = require('path'),
    webpack = require('webpack'),
    CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: './app/app.js'
    },

    output: {
        path: path.join(__dirname, "dist"),
        filename: '[name].bundle.js',
        libraryTarget: 'umd'
    },
    devServer: {
        port: 4200
    },

    externals: {
        // require("jquery") is external and available
        // on the global var jQuery
        "jquery": "jQuery",
        "angular": "angular"
    },
        devtool: 'source-map',

    plugins: [
        new webpack.optimize.UglifyJsPlugin({minimize: true, warnings: false}),
        new CopyWebpackPlugin([
            {context:'app/', from:  '*', to: path.join(__dirname, "dist2"), force:true, ignore: ['*.txt','*.scss'] },
            {context:'app/', from:  '**/*', to: path.join(__dirname, "dist2"), force:true, ignore: ['*.txt','*.scss']},
            {context:'app/', from:  '**/**/*', to: path.join(__dirname, "dist2"), force:true, ignore: ['*.txt','*.scss']},
            {context:'app/', from:  '**/**/**/*', to: path.join(__dirname, "dist2"), force:true, ignore: ['*.txt','*.scss']}
        ])
    ]
};