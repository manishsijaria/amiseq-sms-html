
import React from 'react'
//import '../../css/contact.css'

export default class SearchBar  extends React.Component {

    handelChange = (event) => {
        const {  value } = event.target
        //this.setState({ [name] : value})
        this.props.onSearchTextChange(value)
    }
    render() {
        let rightSplitPaneWidth = this.props.rightSplitPaneWidth
        return(
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{ marginLeft: '10px', marginTop: '15px', 
                              width: `${rightSplitPaneWidth/2}px`}}>
                    {this.props.contactFullname ? 
                        <span> <b>{this.props.contactFullname}</b> added by {this.props.addedByUsername} on {this.props.contactCreateDate} </span>
                        : ''}
                </div>
                <div  style={{ width: `${rightSplitPaneWidth/2}px`}}>
                    <form name="form" className='searchContactForm'>
                        <input type="text" name="name" 
                            value = {this.props.filterText} 
                            onChange={this.handelChange} 
                            placeholder="Search sms text..."
                            style={{ width: `${rightSplitPaneWidth/2 - 50}px`}}
                        />
                    </form>
                </div> 
            </div>
        )
    }
}