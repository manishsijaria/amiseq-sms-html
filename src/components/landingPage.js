import React from 'react'

import SplitPane from 'react-split-pane'
import { FetchAndFilterContactTable }  from './fetchAndViewContacts/fetchAndFilterContactTable'

import '../css/react-split-pane.css'
import { SplitPaneConstants } from '../_constants'
import { ViewNSendSms } from '../components/viewNSendSms/viewNSendSms'
import { ContectSelectedConstants } from '../_constants'
//import { connect } from 'react-redux'

class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { contactSelected: ContectSelectedConstants.DEFAULT_CONTACT,
                        fullname:'', 
                        heightInPercent: 0, 
                        heightInPx: 0,
                        widthInPx: 0,
                        left_split_pane_width: SplitPaneConstants.LEFT_CONTACT_PANE_MIN_SIZE - SplitPaneConstants.RESIZER_OFFSET
                    };
    }
    
    componentWillMount() {
        //const { dispatch } = this.props

        this.updateDimensions();
    }

    updateDimensions = () => {
        var w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0],
        width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
        height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;
        //height = body.getElementsByClassName('middleContents')[0].clientHeight;
        //alert(height)
        let divPaddingInOverallLayoutCSS = 5 * 2    //5px after Header  and 5px in Footer
        let heightOfHeaderAndFooter = 56 + 31       //56px for Header and 31px in Footer
        let middleContentHeightInPx = height - heightOfHeaderAndFooter - divPaddingInOverallLayoutCSS
        let middleContentHeightInPercent = (100 * middleContentHeightInPx) / height
        middleContentHeightInPercent = Math.trunc(middleContentHeightInPercent) + "%"
        //alert(middleContentHeight)
        this.setState({ heightInPercent: middleContentHeightInPercent, 
                        heightInPx: middleContentHeightInPx,
                        widthInPx: width});
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }
 
    handelClick = (contact_id, fullname) => {
        this.setState({ contactSelected: parseInt(contact_id, 10), fullname: fullname})
    }  
    _onDragFinished = (size) => {
        this.setState({ left_split_pane_width: size - SplitPaneConstants.RESIZER_OFFSET})
    }
    render() {
        return(
                <>
                    <div className='middleContents' ref={'middleContentsRef'}>
                        <SplitPane split="vertical" 
                                    minSize={SplitPaneConstants.LEFT_CONTACT_PANE_MIN_SIZE} 
                                    defaultSize={SplitPaneConstants.LEFT_CONTACT_PANE_DEFAULT_SIZE} 
                                    style={{ height: this.state.heightInPercent }}
                                    onDragFinished={this._onDragFinished}>
                            <div>
                                <FetchAndFilterContactTable 
                                        onContactClick={this.handelClick} 
                                        contactSelected={this.state.contactSelected}
                                        heightInPx={this.state.heightInPx}
                                        leftSplitPaneWidth={this.state.left_split_pane_width}/>
                            </div>
                            <div>
                                <ViewNSendSms contactSelected={this.state.contactSelected}
                                                fullname={this.state.fullname}
                                                heightInPx={this.state.heightInPx}
                                                rightSplitPaneWidth={this.state.widthInPx - this.state.left_split_pane_width - SplitPaneConstants.RESIZER_OFFSET}
                                                >
                                </ViewNSendSms>
                            </div>
                        </SplitPane>
                    </div>
                </>
        )
    }
}

export default LandingPage;