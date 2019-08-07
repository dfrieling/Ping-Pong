const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        main: './app.js',
        style: './ui/public/css/base.less'
    },
    output: {
        path: path.resolve( __dirname, 'ui/public/build' ),
        filename: '[name].js',
        sourceMapFilename: 'main.js.map'
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
                    /*{
                        loader: 'style-loader', // creates style nodes from JS strings
                    },*/
                    {
                        loader: MiniCssExtractPlugin.loader, // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
        }),
        new MiniCssExtractPlugin({
        }),
    ]
};