
import React from 'react'

import MsgRow from './msgRow'
import {  InfiniteLoader, List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized'
import { FetchMsgsConstants } from '../../_constants'

export default class MsgsTable extends React.PureComponent {
    constructor(props) {
        super(props)
        this.listRef = React.createRef()
        this.InfiniteLoaderRef = React.createRef()


        //Since the width of the rows doesn’t need to be calculated, the fixedWidth property is set to true
        this._cache = new CellMeasurerCache({
                                fixedWidth: true,
                                minHeight: 50,
                            });
    }

    componentDidUpdate(prevProps, prevState) {
        //this._cache.clearAll();

        if(prevProps.msgs.length !== this.props.msgs.length) {
            if (this.listRef) {
                this._cache.clearAll();
                //alert(typeof(this.listRef))
                this.listRef.recomputeRowHeights(0);
            }
        }
    }

    isRowLoaded = ({index}) => {
        return !!this.props.msgs[index]
    }

    rowRenderer = ({ key, index, parent, style, isScrolling, isVisible }) => {

        //alert('index:' + index)
        //let widthEightyPercent =  {mywidth: { width: '90%'}}
        return (
            <CellMeasurer
                cache={this._cache}
                columnIndex={0}
                key={key}
                rowIndex={index}
                parent={parent}> {/* CellMeasurer takes the parent component (List) where it’s going to be rendered */}            
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
            </CellMeasurer>
        )        
    }

    _onScroll = ({clientHeight,scrollHeight,scrollTop}) => {
        if(scrollTop !== 0) {
            //alert(scrollTop)
        }
    }
    render() {
        const { msgs } = this.props
        let fetchedRowCount = (msgs) ? msgs.length : 0
        let listHeight = this.props.heightInPx
        const rowHeight = 60; //50;
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
               contactFullname={contactFullname}
                />
            )
        })
        */
        return(
            <div className="frame" style={{  height: this.props.heightInPx , 
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
                                    <AutoSizer> 
                                        {/* The AutoSizer component will fill all of the available space of its parent*/}
                                        { ({ width, height }) => {
                                                return <List
                                                    ref={(list) => { 
                                                                this.listRef = list
                                                                registerChild(list)
                                                        }}
                                                    onRowsRendered={onRowsRendered}
                                                    rowRenderer={this.rowRenderer}
                                                    width={width}
                                                    height={height}
                                                    rowCount={fetchedRowCount}
                                                    onScroll={this._onScroll}
                                                    
                                                    deferredMeasurementCache={this._cache}
                                                    rowHeight={rowHeight} //{this._cache.rowHeight}

                                                    searchText={this.props.searchText}
                                                    contactFullname={this.props.contactFullname}

                                                    >
                                                    {/* when the searchText prop changes the list is rerendered, and highlighted by css */ }
                                                </List>
                                            }
                                        }
                                    </AutoSizer>
                                )}
                            </InfiniteLoader>  
                        }                      
                    </ul> 
            </div>
        )
    }
}
