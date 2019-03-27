import React from 'react'

import SplitPane from 'react-split-pane'
import { FetchAndFilterContactTable }  from './fetchAndViewContacts/fetchAndFilterContactTable'

import '../css/react-split-pane.css'

//import { connect } from 'react-redux'

class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { contactSelected: '', height: 0};
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
        let middleContentHeight = height - heightOfHeaderAndFooter - divPaddingInOverallLayoutCSS
        middleContentHeight = (100 * middleContentHeight) / height
        middleContentHeight = Math.trunc(middleContentHeight) + "%"
        //alert(middleContentHeight)
        this.setState({ height: middleContentHeight });
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

    render() {
        return(
                <>
                    <div className='middleContents' ref={'middleContentsRef'}>
                        <SplitPane split="vertical" minSize={70} defaultSize={250} style={{ height: this.state.height }}>
                            <div>
                                <FetchAndFilterContactTable 
                                        onContactClick={this.handelClick} 
                                        contactSelected={this.state.contactSelected}
                                        />
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