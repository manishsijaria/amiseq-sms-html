import React from 'react'
import {connect} from 'react-redux'
import { userActions } from '../../_actions'

const users = 
[
    {user_id : 1, fullname: 'Manish Sijaria'},
    {user_id : 2, fullname: 'Kumar Saurabh'},
]

export default class SelectUser  extends React.Component {
    constructor(props) {
        super(props)
        this.state = { user_id: ''}  
    }

    componentWillMount() {
        const { dispatch } = this.props
        //dispatch(userActions.getUsers())
    }

    handelChange = (event) => {
        const { name, value } = event.target
        this.setState({ [name] : value})
        //TODO
        //this.props.handelSelectUser
    }
    render() {
        //const { contactTypes } = this.props
        const { user_id } = this.state
        var tagOptions
        if(!users.length) {
            tagOptions = `<option key={0} value={0}>{' '}</option>`
        } else { 
            tagOptions =  users.map(user => 
                                        <option key={user.user_id} value={user.user_id}>
                                                {user.fullname}
                                        </option>)
        }        
        return(
                <div id="user">
                    <label for="User" ><b>User</b></label>
                    <select name="user_id" value={user_id} onChange={this.handelChange} >
                        {/*<option>{' '}</option> */}
                        {tagOptions}
                    </select>
                </div> 
        )
    }
}

/*
function mapStateToProps(state) {
    const { contactTypes } = state.contactTypesGet
    return { contactTypes }
}

const connectedSelectContactType = connect(mapStateToProps)(SelectContactType)

export { connectedSelectContactType as SelectContactType}

*/