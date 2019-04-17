
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
        const { msgs, fullname } = this.props
        const { searchText } = this.state
        let heightOfmsgTable = this.props.heightInPx - 60
        return(
            <>
                <SearchBar searchText={searchText} 
                           fullname={fullname}
                           onSearchTextChange={this.handelSearchTextChange}
                           rightSplitPaneWidth={this.props.rightSplitPaneWidth}
                           />
                <MsgsTable msgs={msgs} 
                            searchText={searchText} 
                            fullname={fullname}
                            heightInPx={heightOfmsgTable}
                            rightSplitPaneWidth={this.props.rightSplitPaneWidth}

                            loadMoreRows={this.props.loadMoreRows}
                            rowCount={this.props.rowCount}

                />
            </>
        )
    }
}