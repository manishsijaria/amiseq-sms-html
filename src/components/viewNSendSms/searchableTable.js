
import React from 'react'
import SearchBar from './searchBar'
import  MsgsTable from './msgsTable'

export default class SearchableTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = { searchText: ''}
    }
    handelSearchTextChange = (searchText) => {
        this.setState({
            searchText: searchText
        })
    }
   
    render() {
        const { msgs,contactSelected, contactFullname,contactCreateDate,addedByUsername } = this.props
        const { searchText } = this.state
        let heightOfmsgTable = this.props.heightInPx - 60
        return(
            <>
                <SearchBar searchText={searchText} 
                           contactFullname={contactFullname}
                           contactCreateDate={contactCreateDate}
                           addedByUsername={addedByUsername}
                           
                           onSearchTextChange={this.handelSearchTextChange}
                           rightSplitPaneWidth={this.props.rightSplitPaneWidth}
                           />
                <div className="frame" style={{  height: heightOfmsgTable , 
                                                width: this.props.rightSplitPaneWidth, 
                                                }}>
                    <MsgsTable msgs={msgs} 
                                contactSelected={contactSelected}
                                searchText={searchText} 
                                contactFullname={contactFullname}

                                loadMoreRows={this.props.loadMoreRows}
                                rowCount={this.props.rowCount}
                    />
                </div>
            </>
        )
    }
}