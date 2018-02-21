const webpack = require("webpack");

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
    ]
};
