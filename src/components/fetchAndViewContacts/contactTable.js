
import React from 'react'
import ContactRow from './contactRow'

import { AutoSizer, InfiniteLoader, List, WindowScroller } from 'react-virtualized'
import 'react-virtualized/styles.css'
import { FetchContactConstants } from '../../_constants'

export default class ContactTable  extends React.PureComponent {
    constructor(props) {
        super(props)
        this.listRef = React.createRef()
    }
    isRowLoaded = ({index}) => {
        return !!this.props.contacts[index]
    }
    rowRenderer = ({ key, index, style, isScrolling, isVisible }) => {
        return (
            <ContactRow 
                key={key} 
                index={index}
                style={style}
                isScrolling={isScrolling}
                isVisible={isVisible}
                
                contact={this.props.contacts[index]}
                contactSelected={this.props.contactSelected}
                onContactClick={this.selected}
                onContactDelete={this.deleteContact}>
            </ContactRow>    
        )
    }
    selected = (contact) => {
        this.props.onContactClick(contact)
    }
    deleteContact = (contact_id) => {
        this.props.onContactDelete(contact_id)
    }
    render() {
        const contacts = this.props.contacts
        let  tagContactRows = []
        const {  filterText  } = this.props
        
        //if(!(contacts && contacts.length > 0)) {
 
        let fetchedRowCount= (this.props.contacts) ? this.props.contacts.length : 0 
        let heightOfSearchContact = 60 + 3
        let listHeight
        if(!this.props.heightInPx) {
            listHeight = 528 - heightOfSearchContact
        } else {
            listHeight = this.props.heightInPx - heightOfSearchContact
        }
        const rowHeight = 42;
        const rowWidth = this.props.splitPaneSize //225;
        let splitPaneSize = this.props.splitPaneSize
        return(
            <div className='contentTable' style={{ width: `${splitPaneSize}px`}}>
                {(this.props.rowCount === 0) ? <div><span>No Contacts yet!</span></div> : 
                <InfiniteLoader isRowLoaded={this.isRowLoaded}
                                loadMoreRows={this.props.loadMoreRows}
                                rowCount={this.props.rowCount}
                                minimumBatchSize={FetchContactConstants.MINIMUM_BATCH_SIZE}>
                    {({ onRowsRendered, registerChild}) => (
                        <List
                            ref={(list) => { 
                                        this.listRef = list
                                        registerChild(list)
                                }}
                            onRowsRendered={onRowsRendered}
                            rowRenderer={this.rowRenderer}
                            width={rowWidth}
                            height={listHeight}
                            rowHeight={rowHeight}
                            rowCount={fetchedRowCount}
                            
                            contactSelected={this.props.contactSelected} 
                            >
                            {/* when the contactSelected prop changes the list is rerendered, and highlighted by css */ }
                        </List>
                    )}
                </InfiniteLoader>
                }
            </div>
        )
    }
}

/*

else { 
            contacts.forEach(contact => {
                if(filterText && contact.fullname.toLowerCase().indexOf(filterText.toLowerCase()) === -1) { 
                    return 
                } else {
                    tagContactRows.push(<ContactRow 
                                            key={contact.contact_id} 
                                            contact={contact}
                                            contactSelected={this.props.contactSelected}
                                            onContactClick={this.selected}
                                            onContactDelete={this.deleteContact}>
                                        </ContactRow>);
                }

            });
        }
*/