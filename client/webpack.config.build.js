const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let stable = require("./webpack.config");

stable.output = {
    filename: '../build/static/app.bundle.js'
}

stable.plugins = stable.plugins.concat([
    new UglifyJsPlugin()
]);

module.exports = stable;
