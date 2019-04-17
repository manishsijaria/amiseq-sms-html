
import React from 'react'

import MsgRow from './msgRow'
import {  InfiniteLoader, List } from 'react-virtualized'
import { FetchMsgsConstants } from '../../_constants'

export default class MsgsTable extends React.PureComponent {
    constructor(props) {
        super(props)
        this.listRef = React.createRef()
        this.InfiniteLoaderRef = React.createRef()
    }
    isRowLoaded = ({index}) => {
        return !!this.props.msgs[index]
    }
    rowRenderer = ({ key, index, style, isScrolling, isVisible }) => {
        return (
            <MsgRow 
                key={key} 
                index={index}
                style={style}
                isScrolling={isScrolling}
                isVisible={isVisible}
                
                msg={this.props.msgs[index]}
                searchText={this.props.searchText}>
            </MsgRow>    
        )        
    }

    _onScroll = ({scrollTop}) => {
        if(scrollTop !== 0) {
            //alert(scrollTop)
        }
    }
    render() {
        const { msgs } = this.props
        let fetchedRowCount = (msgs) ? msgs.length : 0
        let listHeight = this.props.heightInPx
        const rowHeight = 50;
        const rowWidth = this.props.rightSplitPaneWidth
        let NoMsgsMsg = (this.props.rowCount === undefined || this.props.rowCount === 0) ? 
                                <div><span>No Messages !                               
                                     </span>
                                </div> : ''
        /*
        const rows = []
        msgs.forEach((msg) => {
            rows.push(<MsgRow
               msg={msg}
               searchText={searchText} 
               fullname={fullname}
                />
            )
        })
        */
        return(
            <div className="frame" style={{  height: this.props.heightInPx, 
                                            width: this.props.rightSplitPaneWidth, 
                                             }}>
                
                    <ul className="ulclass">
                        {(NoMsgsMsg) ? NoMsgsMsg : 
                            <InfiniteLoader isRowLoaded={this.isRowLoaded}
                                            loadMoreRows={this.props.loadMoreRows}
                                            rowCount={this.props.rowCount}
                                            minimumBatchSize={FetchMsgsConstants.MINIMUM_BATCH_SIZE}
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
                                        onScroll={this._onScroll}
                                        

                                        searchText={this.props.searchText}
                                        fullname={this.props.fullname}

                                        >
                                        {/* when the searchText prop changes the list is rerendered, and highlighted by css */ }
                                    </List>
                                )}
                            </InfiniteLoader>  
                        }                      
                    </ul>
                
            </div>
        )
    }
}
