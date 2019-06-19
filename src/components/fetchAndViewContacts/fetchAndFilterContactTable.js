
import React from 'react'

//import { SelectContactType } from './selectContactType'
//import SelectUser from './selectUser'
import SearchContact from './searchContact'
import ContactTable from './contactTable'
import {connect} from 'react-redux'
import { contactActions } from '../../_actions'
import '../../css/contact.css'
import { FetchContactConstants, ContectSelectedConstants } from '../../_constants'
/*
FetchAndFilterContactTable --- this.state = { contact_type: 'All', user: 'My_List', filterText: ''}
	SelectContactType
	SelectUser
	SearchContact
	ContactTable
		ContactRow

*/

/*
const fetchedContacts = 
[
	{contact_id: 1, fullname: 'Rahul Dubey', mobile_no: '+1453245423', contact_type_id: 1, user_id: 1, msg_count: 2}, 
    {contact_id: 2, fullname: 'Raja Jani', mobile_no: '+1564736252', contact_type_id: 1, user_id: 1, msg_count: 0},
    {contact_id: 3, fullname: 'Mehul Choukse', mobile_no: '+1894736365', contact_type_id: 1, user_id: 1, msg_count: 4},
    {contact_id: 4, fullname: 'Nerav Modi', mobile_no: '+19847674885', contact_type_id: 1, user_id: 1, msg_count: 25},
    {contact_id: 5, fullname: 'Vijay Malya', mobile_no: '+17564557584', contact_type_id: 1, user_id: 1, msg_count: 24},
    {contact_id: 6, fullname: 'Ankit Roy', mobile_no: '+15673636366', contact_type_id: 1, user_id: 1, msg_count: 5},
    {contact_id: 7, fullname: 'Garv Gangawala', mobile_no: '+1453245423', contact_type_id: 1, user_id: 1, msg_count: 2}, 
    {contact_id: 8, fullname: 'Rahul Roy', mobile_no: '+1564736252', contact_type_id: 1, user_id: 1, msg_count: 3},
    {contact_id: 9, fullname: 'Shailesh Joshi', mobile_no: '+1894736365', contact_type_id: 1, user_id: 1, msg_count: 4},
    {contact_id: 10, fullname: 'Nirman Datta', mobile_no: '+19847674885', contact_type_id: 1, user_id: 1, msg_count: 25},
    {contact_id: 11, fullname: 'Sonum Mathur', mobile_no: '+17564557584', contact_type_id: 1, user_id: 1, msg_count: 24},
    {contact_id: 12, fullname: 'U anup', mobile_no: '+15673636366', contact_type_id: 1, user_id: 1, msg_count: 5},

];
*/

export default class FetchAndFilterContactTable  extends React.Component {
    constructor(props) {
        super(props)
        this.state = { filterText: '', orderChanged: false}
        this.contactTableRef = React.createRef()            //KB: ref of contactTable, so that the infiniteLoader can be reset.

        //KB: Event from SocketIO.Client is received twice(for a event), one in mounted state, and other in unmounted state.
        //    hence incrementing the msgCount twice in componentDidMount method.
        //    Therefore this._isMounted variable is added to track whether the component is Mounted or not.
        //    Than dispatch the event to increment msgCount.
        //https://www.robinwieruch.de/react-warning-cant-call-setstate-on-an-unmounted-component/
        this._isMounted = false        
    }

    componentWillMount() {
        const { dispatch } = this.props
        dispatch(contactActions.getContactsCount(''))
    }

    componentDidMount() {
        this._isMounted = true //Set it to true if the component is mounted.
    }
    
    componentWillUnmount() {
        this._isMounted = false //Set it to false, if component is unmounted.
    }

    componentDidUpdate(prevProps, prevState) {
        if(!this.props.isFetchingContactsCount) {
            if(prevProps.contactsCount !== this.props.contactsCount 
                || prevState.filterText !== this.state.filterText
                || prevState.orderChanged !== this.state.orderChanged) 
                {
                //KB: reset the InfiniteLoader since the contactCount or filterText changed 
                if(this.contactTableRef) {
                    this.contactTableRef.resetLoadMoreRows()
                }
                //Now fetch the first chunk of contact rows.
                this.fetchRowsOnCountChange(this.props.contactsCount)
            }  
        }
    }

