
import React  from 'react'
import { connect } from 'react-redux'
import { userActions } from '../../_actions'
import  { ServerConstants, ContectSelectedConstants } from '../../_constants'

class Sms extends React.Component {
    constructor(props) {
        super(props)
        this.state = { smsText: '', smsCount: 0  }
    }
    handelChange = (event) => {
        const { name, value } = event.target
        let smsText = value.slice(0, ServerConstants.OUR_TWILIO_MSG_LENGTH)
        this.setState({
            [name] : smsText ,
            smsCount: Math.ceil(smsText.length / ServerConstants.TWILIO_MSG_LENGTH)
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
        heightOfSmsComp = heightOfSmsComp - 28 //Note: otherwise horiz/vertical scrollbar appear on big screen.
        let margin = 10;
        rightSplitPaneWidth = rightSplitPaneWidth - (2 * margin)
        let widthOfSubmit = 100;
        
        return(
            <form name="form" style={{display: 'flex', 
                                      flexDirection: 'row', 
                                      width: `${rightSplitPaneWidth}px`,
                                      marginLeft: `${margin}px`
                                      }} 
                              onSubmit={this.handleSubmit} 
            >
                {/* NOTE: maxLength property do not work in textarea, or browser */}
                <textarea  name="smsText" 
                    value = {smsText}
                    onChange={this.handelChange} 
                    placeholder="Please enter the message to send..."
                    style={{ width: `${rightSplitPaneWidth - widthOfSubmit - margin}px`, 
                             height: `${heightOfSmsComp}px`,
                             }}
                    spellCheck={true}
                    disabled = {(ContectSelectedConstants.DEFAULT_CONTACT === contactSelected) ? 'disabled' : ''}
                />
                <div style={{display: 'flex', 
                                      flexDirection: 'column', 
                                      width: `${widthOfSubmit}px`,
                                      marginLeft: `${margin}px`
                                      }}>
                    <label style={{ width: `${widthOfSubmit}px`, 
                                    fontSize: `10px`,
                                    textAlign: 'center',
                                    height: `10px`,
                                    marginBottom: `3px`}}>
                                    {this.state.smsCount} SMS
                    </label>
                    
                    <button onClick={this.handleSubmit}
                            style={{ 
                                    width: `${widthOfSubmit }px`, 
                                    height: `35px`,
                                    color: `blue`}}
                            disabled = {(ContectSelectedConstants.DEFAULT_CONTACT === contactSelected) ? true : false}
                    >
                        <i className="fa fa-paper-plane-o fa-2x" aria-hidden="true"></i> 
                        {/* <i className="fas fa-angle-double-right fa-3x"></i> */}
                        
                    </button> 
                </div>
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