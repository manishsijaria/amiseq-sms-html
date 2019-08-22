
const path = require('path')        // to get the current path
const webpack = require('webpack')
const dotenv = require('dotenv')    // to read and parse the .env files
const fs = require('fs');           // to check if the file exists

const loaders = require('./webpack.loaders')
const plugins = require('./webpack.plugins')

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

    return {
        mode: 'development',
        entry: {
            sms_react_app: path.join(__dirname,'/src/index.js'),
        },
        output: {
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

        //----------- Development Specific ------------
        devtool: 'inline-source-map',   //NOTE: webpack-dev-server object only, recommended devtool for that environment (strong source mapping)
        //NOTE: webpack-dev-server object only, NOT used in production webpack.config.prod.js
        devServer: {
            //the options like “inline” and “hot” are webpack-dev-server only options.
            inline: true,
            hot:true,
            //this specifies base folder from where the dev-server would serve the application and its contents
            contentBase: path.join(__dirname, "/src/"),
            host: '[::1]',  /* my own IP */
            port:3000,      /* number not string */
            proxy: {        //node.js server /api -  ip:port
                '/api': 'http://[::1]:3001'
            }            
        },
        //----------------------------------------------
        plugins: [
            plugins.HtmlWebpackPlugin(env.NODE_ENV),
            //DefinePlugin internally and maps the environment values to code through it. 
            new webpack.DefinePlugin(envKeys),
            
            //----------- Development Specific ------------
            //NOTE: webpack-dev-server will replace the module without having us to reload the page 
            //and without losing the application state. the browser could refresh by itself whenever we make and save any change to our code.
            new webpack.HotModuleReplacementPlugin(),
            //---------------------------------------------            
        ]
    }
}