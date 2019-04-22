import React from 'react'
import '../../css/simpleChat.css'
import  { ServerConstants } from '../../_constants'

//https://stackoverflow.com/questions/55765999/applying-style-of-rowrenderer-the-flickering-is-gone-but-the-rowheight-calcula
export default class MsgRow  extends React.Component {
    render() {
        let row
        let widthEightyPercent =  {mywidth: { width: '90%'}}
   
        const { msg, searchText, fullname  } = this.props
        if(!msg) { return null}
        
        var indexOfSearchText = msg.sms_text.toLowerCase().indexOf(searchText.toLowerCase())
        if(!searchText.length || (indexOfSearchText === -1)) {
            if(ServerConstants.TWILIO_AMISEQ_NO === msg.msg_from) {
                /* In top li of row-- Both className and style property works, not any of them */
                row = <li key={this.props.index} style={{...this.props.style, ...widthEightyPercent.mywidth}}> 
                                <div className="msj-rta macro" >
                                    <div className="text text-r" >
                                        <p>{msg.sms_text}</p>
                                        <p><small>Amiseq {msg.fullname} : {msg.message_date}</small></p>
                                    </div>
                                </div>
                        </li>
                //rows.push(<tr className='amiseq'> <td>{msg.message_date} </td> <td>{msg.sms_text} </td> </tr>)
            } else {
                    row = <li key={this.props.index} style={{...this.props.style, ...widthEightyPercent.mywidth}}>
                                <div className="msj macro">
                                    <div className="text text-l">
                                        <p> {msg.sms_text} </p>
                                        <p><small>{fullname} : {msg.message_date}</small></p>
                                    </div>
                                </div>
                            </li>
                //rows.push(<tr className='others'> <td>{msg.message_date} </td> <td>{msg.sms_text} </td> </tr>)
            }                
        } else {
            var leftText = msg.sms_text.slice(0,indexOfSearchText)
            var rightText = msg.sms_text.slice(indexOfSearchText + searchText.length, msg.sms_text.length)
            var highlightText = msg.sms_text.slice(indexOfSearchText , indexOfSearchText + searchText.length) 
            if(ServerConstants.TWILIO_AMISEQ_NO === msg.msg_from) {
                row = <li key={this.props.index} style={{...this.props.style, ...widthEightyPercent.mywidth}}>
                            <div className="msj-rta macro">
                                <div className="text text-r">
                                    <p>{leftText}<span className='highlight'>{highlightText}</span>{rightText}</p>
                                    <p><small>Amiseq {msg.fullname} : {msg.message_date}</small></p>
                                </div>
                            </div>
                        </li>
            } else {
                row = <li key={this.props.index} style={{...this.props.style, ...widthEightyPercent.mywidth}}>
                                <div className="msj macro">
                                    <div className="text text-l">
                                        <p> {leftText}<span className='highlight'>{highlightText}</span>{rightText}</p>
                                        <p><small>{fullname} : {msg.message_date}</small></p>
                                    </div>
                                </div>
                            </li>
            }
        }         
        return(
            <>
                {row}
            </>
        )
    }
}