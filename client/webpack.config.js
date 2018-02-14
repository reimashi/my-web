const DEBUG = false;

const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: "./app/app.js",
    output: {
        filename: './app/app.bundle.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            '$': "jquery",
            'jQuery': "jquery",
            'Popper': 'popper.js'
        })
    ].concat(DEBUG ? [] : [
        new UglifyJsPlugin()
    ])
};