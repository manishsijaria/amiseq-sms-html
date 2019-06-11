
import React from 'react'
import '../css/generic-form.css'

import { connect } from 'react-redux'
import { userTypeActions, userActions } from '../_actions'
import { push } from 'connected-react-router'

const USER_TYPES = {
    SUPER_ADMIN : 1,
    ADMIN : 2,
    RECRUITER: 3, 
}

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: { firstname: '', lastname: '', user_type_id : USER_TYPES.RECRUITER,
                    email: '', username: '', password: ''},
            submitted: false
        }
    }

    componentWillMount() {
        const { dispatch } = this.props
        dispatch(userTypeActions.getUserTypes())
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
           user.user_type_id &&
           user.email &&
           user.username &&
           user.password) {
               dispatch(userActions.register(user))
           }
    }

    handelCancel = (event) => {
        const { dispatch } = this.props
        event.preventDefault()
        dispatch(push('/'))
    }

    render() {
        const { user } = this.state
        const { userTypes, alert  } = this.props

        let tagOptions
        if(!userTypes.length) {
            tagOptions = `<option key={0} value={0}>{' '}</option>`
        } else {
            tagOptions =  userTypes.map(userType => 
                (userType.user_type_id !== USER_TYPES.SUPER_ADMIN) ?
                    <option key={userType.user_type_id} value={userType.user_type_id}>
                            {userType.type_name}
                    </option> : '')            
        }
        return(
            <div>
                <div className='formheader'>
                    <h3>Sign Up</h3>
                </div>
                <div className='alert-div'>
                  {(alert !== undefined && alert.message !== '')  &&
                      <div className={`alert ${alert.type}`}>{alert.message}</div>
                    }
                </div>                
                <div className='formcontainer'>
                    <form name="form" onSubmit={this.handleSubmit}>
                        <label htmlFor="firstname"><b>First Name</b></label>
                        <input type="text" name="firstname" value={user.firstname} onChange={this.handelChange} placeholder="Enter your first name" required/>
                        
                        <label htmlFor="lastname"><b>Last Name</b></label>
                        <input type="text" name="lastname" value={user.lastname} onChange={this.handelChange} placeholder="Enter your last name" required/>
                        
                        <label htmlFor="user_type_id"><b>Type</b></label>
                        <select name="user_type_id" value={user.user_type_id} onChange={this.handelChange} >
                                {/*<option>{' '}</option> */}
                                {tagOptions}
                        </select>

                        <label htmlFor="email"><b>Email</b></label>
                        <input type="text" name="email" value={user.email} onChange={this.handelChange} placeholder="someone@amiseq.com" required/>

                        <label htmlFor="username"><b>Username</b></label>
                        <input type="text" name="username" value={user.username} onChange={this.handelChange} placeholder="Enter your login username" required/>

                        <label htmlFor="password"><b>Password</b></label>
                        <input type="password" name="password" value={user.password} onChange={this.handelChange} required/>
                        <div className='divButtons'>
                            <button type="button" onClick={this.handelCancel}>Cancel</button>
                            <input type="submit" value="Submit"/>
                        </div>
                    </form>
                </div>
            </div>            
        )
    }
}
function mapStateToProps(state) {
    const { alert } = state
    const { userTypes } = state.userTypesGet
    return { alert, userTypes }
}
const ConnectedRegister = connect(mapStateToProps)(Register)

export { ConnectedRegister as Register}