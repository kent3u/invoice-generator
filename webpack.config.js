const path = require('path');
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: './js/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'js')
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    }
}