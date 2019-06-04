
import React  from 'react'
import { connect } from 'react-redux'
import { userActions } from '../../_actions'
import  { ServerConstants } from '../../_constants'

class Sms extends React.Component {
    constructor(props) {
        super(props)
        this.state = { smsText: '', submitted: false  }
    }
    handelChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name] : value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        this.setState({ submitted: true })
        
        if(this.state.smsText === '') { return  }
        this.sendSms()
    }

    sendSms = () => {
        const {dispatch, contactSelected , user } = this.props
        const { smsText } = this.state

        let Arr = [contactSelected]

        //alert('user id:' + user.user_id)
        dispatch(userActions.smsSend(user.user_id, smsText, Arr,false) )

        this.setState({smsText: '', submitted: false})        
    }

    render() {
        const { smsText, submitted } = this.state
        let { rightSplitPaneWidth, heightOfSmsComp } = this.props
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
                />
                <input type="submit" value="Send SMS" 
                        style={{ marginLeft: `${marginLeftOfSubmit}px`, 
                                 width: `${widthOfSubmit - marginLeftOfSubmit}px`, 
                                 height: `48px`}}>
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