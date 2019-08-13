
import React from 'react'
//import '../css/overall-layout.css'
import { connect } from 'react-redux'
import { userActions } from '../_actions'

export default class AppPage extends React.Component {
    componentWillMount() {
        const URL = this.props.match.url
        const { dispatch } = this.props
        if(URL.indexOf('/logout') !== -1) {
            dispatch(userActions.logout())
        } 
    }
    render() {
        return(
                <div style = {{ textAlign: 'center'}}>
                    <h1>Login to {process.env.REACT_APP_NAME} </h1> 
                    <p >Select the menu on top right and get started.</p> 
                </div> 
        )
    }
}


const connectedAppPage = connect()(AppPage)

export {connectedAppPage as AppPage}