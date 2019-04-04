
import React from 'react'
import '../../css/contact.css'
export default class ContactRow  extends React.Component {
    selected = (event) => {
        this.props.onContactClick(event.currentTarget.dataset.tag)
    }
    handelKeyPress = (e) => { 
        switch (e.keyCode) {
            case 46:
                this.props.onContactDelete(e.currentTarget.dataset.tag)
                break;
            default:
            //Do nothing
        }
    }
    render() {
        const contact = this.props.contact
        let contactClassName = 'contact_row'
        if(this.props.contactSelected) {
            if(this.props.contactSelected === contact.contact_id) {
                contactClassName +=  ' contact_row_selected'
            }
        }
        return(
            <div className={contactClassName} 
                 onClick={this.selected} 
                 data-tag={contact.contact_id}
                 onKeyDown={this.handelKeyPress}
                 tabIndex={0} style={this.props.style} >
                <div>
                    <div style={{float: 'left', whiteSpace: 'nowrap' }}><b>{contact.fullname}</b></div>
                    {contact.msg_count > 0 ?
                        <div style={{float: 'right'}} className='contact_row_msg_count_oval'>{contact.msg_count}</div>
                        : null}
                </div>
                {/*<span style={{display: 'inline-block', width: '150px'}}>{contact.mobile_no}</span> */}
                <div  style={{clear: 'both'}} >{contact.mobile_no}</div>
            </div>
        )
    }
}