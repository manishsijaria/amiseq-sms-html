import React from 'react'
//import '../css/navigation_ul_li.css'
import '../css/navigation_div.css'
import '../css/overall-layout.css'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = { toggle: false }
    }

    toggleDropdown = (e) => {
        this.setState({ toggle: !this.state.toggle} )
    }

    _onBlur = () => {
        //onBlur is called on onClick event also.
        //directly changing the toggle state, does not allow the click event
        //to propogate and render the component(login for e.g.), hence we need a timer.
        setTimeout(() => {
            if (this.state.toggle) {
                this.setState({
                    toggle: false,
                });
            }
        }, 300);
    }

    render() {
        let loggedInUser = ''
        if(this.props.loggedIn) {
            loggedInUser = 'Welcome ' + this.props.user.username + '!'
        } 
        return(
            <div className="navbar ">
                <NavLink to='/home'>Home</NavLink>
                <NavLink to='/addcontact'>Add Contact</NavLink>
                <div className="dropdown" onBlur={this._onBlur}>
                    <span style={{display: 'inline-block', width: '150px'}}>{loggedInUser}</span>
                    
                    <button className="dropbtn" onClick={this.toggleDropdown} >
                        <i className="fa fa-bars fa-lg" aria-hidden="true"></i>
                    </button>
                    {   this.state.toggle &&
                        <div className="dropdown-content" style={{marginLeft: '125px'}} onClick={this.toggleDropdown} >
                            {!this.props.loggedIn ? <NavLink to='/login'>Login</NavLink> : <NavLink to='/logout'>Logout</NavLink> }
                        </div>
                    }
                </div>
            </div>                       
        )
    }
}


function mapStateToProps(state) {
    const { user, loggedIn } = state.authentication
    return { user, loggedIn }
}

const connectedHeader = connect(mapStateToProps)(Header)

export {connectedHeader as Header}

/*
            <nav className='nav'>
                <img className='logo' alt='Amiseq Inc. attendance System' src='../../images/amiseq-logo.jpg'></img>               <ul>
                    <li className='navigation_ul_li'>Amiseq Inc. Attendance System </li> 
                    <li className='navigation_ul_li Active' id='float-right'>
                        Get In 
                        <ul className='ul_direct_child_of_li'>
                            <li className='navigation_ul_li'>
                                <NavLink to='/login' className='current'>Login</NavLink>
                            </li>
                            <li className='navigation_ul_li'>
                                <NavLink to='/logout' className='current'>Logout</NavLink>
                            </li>
                            <li className='navigation_ul_li'>
                                <NavLink to='/register' className='current'>Register</NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav> 



                <ul>
                    <li><a href="#">item 1 </a></li> 
                    <li ><a href="#">item 2 </a></li>
                    <li className='Active' id='float-right'>
                        <a   href="#">Get In </a>
                        <ul>
                            <li ><a href="#">login</a></li>
                            <li ><a href="#">logout</a></li>
                            <li ><a href="#">register</a></li>
                        </ul>
                    </li>
                </ul>
*/