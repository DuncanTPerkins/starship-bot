const path = require( 'path' );

module.exports = {

    // bundling mode
    mode: 'production',

    // entry files
    entry: './main.ts',

    // output bundles (location)
    output: {
        path: path.resolve( __dirname, 'build' ),
        filename: 'main.js',
    },

    // file resolutions
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    target: "node",
    node: {
        __dirname: false
    },

    // loaders
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader'
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            }
        ]
    }
};