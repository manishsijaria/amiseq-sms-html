import React  from 'react'

import { contactActions } from '../../_actions'
import { connect } from 'react-redux'
import { FetchMsgsConstants } from '../../_constants'
import SplitPane from 'react-split-pane'
import { SplitPaneConstants, ContectSelectedConstants } from '../../_constants'

import  SearchableTable  from '../viewNSendSms/searchableTable'
import { Sms } from './sms'
import { incrementMsgsCount } from '../socketAPI/incrementMsgsCount'

//const TIMER_INTERVAL = 20000
class ViewNSendSms extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { contactSelected: ContectSelectedConstants.DEFAULT_CONTACT, 
                        horizontal_top_split_pane_height: this.props.heightInPx - SplitPaneConstants.SEND_SMS_SIZE ,
                        heightOfSMSComponent: SplitPaneConstants.SEND_SMS_SIZE 
                    };
        this.prevContactSelected = this.props.contactSelected;
        this.offset = [];
        
        //KB: Event from SocketIO.Client is received twice(for a event), one in mounted state, and other in unmounted state.
        //    hence incrementing the msgCount twice in componentDidMount method.
        //    Therefore this._isMounted variable is added to track whether the component is Mounted or not.
        //    Than dispatch the event to increment msgCount.
        //https://www.robinwieruch.de/react-warning-cant-call-setstate-on-an-unmounted-component/
        this._isMounted = false
    }    
    
    static getDerivedStateFromProps(props, state) {
        if (props.heightInPx !== (state.horizontal_top_split_pane_height + 
                                SplitPaneConstants.SEND_SMS_SIZE 
                                )) {
            return {
                horizontal_top_split_pane_height: props.heightInPx - state.heightOfSMSComponent ,
                heightOfSMSComponent : state.heightOfSMSComponent
            };
        }
        // Return null if the state hasn't changed
        return null;
    }

    componentDidMount() {
        this._isMounted = true   //Set it to true if the component is mounted.
        const { dispatch } = this.props
        
            incrementMsgsCount( (err, data) => { 
                if(this._isMounted) { //If mounted than increment MsgCount.
                    dispatch(contactActions.incrementMsgsCount(data.contact_id,data.by) ) 
                }
            });    
    }

    componentWillUnmount() {
        this._isMounted = false //Set it to false, if component is unmounted.
    }

    componentDidUpdate(prevProps, prevState) {
        const { dispatch } = this.props

        let newContactSelected = this.props.contactSelected

        if(prevProps.contactSelected !== newContactSelected) {
            this.prevContactSelected = prevProps.contactSelected
            dispatch(contactActions.getMsgsCount(newContactSelected)) 
        }

        let newMsgCount = this.props.contactMsgsCountArray[newContactSelected]
        let prevMsgCount = prevProps.contactMsgsCountArray[newContactSelected] 

       /*
        TODO: presently fetchRowsOnChange resets the contactsMsgs [] , and refetches from beginning.
              later incremental fetch can be implemented for the latest(few) rows added, and can be appended in reducer.
        */
       if(this.prevContactSelected !== newContactSelected && 
            prevMsgCount !== newMsgCount && 
            (newMsgCount > 0) //since "prevMsgCount === undefined and newMsgCount === 0"  is true
            ) {
            //TODO: for incremental fetch the offset should not be [].
            //      it should be offset of the last fetch + count  i think.
            if(this.offset[newContactSelected]) {
                //1. Get the count from last fetch  
                let prevCount = this.offset[newContactSelected][this.offset[newContactSelected].length - 1]
                //2. get the total item fetched till now, in min_start_index.
                let min_start_index = this.offset[newContactSelected].length - 1 + prevCount 
                //3. substract from the newMsgCount, from min_start_index to get the next fetch count.
                let next_count = newMsgCount - min_start_index
                //4. store the next_count to fetch in offset array.
                this.offset[newContactSelected][min_start_index] = next_count
                //5. since the new messages arrives on the top of records (from the query)
                //   fetch from 0 index to next_count.
                //   LAST PARAM OF of below code is append_in_the_end = true
                //dispatch(contactActions.getContactMsgs(0,next_count, newContactSelected, true))
                dispatch(contactActions.getContactMsgs(min_start_index,next_count, newContactSelected))
            } else {
                this.fetchRowsOnChange(newContactSelected, newMsgCount)
            }
        } 
    }

    ifNotExistThanAddContactIDArrayInOffsetArray = (contact_id) => {
        if(!this.offset[contact_id]) {
            this.offset[contact_id] = []
        }
    }

    fetchRowsOnChange = (contact_id, RowCount) => {
        let count 
        const { dispatch } = this.props  
        
        this.ifNotExistThanAddContactIDArrayInOffsetArray(contact_id) 

        if(RowCount > FetchMsgsConstants.MINIMUM_BATCH_SIZE) {
            count = FetchMsgsConstants.MINIMUM_BATCH_SIZE - FetchMsgsConstants.MINIMUM_START_INDEX + 1
            
            this.offset[contact_id][FetchMsgsConstants.MINIMUM_START_INDEX] = count

            dispatch(contactActions.getContactMsgs(FetchMsgsConstants.MINIMUM_START_INDEX,
                    count, 
                    contact_id))
        }
        else {
            this.offset[contact_id][FetchMsgsConstants.MINIMUM_START_INDEX] = RowCount

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
        if(!this.offset[this.props.contactSelected][startIndex]) {
            this.offset[this.props.contactSelected][startIndex] = stopIndex - startIndex + 1
            
            //Now feth the data, since it does not exists in offset array.
            const { dispatch } = this.props
            dispatch(contactActions.getContactMsgs(startIndex,
                                            stopIndex - startIndex + 1, 
                                            this.props.contactSelected))
        }
    }
   
    /*
    setStateOnTimer = () => {
        const { dispatch } = this.props
        let number = this.props.contactSelected
        
        dispatch(contactActions.getMsgsCount(number))
    }
    */

    _onDragFinished = (size) => {
        if(size) {
            this.setState({ 
                horizontal_top_split_pane_height: size ,
                heightOfSMSComponent: this.props.heightInPx - size 
            })
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
                            defaultSize={'85%'}  //{this.props.heightInPx - SplitPaneConstants.SEND_SMS_SIZE }
                            size={this.state.horizontal_top_split_pane_height}
                            onDragFinished={this._onDragFinished}>
                    <div>
                        <SearchableTable msgs={msgs}
                                    contactFullname={contactFullname}
                                    contactCreateDate={contactCreateDate}
                                    addedByUsername={addedByUsername}
                                    
                                    heightInPx={this.state.horizontal_top_split_pane_height }
                                    rightSplitPaneWidth={this.props.rightSplitPaneWidth}

                                    loadMoreRows={this.fetchMoreRows}
                                    rowCount={count}
                        />
                    </div>                
                    <div>
                        <Sms contactSelected={contactSelected} 
                             rightSplitPaneWidth={this.props.rightSplitPaneWidth} 
                             heightOfSmsComp={this.state.heightOfSMSComponent}
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