    fetchRowsOnCountChange = (RowCount) => {
        //alert("prevProps.count=" + prevProps.count + " this.props.count=" + this.props.count)
        //this.setState({ rowCount: this.props.count})
        if(RowCount > FetchContactConstants.MINIMUM_BATCH_SIZE) {
            this.fetchMoreRows({startIndex: FetchContactConstants.MINIMUM_START_INDEX, 
                                stopIndex: FetchContactConstants.MINIMUM_BATCH_SIZE})
        }
        else {
            this.fetchMoreRows({startIndex: FetchContactConstants.MINIMUM_START_INDEX, 
                                stopIndex: RowCount -1 })
        }
    }

    /*
    Offset: It is used to specify the offset of the first row to be returned.
		if offset=100 and the first row=1 than select would return 101st record.
    Count:It is used to specify the maximum number of rows to be returned.
    SELECT *
    FROM contact
    LIMIT Offset, Count;
    */
    fetchMoreRows = ({startIndex, stopIndex}) => {
        const { dispatch } = this.props
        dispatch(contactActions.getContacts(startIndex,stopIndex - startIndex + 1 , this.state.filterText))
    }

    handelFilterTextChange = (filterText) => {
        if(this._isMounted) { //If mounted than fire and change state.
            //KB: First dispatch the {contactsCount =0, isFetchingContactsCount = true}
            //    conponentDidUpdate is fired just after dispatch, where isFetchingContactsCount is checked.
            const { dispatch } = this.props
            dispatch(contactActions.getContactsCount(filterText))
            
            //Now set the state, otherwise !isFetchingContactsCount, will not work in componentDidUpdate. 
            this.setState({
                filterText: filterText
            })
        }
    }

    handelOrderChange = () => {
        if(this._isMounted) { //If mounted than fire and change state.
            //KB: First dispatch the {contactsCount =0, isFetchingContactsCount = true}
            //    conponentDidUpdate is fired just after dispatch, where isFetchingContactsCount is checked.
            const { dispatch } = this.props
            dispatch(contactActions.getContactsCount(this.state.filterText))

            //Now set the state, otherwise !isFetchingContactsCount, will not work in componentDidUpdate. 
            this.setState(prevState => ({
                orderChanged: !prevState.orderChanged
            }))
        }
    }

    selected = (contact_id, fullname, contact_create_date, added_by_username) => {
        this.props.onContactClick(contact_id, fullname, contact_create_date, added_by_username)
    }

    deleteContact = (contact_id) => {
        const { dispatch } = this.props
        dispatch(contactActions.deleteContact(parseInt(contact_id,10)))
        //-1 will not be any contact_id, the viewNSendSms will be blank.
        this.props.onContactClick(ContectSelectedConstants.DEFAULT_CONTACT) 
    }

    render() {
        const { filterText } = this.state
        const { contacts, contactsCount } = this.props
        return(
                <div className='content' style={{ width: this.props.leftSplitPaneWidth }}>
                    {/*
                   <SelectContactType/>
                   <SelectUser/>
                   */}
                   <SearchContact   filterText={filterText} 
                                    onSearchContactFilterChange={this.handelFilterTextChange}
                                    leftSplitPaneWidth={this.props.leftSplitPaneWidth}
                    />
                   <ContactTable contacts={contacts} 
                                filterText={filterText}
                                ref={(ref) => this.contactTableRef = ref}
                                onOrderChange={this.handelOrderChange}
                                orderChanged={this.state.orderChanged}

                                contactSelected={this.props.contactSelected}
                                onContactClick={this.selected}
                                onContactDelete={this.deleteContact}
                                heightInPx={this.props.heightInPx}
                                leftSplitPaneWidth={this.props.leftSplitPaneWidth}

                                loadMoreRows={this.fetchMoreRows}
                                rowCount={contactsCount}
                    />
                </div> 
        )
    }
}

function mapStateToProps(state) {
    const { user } = state.authentication
    const { contacts } = state.contactsGet
    const  {contactsCount , isFetchingContactsCount}  = state.contactsCount
    return { user, contacts, contactsCount , isFetchingContactsCount }
}

const connectedFetchAndFilterContactTable = connect(mapStateToProps)(FetchAndFilterContactTable)

export { connectedFetchAndFilterContactTable as FetchAndFilterContactTable}