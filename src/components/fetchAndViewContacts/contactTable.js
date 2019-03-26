
import React from 'react'
import ContactRow from './contactRow'

export default class ContactTable  extends React.Component {
    selected = (contact) => {
        this.props.onContactClick(contact)
    }
    render() {
        const contacts = this.props.contacts
        let  tagContactRows = []
        const {  filterText  } = this.props
        if(!contacts || !contacts.length) {
            return null
        } else { 
            contacts.forEach(contact => {
                if(filterText && contact.fullname.toLowerCase().indexOf(filterText.toLowerCase()) === -1) { 
                    return 
                } else {
                    tagContactRows.push(<ContactRow 
                                            key={contact.contact_id} 
                                            contact={contact}
                                            contactSelected={this.props.contactSelected}
                                            onContactClick={this.selected}>
                                        </ContactRow>);
                }

            });
        }
        return(
            <div className='contentTable'>
                {tagContactRows}
            </div>
        )
    }
}