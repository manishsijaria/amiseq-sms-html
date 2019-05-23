
import React from 'react'
import ContactRow from './contactRow'

import {  InfiniteLoader, List } from 'react-virtualized'
import 'react-virtualized/styles.css'
import { FetchContactConstants } from '../../_constants'
import { incrementMsgsCount } from '../socketAPI/incrementMsgsCount'

export default class ContactTable  extends React.PureComponent {
    constructor(props) {
        super(props)
        this.listRef = React.createRef()
        this.InfiniteLoaderRef = React.createRef()
    }

    componentDidMount() {
        //const { dispatch } = this.props

        incrementMsgsCount( (err, data) => { 
            //alert('data.contact_id:' + data.contact_id + ' data.by:' + data.by) 
            //dispatch(contactActions.incrementMsgsCount(data.contact_id,data.by) ) 
            this.props.onOrderChange()           
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if( (prevProps.filterText !== this.props.filterText) ||
            (prevProps.orderChanged !== this.props.orderChanged) ) {
            if(this.InfiniteLoaderRef) {
                this.InfiniteLoaderRef.resetLoadMoreRowsCache(true);
            }
        }  
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


    selected = (contact_id, fullname, contact_create_date, added_by_username) => {
        this.props.onContactClick(contact_id, fullname, contact_create_date, added_by_username)
    }
    deleteContact = (contact_id) => {
        this.props.onContactDelete(contact_id)
    }
    render() {
        let fetchedRowCount= (this.props.contacts) ? this.props.contacts.length : 0 
        let heightOfSearchContact = 60 + 3
        let listHeight
        if(!this.props.heightInPx) {
            listHeight = 528 - heightOfSearchContact
        } else {
            listHeight = this.props.heightInPx - heightOfSearchContact
        }
        const rowHeight = 42;
        const rowWidth = this.props.leftSplitPaneWidth //225;
        let splitPaneSize = this.props.leftSplitPaneWidth
        let NoContactMsg = (this.props.rowCount === 0) ? 
                                <div><span>No Contacts 
                                            {(this.props.filterText) ? ' matching ' + this.props.filterText : ' yet!' } 
                                     </span>
                                </div> : ''
        return(
            <div className='contentTable' style={{ width: `${splitPaneSize}px`}}>
                { (NoContactMsg) ? NoContactMsg : 
                    <InfiniteLoader isRowLoaded={this.isRowLoaded}
                                    loadMoreRows={this.props.loadMoreRows}
                                    rowCount={this.props.rowCount}
                                    minimumBatchSize={FetchContactConstants.MINIMUM_BATCH_SIZE}
                                    ref={(infiniteloader) => {
                                        this.InfiniteLoaderRef = infiniteloader
                                    }}
                    >
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
