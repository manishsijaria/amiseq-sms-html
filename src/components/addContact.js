import React from 'react'
import '../css/generic-form.css'

class AddContact extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            contact: { firstname: '',  lastname: '', fullname:'', mobile_no: '',  contactType: 'Candidate' },
            submitted: false   
         }  
    }
    handelChange = (event) => {
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
                this.setState({  contact: { ...contact, [name] : value } }) 
        }
    }
    handleSubmit = (event) => {
        event.preventDefault()
        this.setState({ submitted: true })
        
    }
    render() {
        const { firstname, lastname, mobile_no, contactType } = this.state.contact
        const { submitted } = this.state
        return(
            <div>
                <div className='formheader'>
                    <h3>Add Contact</h3>
                </div>
                <div className='formcontainer'>
                    <form name="form" onSubmit={this.handleSubmit}>
                        <label for="firstname"><b>Firstname</b></label>
                        <input type="text" name="firstname" value={firstname} onChange={this.handelChange} placeholder="Contact's first name"/>

                        <label for="lastname"><b>Lastname</b></label>
                        <input type="text" name="lastname" value={lastname} onChange={this.handelChange} placeholder="Contact's last name"/>

                        <label for="mobile_no"><b>Mobile No.</b></label>
                        <input type="text" name="mobile_no" value={mobile_no} onChange={this.handelChange} placeholder="+1xxxxxxxxxx"/>

                        <label for="contactType"><b>Type</b></label>
                        <select name="contactType" value={contactType} onChange={this.handelChange}>
                            <option value="Client">Client</option>
                            <option value="Candidate">Candidate</option>
                            <option value="Others">Others</option>
                        </select>

                        <input type="submit" value="Submit"/>
                    </form>
                </div>
            </div>
        )
    }

}

export default AddContact