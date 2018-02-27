const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = env => {
    let stable = require("./webpack.config");

    stable.mode = "production";
    stable.output = {
        path: __dirname,
        filename: path.relative("./", path.join(env["BuildDir"], 'app.bundle.js'))
    };

    stable.plugins = stable.plugins.concat([
        new UglifyJsPlugin()
    ]);

    return stable;
};
