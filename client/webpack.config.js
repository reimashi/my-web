const webpack = require("webpack");

module.exports = {
    mode: "development",
    entry: "./app/app.js",
    output: {
        path: __dirname,
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
