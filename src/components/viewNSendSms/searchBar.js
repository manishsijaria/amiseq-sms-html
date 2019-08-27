
import React from 'react'
//import '../../css/contact.css'

export default class SearchBar  extends React.Component {

    handelChange = (event) => {
        const {  value } = event.target
        this.props.onSearchTextChange(value)
        //this.setState({ [name] : value})
    }

    render() {
        let rightSplitPaneWidth = this.props.rightSplitPaneWidth
        return(
            <div style={{display: 'flex', flexDirection: 'row',marginTop: '10px'}}>
                <div style={{ marginLeft: '10px',  marginTop: '5px',
                              width: `${rightSplitPaneWidth/2}px`}}>
                    {this.props.contactFullname ? 
                        <span> <b>{this.props.contactFullname}</b> added by {this.props.addedByUsername} on {this.props.contactCreateDate} </span>
                        : ''}
                </div>
                <div  style={{  width: `${rightSplitPaneWidth/2}px`}}>
                    <input type="text" name="searchText" 
                        value = {this.props.filterText} 
                        onChange={this.handelChange} 
                        placeholder="Search sms text..."
                        style={{ width: `${rightSplitPaneWidth/2 - 50}px`}}
                    />
                </div> 
            </div>
        )
    }
}