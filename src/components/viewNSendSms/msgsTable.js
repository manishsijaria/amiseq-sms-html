
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
                                defaultHeight: 70,
                            });

        this.state = { scroll_to_row: null}
        this.rowHeight = 70; //50;
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.msgs.length !== this.props.msgs.length) {
            /*
            if (this.listRef) {
                this._cache.clearAll();
                this.listRef.recomputeRowHeights(0);
            }
            */
           this.setState({
                scroll_to_row:  this.props.msgs.length - 1,
            })
        }
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
        //let widthEightyPercent =  {mywidth: { width: '90%'}}
        return (
            <CellMeasurer
                cache={this._cache}
                columnIndex={0}
                key={key}
                rowIndex={index}
                parent={parent}
                > {/* CellMeasurer takes the parent component (List) where it’s going to be rendered */}            
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

    render() {
        const { msgs , heightInPx, rightSplitPaneWidth  } = this.props
        let fetchedRowCount = (msgs) ? msgs.length : 0

        let NoMsgsMsg = (this.props.rowCount === undefined || this.props.rowCount === 0) ? 
                                <div><span>No Messages !                               
                                     </span>
                                </div> : ''

        return(
            <div className="frame" style={{  height: heightInPx , 
                                             width: rightSplitPaneWidth, 
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
                                                    rowHeight={this.rowHeight} //{this._cache.rowHeight}
                                                    scrollToRow={this.state.scroll_to_row}

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
