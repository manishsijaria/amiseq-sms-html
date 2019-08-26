
import React from 'react'

import MsgRow from './msgRow'
import {  InfiniteLoader, List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized'
import { FetchMsgsConstants, ContectSelectedConstants } from '../../_constants'

export default class MsgsTable extends React.PureComponent {
    constructor(props) {
        super(props)
        this.listRef = React.createRef()
        this.InfiniteLoaderRef = React.createRef()

        //Since the width of the rows doesn’t need to be calculated, the fixedWidth property is set to true
        this._cache = new CellMeasurerCache({
                                fixedWidth: true,
                                defaultHeight: 70,
                            });
        this._measureCallbacks = [];
        this._mostRecentWidth = 0; 
        this._resizeAllFlag = false;
        this.rowHeight = 70; //50;
        this._registerList = null;

        this.state = { scroll_to_row: null}
    }

    componentDidUpdate(prevProps, prevState) {
        //NOTE: When the contactSelected changes than the row height is not recalculated, therefore added the || condition.
        //  if the contactSelected = -1 that means the this.listRef is not initialized, and gives runtime error recomputeRowHeights() is not defined.
        //  therefore a prior check prevProps.contactSelected !== ContectSelectedConstants.DEFAULT_CONTACT. 
        if (this._resizeAllFlag || (prevProps.contactSelected !== ContectSelectedConstants.DEFAULT_CONTACT &&
                                    (this.props.contactSelected !== ContectSelectedConstants.DEFAULT_CONTACT) &&
                                    prevProps.contactSelected !== this.props.contactSelected) ) {
            this._resizeAllFlag = false;
            this._cache.clearAll();
            if (this.listRef) {
              this.listRef.recomputeRowHeights();
            }
        }
        else if (prevProps.msgs.length !== this.props.msgs.length) {
            const index = prevProps.msgs.length
            this._cache.clear(index, 0);
            if (this.listRef) {
                this.listRef.recomputeRowHeights(index);
            }
        }

        /*
        //Scroll to Row
        this.setState({
            scroll_to_row:  this.props.msgs.length,
        })
        */            
    }

    _onScroll = ({clientHeight,scrollHeight,scrollTop}) => {
        
        if (this.state.scroll_to_row !== null && 
            scrollTop === this.row_height * this.scroll_to_row) {
            this.setState({scroll_to_row: null})
        }
        
    }

    isRowLoaded = ({index}) => {
        return  index < this.props.msgs.length; //!!this.props.msgs[index]
    }

    rowRenderer = ({ key, index, parent, style, isScrolling, isVisible }) => {

        //alert('index:' + index)
        return (
            <CellMeasurer
                cache={this._cache}
                columnIndex={0}
                key={key}
                rowIndex={index}
                parent={parent}
                width={this._mostRecentWidth}
                >  
                {({ measure }) =>  (          
                <div key={index} style={style} onLoad={measure}> 
                    <MsgRow 
                        key={key} 
                        index={index}
                        style={style}
                        isScrolling={isScrolling}
                        isVisible={isVisible}
                        
                        msg={this.props.msgs[index]}
                        searchText={this.props.searchText}
                        contactFullname={this.props.contactFullname}
                    >
                    </MsgRow>    
                </div>
                )}
            </CellMeasurer>
            )        
    }

    _resizeAll = () => {
        this._resizeAllFlag = false;
        this._cache.clearAll();
        if (this.listRef) {
          this.listRef.recomputeRowHeights();
        }
    };

    _setListRef = ref => {
        this.listRef = ref;
        this._registerList(ref);
    };

    render() {
        const { msgs } = this.props
        let fetchedRowCount = (msgs) ? msgs.length : 0

        let NoMsgsMsg = (this.props.rowCount === undefined || this.props.rowCount === 0) ? 
                                <div><span>No Messages !                               
                                     </span>
                                </div> : ''

        return(
                    <div className="infiniteLoaderDiv" > 
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
                                    <AutoSizer> 
                                        {/* The AutoSizer component will fill all of the available space of its parent*/}
                                        { ({ width, height }) => {
                                                if(this._mostRecentWidth && this._mostRecentWidth !== width) {
                                                    this._resizeAllFlag = true;
                                                    setTimeout(this._resizeAll, 0);
                                                }
                                                this._mostRecentWidth = width;
                                                this._registerList = registerChild;

                                                return <List
                                                    ref={this._setListRef}
                                                    onRowsRendered={onRowsRendered}
                                                    rowRenderer={this.rowRenderer}
                                                    width={width}
                                                    height={height}
                                                    rowCount={fetchedRowCount}
                                                    //onScroll={this._onScroll}
                                                    
                                                    deferredMeasurementCache={this._cache}
                                                    rowHeight= {this._cache.rowHeight}    // {this.rowHeight}
                                                    //scrollToRow={this.state.scroll_to_row}

                                                    searchText={this.props.searchText}
                                                    contactFullname={this.props.contactFullname}
                                                    style={{ paddingBottom: '10px'}}    //space at the bottom of the list.
                                                    >
                                                    {/* when the searchText prop changes the list is rerendered, and highlighted by css */ }
                                                </List>
                                            }
                                        }
                                    </AutoSizer>
                                )}
                            </InfiniteLoader>  
                        }                      
                    </div> 
        )
    }
}
