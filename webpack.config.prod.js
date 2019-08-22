
const path = require('path')        // to get the current path
const webpack = require('webpack')
const dotenv = require('dotenv')    // to read and parse the .env files
const fs = require('fs');           // to check if the file exists

const loaders = require('./webpack.loaders')
const plugins = require('./webpack.plugins')

//----------------- Production Specific ---------------
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = (env) => {
    // Get the root path (assuming your webpack config is in the root of your project!)
    const currentPath = path.join(__dirname);    

    // Create the fallback path (the production .env)
    const basePath = currentPath + '/.env';    

    // We're concatenating the environment name to our filename to specify the correct env file!
    const envPath = basePath + '.' + env.NODE_ENV;    

    // Check if the file exists, otherwise fall back to the production .env
    const finalPath = fs.existsSync(envPath) ? envPath : basePath;   
    
    // Set the path parameter in the dotenv config
    const fileEnv = dotenv.config({ path: finalPath }).parsed;   

    // reduce it to a nice object, the same as before (but with the variables from the file)
    const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
        return prev;
    }, {});    
    /*
        In production, our goals shift to a focus on minified bundles, lighter weight source maps, 
        and optimized assets to improve load time.        
    */
    return {
        mode: 'production', //Use production mode configuration option to enable various optimizations including minification and tree shaking.
        entry: {
            sms_react_app: path.join(__dirname,'/src/index.js'),
        },
        output: {
            //publicPath: '/amiseq-sms',
            path: path.join(__dirname,'/client-dist/'),
            filename: '[name].bundle.js',   //[name] will be replaced by sms_react_app from entry object.
        },
        module: {
            rules: [
                loaders.BabelLoader,
                //Fix: ERROR in ./src/index.css 1:5 Module parse failed: Unexpected token (1:5)
                loaders.CSSLoader(env.NODE_ENV),
                //Fix: ERROR in ./src/images/circles.png 1:0
                loaders.URLLoader,                           
            ]
        },
        stats: { children: false },     //FIX: for Entrypoint undefined = index.html
        plugins: [
            plugins.HtmlWebpackPlugin(env.NODE_ENV),
            new webpack.DefinePlugin(envKeys),
            
            //--------- Production Specific -----------
            //It cleans the output.path (/client-dist) directory before new files are bundled.
            //dry - Simulate the removal of files, verbose - print to console (set to true when dry is true)
            new CleanWebpackPlugin({  dry: true, verbose: true}),

            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // all options are optional
                filename: '[name].css',
                chunkFilename: '[id].css',
                ignoreOrder: false, // Enable to remove warnings about conflicting order
            }),

            new UglifyJsPlugin(),                           //minify everything
            new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
            new CompressionPlugin({   
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$|\.png/,
                threshold: 10240,
                minRatio: 0.8
              }),
            //-----------------------------------------
        ]
    }
}