
import React from 'react'
import debounce from 'lodash.debounce';
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

class SearchContact  extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: ''
        }
        // Delay action 2 seconds
        this.onChangeDebounced = debounce(this.onChangeDebounced, 1000)
    }

    handelAdd = (event) => {
        const { dispatch } = this.props
        event.preventDefault()
        dispatch(push('/addcontact'))
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
        let addButtonWidth = 50
        let rightSpace = 40
        return(
                <div className='searchContact' style={{ width: `${leftSplitPaneWidth}px`}}>
                    <form name="form" className='searchContactForm'>
                        <input type="text" name="name" 
                            value = {this.state.name} 
                            onChange={this.handelChange} 
                            placeholder="Search contact..."
                            style={{ width: `${leftSplitPaneWidth - rightSpace - addButtonWidth}px`}}
                        />
                        <button
                            onClick={this.handelAdd} 
                            style={{ position: 'relative', 
                                     top: '5px', left: '7px', 
                                     color: 'blue' }}
                        >
                            <i className="fas fa-plus fa-2x"></i>
                        </button>
                    </form>                    
                </div> 
        )
    }
}


const connectedSearchContact = connect()(SearchContact)

export {connectedSearchContact as SearchContact}