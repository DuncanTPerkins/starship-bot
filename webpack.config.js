const path = require( 'path' );

module.exports = {
    // entry files
    entry: './main.ts',
   

    // bundling mode
    mode: 'production',
    target: "node",
    node: {
        __dirname: false
    },

    // output bundles (location)
    output: {
        filename: '[name].[hash].bundle.js',
        path: path.resolve( __dirname, 'build' ),
        chunkFilename: '[name].[hash].bundle.js'
    },
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    enforce: true
                }
            }
        }
    },

    // file resolutions
    resolve: {
        modules : [
            'node_modules'
        ],
        extensions: [ '.ts', '.js', '.json'],
    },

    // loaders
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            }
        ]
    }
};