const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'production',
    target: 'node',
    entry: {
        index: path.resolve(__dirname, 'index.js')
    },
    externals: [nodeExternals()],
    optimization: {
        nodeEnv: false
    },
    plugins: [
        new webpack.DefinePlugin({ 'process.env.WEBPACKING': 'true' })
    ],
    output: {
        path: path.resolve(__dirname, 'bundled'),
        filename: 'index.js',
        library: 'webpack',
        libraryTarget: 'umd',
        globalObject: 'this',
        umdNamedDefine: true
    }
}