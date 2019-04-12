
import React from 'react'


export default class SearchContact  extends React.Component {

    handelChange = (event) => {
        const {  value } = event.target
        //this.setState({ [name] : value})
        this.props.onSearchContactFilterChange(value)
    }
    render() {
        let leftSplitPaneWidth = this.props.leftSplitPaneWidth
        return(
                <div className='searchContact' style={{ width: `${leftSplitPaneWidth}px`}}>
                    <form name="form" className='searchContactForm'>
                        <input type="text" name="name" 
                            value = {this.props.filterText} 
                            onChange={this.handelChange} 
                            placeholder="Search contact..."
                            style={{ width: `${leftSplitPaneWidth - 40}px`}}
                        />
                    </form>
                </div> 
        )
    }
}