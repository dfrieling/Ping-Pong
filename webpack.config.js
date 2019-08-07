const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: './app.js',
        style: './ui/public/css/base.less'
    },
    output: {
        path: path.resolve( __dirname, 'ui/public/build' ),
        filename: '[name].js',
        sourceMapFilename: 'main.js.map',
        publicPath: path.resolve( __dirname, 'ui/public/' ),
    },
    target: 'node',
    /*resolve: {
        extensions: ['', '.js', '.jsx', '.es6'],
        modulesDirectories: ['node_modules']
    },*/
    node: {
        fs: 'empty',
        net: 'empty',
        mssql: 'empty',
    },
    externals: {
        knex: 'commonjs knex'
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'less-loader'
                ],
            },
        ],
    },
    plugins: isProduction ? [new MiniCssExtractPlugin()] : []
};