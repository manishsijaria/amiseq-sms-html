
import React from 'react'
import {connect} from 'react-redux'
import { contactTypeActions } from '../../_actions'
import '../../css/contact.css'

class SelectContactType  extends React.Component {
    constructor(props) {
        super(props)
        this.state = { contact_type_id: ''}  
    }

    componentWillMount() {
        const { dispatch } = this.props
        dispatch(contactTypeActions.getContactTypes())
    }

    handelChange = (event) => {
        const { name, value } = event.target
        this.setState({ [name] : value})
        //TODO
        //this.props.handelSelectContactType
    }
    render() {
        const { contactTypes } = this.props
        const { contact_type_id } = this.state
        
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
                <div id="contact_type">
                    <label for="contact_type_id" ><b>Type</b></label>
                    <select name="contact_type_id" value={contact_type_id} onChange={this.handelChange} >
                        {/*<option>{' '}</option> */}
                        {tagOptions}
                    </select>      
                </div> 
        )
    }
}

function mapStateToProps(state) {
    const { contactTypes } = state.contactTypesGet
    return { contactTypes }
}

const connectedSelectContactType = connect(mapStateToProps)(SelectContactType)

export { connectedSelectContactType as SelectContactType}