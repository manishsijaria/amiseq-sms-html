
import React from 'react'
import '../css/generic-form.css'

import { connect } from 'react-redux'
import { userActions } from '../_actions'

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: { firstname: '', lastname: '', email: '', username: '', password: ''},
            submitted: false
        }
    }

    handelChange = (event) => {
        const { user } = this.state
        const { name, value } = event.target
        this.setState({
            user: { ...user,  [name]: value }
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        this.setState({ submitted: true})
        const { user } = this.state
        const { dispatch } = this.props
        if(user.firstname &&
           user.lastname &&
           user.email &&
           user.username &&
           user.password) {
               dispatch(userActions.register(user))
           }
    }

    render() {
        const { user } = this.state
        const { alert  } = this.props
        return(
            <div>
                <div className='formheader'>
                    <h3>Register User</h3>
                </div>
                <div className='alert-div'>
                  {(alert !== undefined && alert.message !== '')  &&
                      <div className={`alert ${alert.type}`}>{alert.message}</div>
                    }
                </div>                
                <div className='formcontainer'>
                    <form name="form" onSubmit={this.handleSubmit}>
                        <label for="firstname"><b>Firstname</b></label>
                        <input type="text" name="firstname" value={user.firstname} onChange={this.handelChange} placeholder="Enter your first name" required/>
                        
                        <label for="lastname"><b>Lastname</b></label>
                        <input type="text" name="lastname" value={user.lastname} onChange={this.handelChange} placeholder="Enter your last name" required/>
                        
                        <label for="email"><b>Email</b></label>
                        <input type="text" name="email" value={user.email} onChange={this.handelChange} placeholder="someone@gmail.com" required/>

                        <label for="username"><b>Username</b></label>
                        <input type="text" name="username" value={user.username} onChange={this.handelChange} placeholder="Enter your login username" required/>

                        <label for="password"><b>Password</b></label>
                        <input type="password" name="password" value={user.password} onChange={this.handelChange} required/>

                        <input type="submit" value="Submit"/>
                    </form>
                </div>
            </div>            
        )
    }
}
function mapStateToProps(state) {
    const { alert } = state
    return { alert }
}
const ConnectedRegister = connect(mapStateToProps)(Register)

export { ConnectedRegister as Register}