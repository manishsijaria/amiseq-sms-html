
Webpack (needed for dev and prod builds) installation and configurations.
=======================================================================
======= Development Server Client (React Project) ========
npm install --save-dev webpack webpack-dev-server webpack-cli html-webpack-plugin

npm install --save-dev babel-loader @babel/core @babel/preset-env @babel/plugin-proposal-class-properties

//Create a new file named .babelrc inside the project folder
{"presets":[ "@babel/env", "@babel/react"]}

//for .css files
npm install --save-dev css-loader style-loader 

//  PostCSS plugin to parse CSS and add vendor prefixes to CSS rules
//  The best way to provide browsers is a package.json,(   "browserslist": [] )
//     NOTE:- that babel-loader also uses this, hence its a common place.  
npm install --save-dev postcss-loader autoprefixer

//for images .png and url
npm install --save-dev file-loader url-loader

//for .env.development and .env.production, used in webpack.config.*.js (see below)
npm install --save-dev dotenv

create webpack.config.dev.js
=======================================================================

======= Production Server Client (React Project) ========
npm install --save-dev clean-webpack-plugin
npm install --save-dev uglifyjs-webpack-plugin
npm install --save-dev compression-webpack-plugin 
npm install --save-dev mini-css-extract-plugin      //PostCSS will not work without this plugin. 

create webpack.config.prod.js

=======================================================================

NOTE: Check the dev dependencies in package.json file after installations.


