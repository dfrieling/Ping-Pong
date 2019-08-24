const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        main: './ui/public/js/main.js',
        style: './ui/public/css/base.less'
    },
    output: {
        path: path.resolve( __dirname, 'ui/public/build' ),
        filename: '[name].js',
        sourceMapFilename: 'main.js.map',
        publicPath: path.resolve( __dirname, 'ui/public/' ),
    },
    devtool: 'eval-source-map',
    watch: true,
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ],
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            {
                                plugins: [
                                    '@babel/plugin-proposal-class-properties'
                                ]
                            }
                        ]
                    },
                },
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin()
    ],
    devServer: {
        contentBase: path.resolve( __dirname, 'ui/public/build' ),
        compress: true,
        port: 9000
    }
};