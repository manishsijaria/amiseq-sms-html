
import React from 'react'
import debounce from 'lodash.debounce';

export default class SearchContact  extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: ''
        }
        // Delay action 2 seconds
        this.onChangeDebounced = debounce(this.onChangeDebounced, 1000)
    }

    handelChange = (event) => {
        const {  value } = event.target
        // Immediately update the state
        this.setState({ name : value})
        //ABSOLUTE CODE : this.props.onSearchContactFilterChange(value)
        // Execute the debounced onChange method
        this.onChangeDebounced(event)        
    }

    onChangeDebounced = (e) => {
        // Delayed logic goes here
         //alert(this.state.value)
         this.props.onSearchContactFilterChange(this.state.name)
    }

    render() {
        let leftSplitPaneWidth = this.props.leftSplitPaneWidth
        return(
                <div className='searchContact' style={{ width: `${leftSplitPaneWidth}px`}}>
                    <form name="form" className='searchContactForm'>
                        <input type="text" name="name" 
                            value = {this.state.name} 
                            onChange={this.handelChange} 
                            placeholder="Search contact..."
                            style={{ width: `${leftSplitPaneWidth - 40}px`}}
                        />
                    </form>
                </div> 
        )
    }
}