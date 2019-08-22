
const BabelLoader = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader',
        options: {
            //Module build failed (from ./node_modules/babel-loader/lib/index.js)
            //Use : npm install -D babel-loader @babel/core @babel/preset-env            
            presets: ["@babel/env",  "@babel/react"],
            
            //Fix: for es2015 syntex, myfunc = () => {}
            plugins:  [
                    ["@babel/plugin-proposal-class-properties", { "loose": true } ]
            ]                 
        },
    }
}

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CSSLoader = (env) =>  ({
    test:/\.css$/,
    use:[ 
        (env === 'production') ? 
            MiniCssExtractPlugin.loader : 
            {   loader: 'style-loader', options: { sourceMap: true }},
        {   loader:'css-loader', options: { sourceMap: true, importLoaders: 1  }},
        {   loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                plugins: [
                    require('autoprefixer')({grid: true})
                ],
                sourceMap: true,                
            },
        }
    ]
})

const URLLoader = {
    test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg|ico)(\?[a-z0-9=.]+)?$/,
    //loader: 'url-loader?limit=100000' 
    use: [
        {
            loader: 'url-loader',
            options: {
                limit: 100000
            }
        },                       
    ]                    
}    


module.exports = {
    BabelLoader : BabelLoader,
    CSSLoader : CSSLoader,
    URLLoader : URLLoader,
}