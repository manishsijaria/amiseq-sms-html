import React, { Component } from 'react';
import { Route, Switch} from 'react-router-dom'

import { history } from './_helpers';
import { ConnectedRouter } from 'connected-react-router';

import { Header } from './components/header'
import Main from './components/main'
import { LandingPage } from './components/landingPage'

import './css/overall-layout.css'

class App extends Component {
  
  render() {
    
    return (
      <ConnectedRouter history={history}>
        <div className='border'>
          <div className='grid-container'>
              <div className='header'>
                <Header/>
              </div> 
              
              <Switch>
                <Route exact path="/landingpage"  component={LandingPage} />
                <Route component={Main}></Route>
              </Switch>
              <div className='footer'>
                  Copyright © 2017 &nbsp; Amiseq Inc.® &nbsp;&nbsp; | &nbsp;&nbsp; V {process.env.REACT_APP_VERSION}
              </div>
          </div>
        </div>
      </ConnectedRouter>
    );
  }
}

export default App;
