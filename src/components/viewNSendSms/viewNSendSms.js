import React  from 'react'

import { contactActions } from '../../_actions'
import { connect } from 'react-redux'
import { FetchMsgsConstants } from '../../_constants'
import SplitPane from 'react-split-pane'
import { SplitPaneConstants, ContectSelectedConstants } from '../../_constants'

import  SearchableTable  from '../viewNSendSms/searchableTable'
import { Sms } from './sms'

const TIMER_INTERVAL = 20000
class ViewNSendSms extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { contactSelected: ContectSelectedConstants.DEFAULT_CONTACT, 
                        heightInPx: 0,
                        horizontal_top_split_pane_height: this.props.heightInPx - SplitPaneConstants.SEND_SMS_SIZE - SplitPaneConstants.RESIZER_OFFSET
                    };
        this.offset = [];
    }    
    /*
    componentWillMount() {
        this.setStateOnTimer()
        //The setInterval() method calls a function or evaluates an expression at specified intervals (in milliseconds).
        //The setInterval() method will continue calling the function until clearInterval() is called, or the window is closed.
        this.timerID = setInterval(() => this.setStateOnTimer(), 20000)
        //this.setStateOnTimer()
    }
    */
    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    componentDidUpdate(prevProps, prevState) {
        let newContactSelected = this.props.contactSelected
        if(prevProps.contactSelected !== newContactSelected) {
            const { dispatch } = this.props
            dispatch(contactActions.getMsgsCount(newContactSelected)) 
            
            clearInterval(this.timerID)
            this.timerID = setInterval(() => this.setStateOnTimer(), TIMER_INTERVAL)    
            
            
        }
        
       let newMsgCount = this.props.contactMsgsCountArray[newContactSelected]
       let prevMsgCount = prevProps.contactMsgsCountArray[newContactSelected]
       /*
        TODO: presently fetchRowsOnChange resets the contactsMsgs [] , and refetches from beginning.
              later incremental fetch can be implemented for the latest(few) rows added, and can be appended in reducer.
        */
        if(prevMsgCount !== newMsgCount) {
            //TODO: for incremental fetch the offset should not be [].
            //      it should be offset of the last fetch + count + 1 i think.
            this.offset = []
            this.fetchRowsOnChange(newContactSelected, newMsgCount)
        }
        //this.fetchMoreRows({ startIndex: this._loadMoreRowsStartIndex, stopIndex: this._loadMoreRowsStopIndex})
    }

    fetchRowsOnChange = (contact_id, RowCount) => {
        let count
        const { dispatch } = this.props        
        if(RowCount > FetchMsgsConstants.MINIMUM_BATCH_SIZE) {
            count = FetchMsgsConstants.MINIMUM_BATCH_SIZE - FetchMsgsConstants.MINIMUM_START_INDEX + 1
            this.offset[FetchMsgsConstants.MINIMUM_START_INDEX] = count

            dispatch(contactActions.getContactMsgs(FetchMsgsConstants.MINIMUM_START_INDEX,
                count, 
                contact_id))
        }
        else {
            this.offset[FetchMsgsConstants.MINIMUM_START_INDEX] = RowCount

            dispatch(contactActions.getContactMsgs(FetchMsgsConstants.MINIMUM_START_INDEX,
                RowCount, 
                contact_id))
        }  
    }

      /*
    Offset: It is used to specify the offset of the first row to be returned.
		if offset=100 and the first row=1 than select would return 101st record.
    Count:It is used to specify the maximum number of rows to be returned.
    SELECT *
    FROM contact
    LIMIT Offset, Count;
    */
   fetchMoreRows = ({startIndex, stopIndex}) => {
        //Note: if the scrollbar is kept pressed, same startIndex is asked with different stopIndex(count)
        //      therefore caching the startIndex to avoid the same call with startIndex !!.
        if(!this.offset[startIndex]) {
            this.offset[startIndex] = stopIndex - startIndex + 1
            
            //Now feth the data, since it does not exists in offset array.
            const { dispatch } = this.props
            dispatch(contactActions.getContactMsgs(startIndex,
                                            stopIndex - startIndex + 1, 
                                            this.props.contactSelected))
        }
    }

    setStateOnTimer = () => {
        const { dispatch } = this.props
        let number = this.props.contactSelected
        
        
        dispatch(contactActions.getMsgsCount(number))
        /*
        setTimeout(() =>{
            
            if(this.state.msgs.length !== this.props.MsgsCount) {
                dispatch(contactActions.getMsgs(number))
                setTimeout(()=>{
                    const { contactMsgArray } = this.props
                    let msgs = contactMsgArray[number]
                    this.setState({ msgs: msgs})
                },1000)        
            }
        },1000)
         */
    }
    _onDragFinished = (size) => {
        if(size) {
            this.setState({ horizontal_top_split_pane_height: size - SplitPaneConstants.RESIZER_OFFSET})
        }
    }
    render() {
        const { contactsMsgArray, contactSelected, contactFullname, contactCreateDate,addedByUsername } = this.props
        let msgs = []
        if(contactSelected !== ContectSelectedConstants.DEFAULT_CONTACT) {
            if(contactsMsgArray[contactSelected]) {
                msgs = contactsMsgArray[contactSelected]
            }
        }
        let count = (this.props.contactMsgsCountArray[contactSelected]) ? this.props.contactMsgsCountArray[contactSelected] :  msgs.length
        
        return(
            <>  
                <SplitPane split="horizontal"
                            minSize={this.props.heightInPx/2}
                            maxSize={this.props.heightInPx - SplitPaneConstants.MINIMUM_SEND_SMS_SIZE}
                            defaultSize={this.props.heightInPx - SplitPaneConstants.SEND_SMS_SIZE - SplitPaneConstants.RESIZER_OFFSET}
                            onDragFinished={this._onDragFinished}>
                    <div>
                        <SearchableTable msgs={msgs}
                                    contactFullname={contactFullname}
                                    contactCreateDate={contactCreateDate}
                                    addedByUsername={addedByUsername}
                                    
                                    heightInPx={this.state.horizontal_top_split_pane_height}
                                    rightSplitPaneWidth={this.props.rightSplitPaneWidth}

                                    loadMoreRows={this.fetchMoreRows}
                                    rowCount={count}
                        />
                    </div>                
                    <div>
                        <Sms contactSelected={contactSelected} 
                             rightSplitPaneWidth={this.props.rightSplitPaneWidth} 
                             heightOfSmsComp={this.props.heightInPx - this.state.horizontal_top_split_pane_height}
                        >
                        </Sms>
                    </div>
                </SplitPane>                
            </>
        )
    }
}

function mapStateToProps(state) {
    const { contactsMsgArray } = state.contactMsgs
    const { contactMsgsCountArray }  = state.contactMsgsCount
    return { contactsMsgArray, contactMsgsCountArray }
}

const connectedViewNSendSms = connect(mapStateToProps)(ViewNSendSms)

export { connectedViewNSendSms as ViewNSendSms}