
import React from 'react'
import '../../css/contact.css'

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

export default class ContactRow  extends React.Component {
    selected = (event) => {
        this.props.onContactClick(event.currentTarget.dataset.id, 
                                  event.currentTarget.dataset.fullname,
                                  event.currentTarget.dataset.contact_create_date,
                                  event.currentTarget.dataset.added_by_username)
    }
    handelKeyPress = (e) => { 
        switch (e.keyCode) {
            case 46:
                this.props.onContactDelete(e.currentTarget.dataset.id )
                break;
            default:
            //Do nothing
        }
    }
    dateDiffInDays = (current_date, msg_date) => {
        const utc1 = Date.UTC(msg_date.getFullYear(), msg_date.getMonth(), msg_date.getDate());
        const utc2 = Date.UTC(current_date.getFullYear(), current_date.getMonth(), current_date.getDate());
      
        return Math.floor((utc2 - utc1) / _MS_PER_DAY);        
    }
    convert24HoursTo12Hours = (hours, min) => {
        //var hourEnd = timeString.indexOf(":");
        let H = hours //+timeString.substr(0, hourEnd);
        let h = H % 12 || 12;
        let ampm = (H < 12 || H === 24) ? "am" : "pm";
        let timeString = h + ':' + min + ' ' + ampm;
        return timeString;
    }
    render() {
        const contact = this.props.contact
        let contactClassName = 'contact_row'
        if(this.props.contactSelected) {
            if(this.props.contactSelected === contact.contact_id) {
                contactClassName +=  ' contact_row_selected'
            }
        }
        let dateToDisplay;
        if(contact.msg_date) {
            let date_parts_td = contact.todays_date.split('-')
            let todays_date = new Date(date_parts_td[0],               //year
                                       date_parts_td[1] ,              //month
                                       date_parts_td[2].substr(0,2),   //day
                                       date_parts_td[2].substr(3, 2),  //hour
                                       date_parts_td[2].substr(6, 2),  //min
                                       date_parts_td[2].substr(9, 2)   //sec
                                       );
            let date_parts_msg_date = contact.msg_date.split('-')
            let message_date = new Date(date_parts_msg_date[0],               //year
                                        date_parts_msg_date[1] ,              //month
                                        date_parts_msg_date[2].substr(0,2),   //day
                                        date_parts_msg_date[2].substr(3, 2),  //hour
                                        date_parts_msg_date[2].substr(6, 2),  //min
                                        date_parts_msg_date[2].substr(9, 2)   //sec
                                        );
            let days = this.dateDiffInDays(todays_date,message_date)
            //alert(days)
            switch (days) {
                case 0: //today
                    dateToDisplay = this.convert24HoursTo12Hours(date_parts_msg_date[2].substr(3, 2),date_parts_msg_date[2].substr(6, 2))
                    break;
                case 1: //yesterday
                    dateToDisplay = 'Yesterday' 
                    break;
                default://other date
                    dateToDisplay = (date_parts_msg_date[1]) + '/' + date_parts_msg_date[2].substr(0,2) + '/' + date_parts_msg_date[0]
            }
        }
        return(
            <div className={contactClassName} 
                 onClick={this.selected} 

                 data-id={contact.contact_id}
                 data-fullname={contact.fullname}
                 data-contact_create_date={contact.contact_create_date}
                 data-added_by_username={contact.added_by_username}
                 
                 onKeyDown={this.handelKeyPress}
                 tabIndex={0} style={this.props.style} >
                <div style={{ paddingTop: '3px'}} >
                    <div style={{float: 'left', whiteSpace: 'nowrap' }}>
                        <b>{contact.fullname}</b>
                    </div>
                    {dateToDisplay ? 
                    <div style={{float: 'right'}} className='contact_row_msg'>
                            <small>{dateToDisplay}</small>                   
                            
                    </div> : null }
                </div>
                {/*<span style={{display: 'inline-block', width: '150px'}}>{contact.mobile_no}</span> */}
                <div  style={{clear: 'both',float: 'left'}}>
                    {contact.mobile_no}
                </div>
                {contact.msg_count > 0 ?
                <div style={{float: 'right'}} className='contact_row_msg_count_oval'>
                    <small>{contact.msg_count}</small>
                </div>
                : null}                
            </div>
        )
    }
}