import React from 'react'
import '../css/generic-form.css'
import {connect} from 'react-redux'
import { contactTypeActions, contactActions } from '../_actions'
import { push } from 'connected-react-router'

const CONTACT_TYPES = {
    CANDIDATE : 1,
    CLIENT : 2,
    OTHERS: 3, 
}

class AddContact extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            contact: { firstname: '',  lastname: '', fullname:'', 
                        mobile_no: '',  contact_type_id: CONTACT_TYPES.CANDIDATE, user_id: '' },
            submitted: false   
         }  
    }

    componentWillMount() {
        const { dispatch } = this.props
        dispatch(contactTypeActions.getContactTypes())
    }

    handelChange = (event) => {
        const { user } = this.props
        const { contact } = this.state
        const { name, value } = event.target
        switch(name) {
            case 'firstname':
                this.setState({ contact: {...contact, [name] : value, fullname: value + ' ' + contact.lastname}})
                break;
            case 'lastname':
                this.setState({ contact: {...contact, [name] : value, fullname: contact.firstname + ' ' + value}})
                break;
            default:
                this.setState({  contact: { ...contact, [name] : value,  user_id: user.user_id } }) 
        }
    }
    handelSubmit = (event) => {
        event.preventDefault()
        const { dispatch } = this.props

        /*
        NOTE: this.state.contact.user_id is not setting here, don't know why.
        therefore shifted to handelChange

        alert('user_id: ' + user.user_id)
        this.setState({submitted: true , contact: {...this.state.contact, user_id: this.props.user.user_id}})
        */
        this.setState({ submitted: true })
        
        const { firstname, lastname, mobile_no, contact_type_id } = this.state.contact

        if(firstname && lastname && mobile_no && contact_type_id) {
            dispatch(contactActions.addContact(this.state.contact))
        }
    }
    
    handelCancel = (event) => {
        const { dispatch } = this.props
        event.preventDefault()
        dispatch(push('/landingpage'))
    }

    render() {
        const { firstname, lastname, mobile_no, contact_type_id } = this.state.contact
        const { contactTypes, alert  } = this.props

        var tagOptions
        if(!contactTypes.length) {
            tagOptions = `<option key={0} value={0}>{' '}</option>`
        } else { 
            tagOptions =  contactTypes.map(contactType => 
                                            <option key={contactType.contact_type_id} value={contactType.contact_type_id}>
                                                    {contactType.type_name}
                                            </option>)
        }
        return(
            <div>
                <div className='formheader'>
                    <h3>Add Contact</h3>
                </div>
                <div className='alert-div'>
                  {(alert !== undefined && alert.message !== '')  &&
                      <div className={`alert ${alert.type}`}>{alert.message}</div>
                    }
                </div>
                <div className='formcontainer'>
                    <form name="form" onSubmit={this.handelSubmit}>
                        <label htmlFor="firstname"><b>Firstname</b></label>
                        <input type="text" name="firstname" value={firstname} onChange={this.handelChange} placeholder="Contact's first name" required/>

                        <label htmlFor="lastname"><b>Lastname</b></label>
                        <input type="text" name="lastname" value={lastname} onChange={this.handelChange} placeholder="Contact's last name" required/>

                        <label htmlFor="mobile_no"><b>Mobile No.</b></label>
                        <input type="text" name="mobile_no" value={mobile_no} onChange={this.handelChange} placeholder="+1xxxxxxxxxx" required/>

                        <label htmlFor="contact_type_id"><b>Type</b></label>
                        <select name="contact_type_id" value={contact_type_id} onChange={this.handelChange} >
                                {/*<option>{' '}</option> */}
                                {tagOptions}
                        </select>
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
    const { contactTypes } = state.contactTypesGet
    const { user, loggedIn } = state.authentication
    return { alert, contactTypes, user, loggedIn }
}

const connectedAddContact = connect(mapStateToProps)(AddContact)

export { connectedAddContact as AddContact}
