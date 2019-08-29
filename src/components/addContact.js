import React from 'react'
import '../css/generic-form.css'
import {connect} from 'react-redux'
import { contactTypeActions, contactActions } from '../_actions'
import { push } from 'connected-react-router'
import { genericFunctions } from '../_genericFunctions'
import { alertActions } from '../_actions';

const CONTACT_TYPES = {
    CANDIDATE : 1,
    CLIENT : 2,
    OTHERS: 3, 
}

class AddContact extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            contact: { firstname: '-',  lastname: '-', fullname:'', 
                        mobile_no: '',  contact_type_id: CONTACT_TYPES.CANDIDATE, user_id: '' },
            submitted: false   
         }  
    }
   
    static getDerivedStateFromProps(props, state) {
        //alert('getDerivedStateFromProps')
        if (props.user.user_id !== state.contact.user_id ) {
            //alert(props.user.user_id)
            return {
                contact: {...state.contact, user_id: props.user.user_id },
                submitted: state.submitted
            };
        }
        // Return null if the state hasn't changed
        return null;
    }    

    componentDidMount() {
        const { dispatch , match} = this.props
        //alert('componentDidMount')
        //Clear the previous error msg.
        dispatch(alertActions.clear())
        dispatch(contactTypeActions.getContactTypes())

        let param = match.params.param
        //alert(match.params.param)
        if(! (param === undefined || param === '') ) {
            if(genericFunctions.isANumber(param)) {
                this.setState({ contact: {...this.state.contact, 
                                            mobile_no : genericFunctions.formatPhoneNumber(param)}})
            } else { //firstname lastname
                let indexOfSearchText = param.toLowerCase().indexOf(' ')
                let firstName, lastName
                if(indexOfSearchText !== -1) {
                    firstName = param.substring(0,indexOfSearchText)
                    lastName = param.substring(indexOfSearchText + 1, param.length)
                    this.setState({ contact: {...this.state.contact, 
                                                firstname: firstName,
                                                lastname: lastName,
                                                fullname: firstName + ' ' + lastName}}) 
                } else { //firstname
                    firstName = param.substring(0,param.length)
                    this.setState({ contact: {...this.state.contact, 
                                                firstname: firstName}}) 
                }
            }
        }        
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
        if(genericFunctions.isPhoneNumber(this.state.contact.mobile_no)) {
            let mob_no = genericFunctions.formatPhoneNumber(this.state.contact.mobile_no)
            //alert(mob_no)
            this.setState({   contact: { ...this.state.contact, mobile_no : mob_no}}, 
                            ()=> { console.log('hello')})
            
           //this.setState((state, props) => ({   contact: {  mobile_no : mob_no}})) 
            
        } else {
            let e = "Mobile no must be 10 digit no. prefixed by +"
            dispatch(alertActions.error(e))
            return 
        }        
        
        /*
        NOTE: this.state.contact.user_id is not setting here, don't know why.
        therefore shifted to handelChange

        alert('user_id: ' + user.user_id)
        this.setState({submitted: true , contact: {...this.state.contact, user_id: this.props.user.user_id}})
        */
       
        this.setState({ submitted: true })
        
        //NOTE: setTimeout bcos the setState do not immediatily updates the state ;)
        setTimeout(()=>{
            const { firstname, lastname, mobile_no, contact_type_id, user_id } = this.state.contact
            //alert(user_id)
            if(firstname && lastname && mobile_no && contact_type_id) {
                dispatch(contactActions.addContact(this.state.contact))
            }
        },300)
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
                                            (contactType.contact_type_id === CONTACT_TYPES.CANDIDATE) ?
                                            <option key={contactType.contact_type_id} value={contactType.contact_type_id}>
                                                    {contactType.type_name}
                                            </option> : '')
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
                        <input type="text" name="mobile_no" value={mobile_no}  onChange={this.handelChange} placeholder="+1xxxxxxxxxx" required/>

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
