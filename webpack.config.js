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
};