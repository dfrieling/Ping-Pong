module.exports = {
    entry: './app.js',
    output: {
        path: path.resolve( __dirname, 'ui/public/build' ),
        filename: 'main.js',
        sourceMapFilename: 'main.js.map'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.es6'],
        modulesDirectories: ['node_modules']
    },
    module: {
        rules: [
            {
                test: /\.jade$/,
                use: 'jade'
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader', // creates style nodes from JS strings
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
            template: './views/home.jade'
        })
    ]
};