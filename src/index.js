import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import { store } from './_helpers'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

//load environment variables.
/*
var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')
var myEnv = dotenv.config()
dotenvExpand(myEnv)
*/
//alert(`${process.env.REACT_APP_VERSION}`);

ReactDOM.render(
                <Provider store={store}>
                    <App />
                </Provider>, 
                document.getElementById('root')
                );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
