
import React from 'react'

import '../css/generic-form.css'

import { connect } from 'react-redux'
import { userActions } from '../_actions'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            submitted: false
        }
    }

    handelChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name] : value
        })
    }
    
    handleSubmit = (event) => {
        event.preventDefault()
        this.setState({ submitted: true})
        //TODO: goto / path, having projects on the left.
        //alert(this.state.username + ' ' + this.state.password)
        const { username, password } = this.state

        const { dispatch } = this.props
        if(username && password) {
            dispatch(userActions.login(username,password))
        }
    }
    
    render() {
        const { username, password } = this.state
        const {  alert  } = this.props
        return(
            <div>
                <div className='formheader'>
                    <h3>Sign In</h3>
                </div>
                <div className='alert-div'>
                  {(alert !== undefined && alert.message !== '')  &&
                      <div className={`alert ${alert.type}`}>{alert.message}</div>
                    }
                </div>                
                <div className='formcontainer'>
                    <form name="form" onSubmit={this.handleSubmit}>
                        <label htmlFor="username"><b>Username</b></label>
                        <input type="text" name="username" value={username} onChange={this.handelChange} placeholder="Enter your login username"/>

                        <label htmlFor="password"><b>Password</b></label>
                        <input type="password" name="password" value={password} onChange={this.handelChange}/>

                        <input type="submit" value="Login"/>
                    </form>
                </div>
            </div>   
        )
    }
}

function mapStateToProps(state) {
    const { alert } = state
    const { loggingIn, loggedIn, user } = state.authentication
    return { alert, loggingIn,loggedIn, user }
}

const connectedLogin = connect(mapStateToProps)(Login)

export {connectedLogin as Login}
