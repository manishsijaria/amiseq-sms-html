
const path = require('path')        // to get the current path

const _HtmlWebpackPlugin = require('html-webpack-plugin')

const HtmlWebpackPlugin = (env) => {
    if(env === 'development') {
        return new _HtmlWebpackPlugin({template: path.join(__dirname,'/public/index.html')})
    } else {
        return new _HtmlWebpackPlugin({ 
            template: path.join(__dirname,'/public/index.html'),
            //Fix: in PROD for %PUBLIC_URL%/fevicon.ico , %PUBLIC_URL%/manifest.json in index.html file.
            fevicon: path.join(__dirname,'/public/fevicon.ico'),
            manifest: path.join(__dirname,'/public/manifest.json'),
        })
    }
}

module.exports = {
    HtmlWebpackPlugin 
};