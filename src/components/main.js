import React from 'react'
import { Route, Switch} from 'react-router-dom'
import  { AppPage }  from './appPage'
import  { Login } from './login'
import { Register }  from './register'
import { AddContact } from './addContact'
import '../css/overall-layout.css'

const NotFound = () => 'Page Not Found. Please enter valid URL.'
export default class Main extends React.Component {
    render() {
        return(
            <div className='center-grid'> 
                <Switch>
                    <Route exact path="/"  component={AppPage} />
                    <Route path="/login" component={Login} />
                    <Route path="/logout" component={AppPage} />
                    <Route path="/register@1234" component={Register} />
                    <Route path="/addcontact" component={AddContact}/>
                    <Route path="*" component={NotFound}/>
                </Switch>
            </div>
        )
    }
}