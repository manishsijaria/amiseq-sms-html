
import React from 'react'
import ContactRow from './contactRow'

import {  InfiniteLoader, List } from 'react-virtualized'
import 'react-virtualized/styles.css'
import { FetchContactConstants } from '../../_constants'

export default class ContactTable  extends React.PureComponent {
    constructor(props) {
        super(props)
        this.listRef = React.createRef()
        this.InfiniteLoaderRef = React.createRef()
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

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.filterText !== this.props.filterText) {
            if(this.InfiniteLoaderRef) {
                this.InfiniteLoaderRef.resetLoadMoreRowsCache(true);
            }
        }  
    }
    selected = (contact) => {
        this.props.onContactClick(contact)
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
        const rowWidth = this.props.splitPaneSize //225;
        let splitPaneSize = this.props.splitPaneSize
        let NoContactMsg = (this.props.rowCount === 0) ? 
                                <div><span>No Contacts 
                                            {(this.props.filterText) ? ' matching ' + this.props.filterText : 'yet!' } 
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
