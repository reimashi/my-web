const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = env => {
    let stable = require("./webpack.config");

    stable.output = {
        filename: path.relative("./", path.join(env["BuildDir"], 'static/app.bundle.js'))
    };

    stable.plugins = stable.plugins.concat([
        new UglifyJsPlugin()
    ]);

    return stable;
};
