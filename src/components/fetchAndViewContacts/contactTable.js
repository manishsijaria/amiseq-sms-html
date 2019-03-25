
import React from 'react'
import ContactRow from './contactRow'

export default class ContactTable  extends React.Component {
    selected = (contact) => {
        this.props.onContactClick(contact)
    }
    render() {
        const contacts = this.props.contacts
        let  tagContactRows
        if(!contacts || !contacts.length) {
            return null
        } else { 
            tagContactRows =  contacts.map(contact => 
                                            <ContactRow 
                                                key={contact.contact_id} 
                                                contact={contact}
                                                contactSelected={this.props.contactSelected}
                                                onContactClick={this.selected}>
                                            </ContactRow>)
        }
        return(
            <div className='contentTable'>
                {tagContactRows}
            </div>
        )
    }
}