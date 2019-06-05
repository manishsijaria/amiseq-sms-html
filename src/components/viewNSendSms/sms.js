
import React  from 'react'
import { connect } from 'react-redux'
import { userActions } from '../../_actions'
import  { ServerConstants, ContectSelectedConstants } from '../../_constants'

class Sms extends React.Component {
    constructor(props) {
        super(props)
        this.state = { smsText: ''  }
    }
    handelChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name] : value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
                
        if(this.state.smsText === '') { return  }
        this.sendSms()
    }

    sendSms = () => {
        const {dispatch, contactSelected , user } = this.props
        const { smsText } = this.state

        let Arr = [contactSelected]

        //alert('user id:' + user.user_id)
        dispatch(userActions.smsSend(user.user_id, smsText, Arr,false) )

        this.setState({smsText: ''})        
    }

    render() {
        const { smsText } = this.state
        let { rightSplitPaneWidth, heightOfSmsComp, contactSelected } = this.props
        heightOfSmsComp = heightOfSmsComp - 25
        let marginLeftOfSubmit = 10;
        rightSplitPaneWidth = rightSplitPaneWidth - (2 * marginLeftOfSubmit)
        let widthOfSubmit = 150;
        
        return(
            <form name="form" style={{display: 'flex', 
                                      flexDirection: 'row', 
                                      width: `${rightSplitPaneWidth}px`,
                                      marginLeft: '8px'
                                      }} 
                              onSubmit={this.handleSubmit} 
            >
                <textarea  name="smsText" 
                    value = {smsText}
                    onChange={this.handelChange} 
                    placeholder="Please enter the message to send..."
                    style={{ width: `${rightSplitPaneWidth }px`, 
                             height: `${heightOfSmsComp}px`,
                             }}
                    maxlength={ServerConstants.TWILIO_MSG_LENGTH}
                    spellcheck={true}
                    disabled = {(ContectSelectedConstants.DEFAULT_CONTACT === contactSelected) ? 'disabled' : ''}
                />
                <input type="submit" value="Send SMS" 
                        style={{ marginLeft: `${marginLeftOfSubmit}px`, 
                                 width: `${widthOfSubmit - marginLeftOfSubmit}px`, 
                                 height: `48px`}}
                        disabled = {(ContectSelectedConstants.DEFAULT_CONTACT === contactSelected) ? true : false}
                >
                </input>
            </form>
        )
    }
}

function mapStateToProps(state) {
    const { user } = state.authentication
    return { user }
}

const connectedSms = connect(mapStateToProps)(Sms)

export {connectedSms as Sms}