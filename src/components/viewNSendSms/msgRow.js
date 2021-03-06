import React from 'react'
import '../../css/simpleChat.css'
import  { ServerConstants } from '../../_constants'

//https://stackoverflow.com/questions/55765999/applying-style-of-rowrenderer-the-flickering-is-gone-but-the-rowheight-calcula
export default class MsgRow  extends React.Component {
    render() {
        let row
        let widthEightyPercent =  {mywidth: { width: '90%', padding: '3px'}}
   
        const { msg, searchText, contactFullname  } = this.props
        
        var indexOfSearchText = msg.sms_text.toLowerCase().indexOf(searchText.toLowerCase())
        if(!searchText.length || (indexOfSearchText === -1)) {
            if(ServerConstants.TWILIO_AMISEQ_NO === msg.msg_from) {
                /* In top li of row-- Both className and style property works, not any of them */
                row = <div key={this.props.index} style={{  ...widthEightyPercent.mywidth, ...widthEightyPercent.padding}}> 
                                <div className="msj-rta macro" >
                                    <div className="text text-r" >
                                        <p style={{whiteSpace:'pre-wrap'}}>{msg.sms_text}</p>
                                        <p><small>Amiseq {msg.fullname} : {msg.message_date.toLowerCase()}</small></p>
                                    </div>
                                </div>
                        </div>
                //rows.push(<tr className='amiseq'> <td>{msg.message_date} </td> <td>{msg.sms_text} </td> </tr>)
            } else {
                    row = <div key={this.props.index} style={{ ...widthEightyPercent.mywidth , ...widthEightyPercent.padding}}>
                                <div className="msj macro">
                                    <div className="text text-l">
                                        <p style={{whiteSpace:'pre-wrap'}}> {msg.sms_text} </p>
                                        <p><small>{contactFullname} : {msg.message_date.toLowerCase()}</small></p>
                                    </div>
                                </div>
                            </div>
                //rows.push(<tr className='others'> <td>{msg.message_date} </td> <td>{msg.sms_text} </td> </tr>)
            }                
        } else {
            var leftText = msg.sms_text.slice(0,indexOfSearchText)
            var rightText = msg.sms_text.slice(indexOfSearchText + searchText.length, msg.sms_text.length)
            var highlightText = msg.sms_text.slice(indexOfSearchText , indexOfSearchText + searchText.length) 
            if(ServerConstants.TWILIO_AMISEQ_NO === msg.msg_from) {
                row = <div key={this.props.index} style={{ ...widthEightyPercent.mywidth , ...widthEightyPercent.padding}}>
                            <div className="msj-rta macro">
                                <div className="text text-r">
                                    <p style={{whiteSpace:'pre-wrap'}}>{leftText}<span className='highlight'>{highlightText}</span>{rightText}</p>
                                    <p><small>Amiseq {msg.fullname} : {msg.message_date.toLowerCase()}</small></p>
                                </div>
                            </div>
                        </div>
            } else {
                row = <div key={this.props.index} style={{ ...widthEightyPercent.mywidth , ...widthEightyPercent.padding}}>
                                <div className="msj macro">
                                    <div className="text text-l">
                                        <p style={{whiteSpace:'pre-wrap'}}> {leftText}<span className='highlight'>{highlightText}</span>{rightText}</p>
                                        <p><small>{contactFullname} : {msg.message_date.toLowerCase()}</small></p>
                                    </div>
                                </div>
                            </div>
            }
        }         
        return(
            <>
                {row}
            </>
        )
    }
}