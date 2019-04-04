import React from 'react'

import SplitPane from 'react-split-pane'
import { FetchAndFilterContactTable }  from './fetchAndViewContacts/fetchAndFilterContactTable'

import '../css/react-split-pane.css'
import { SplitPaneConstants } from '../_constants'
//import { connect } from 'react-redux'

class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { contactSelected: '', 
                        heightInPercent: 0, 
                        heightInPx: 0,
                        split_pane_size: SplitPaneConstants.LEFT_CONTACT_PANE_MIN_SIZE - SplitPaneConstants.RESIZER_OFFSET
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
        //width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
        height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;
        //height = body.getElementsByClassName('middleContents')[0].clientHeight;
        //alert(height)
        let divPaddingInOverallLayoutCSS = 5 * 2    //5px after Header  and 5px in Footer
        let heightOfHeaderAndFooter = 56 + 31       //56px for Header and 31px in Footer
        let middleContentHeightInPx = height - heightOfHeaderAndFooter - divPaddingInOverallLayoutCSS
        let middleContentHeightInPercent = (100 * middleContentHeightInPx) / height
        middleContentHeightInPercent = Math.trunc(middleContentHeightInPercent) + "%"
        //alert(middleContentHeight)
        this.setState({ heightInPercent: middleContentHeightInPercent, heightInPx: middleContentHeightInPx });
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }
 
    handelClick = (contact) => {
        this.setState({ contactSelected: parseInt(contact, 10)})
    }  
    _onDragFinished = (size) => {
        this.setState({ split_pane_size: size - SplitPaneConstants.RESIZER_OFFSET})
    }
    render() {
        return(
                <>
                    <div className='middleContents' ref={'middleContentsRef'}>
                        <SplitPane split="vertical" 
                                    minSize={SplitPaneConstants.LEFT_CONTACT_PANE_MIN_SIZE} 
                                    defaultSize={SplitPaneConstants.VERTICAL_PANE_DEFAULT_SIZE} 
                                    style={{ height: this.state.heightInPercent }}
                                    onDragFinished={this._onDragFinished}>
                            <div>
                                <FetchAndFilterContactTable 
                                        onContactClick={this.handelClick} 
                                        contactSelected={this.state.contactSelected}
                                        heightInPx={this.state.heightInPx}
                                        splitPaneSize={this.state.split_pane_size}/>
                            </div>
                            <div>
                                {this.state.contactSelected}
                            </div>
                        </SplitPane>
                    </div>
                </>
        )
    }
}

export default LandingPage;