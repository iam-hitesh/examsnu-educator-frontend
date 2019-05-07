import React, { Component } from 'react';
import {BASE_URL} from '../services/BaseUrl';
import {Link} from 'react-router-dom';
import User from '../assets/img/user.jpg'

class Navbar extends Component{
    constructor(props){
        super(props);
        this.state = {
            loggedProfile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),
            dropdown : false,
        }
        this.logout = this.logout.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    toggle = () =>{
        this.setState({
            dropdown : this.state.dropdown ? false : true,
        })
    }


    logout = () => {
        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}logout`, {
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
                }
            })
        }
        sessionStorage.removeItem('examsnuDashToken');
        sessionStorage.removeItem('examsnuDashProfile');

        window.location.reload();
    };
    render(){
        return(
            <nav className="navbar navbar-top navbar-expand-md navbar-dark" id="navbar-main">
                <div className="container-fluid">
                    <Link className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block" to={`/`}>UNKNOWN</Link>
                    <form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
                        <div className="form-group mb-0">
                            <div className="input-group input-group-alternative">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fa fa-search"></i></span>
                                </div>
                                <input className="form-control" placeholder="Search" type="text" />
                            </div>
                        </div>
                    </form>

                    <ul className="navbar-nav align-items-center d-none d-md-flex">
                        <li className="nav-item dropdown">
                            <div className="nav-link pr-0" onClick={this.toggle} role="button"  aria-haspopup="true" aria-expanded="false">
                                <div className="media align-items-center">
                                    <span className="avatar avatar-sm rounded-circle">
                                        <img alt="profile" src={this.state.loggedProfile.profile_pic ? this.state.loggedProfile.profile_pic : User} />
                                    </span>
                                    <div className="media-body ml-2 d-none d-lg-block">
                                        <span className="mb-0 text-sm  font-weight-bold">{this.state.loggedProfile.name ? this.state.loggedProfile.name : 'User'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={this.state.dropdown ? "dropdown-menu dropdown-menu-arrow dropdown-menu-right show" : "dropdown-menu dropdown-menu-arrow dropdown-menu-right"}>
                                <div className=" dropdown-header noti-title">
                                    <h6 className="text-overflow m-0">Welcome!</h6>
                                </div>
                                <a href="./examples/profile.html" className="dropdown-item">
                                    <i className="ni ni-single-02"></i>
                                    <span>My profile</span>
                                </a>
                                <a href="./examples/profile.html" className="dropdown-item">
                                    <i className="ni ni-settings-gear-65"></i>
                                    <span>Settings</span>
                                </a>
                                <a href="./examples/profile.html" className="dropdown-item">
                                    <i className="ni ni-calendar-grid-58"></i>
                                    <span>Activity</span>
                                </a>
                                <a href="./examples/profile.html" className="dropdown-item">
                                    <i className="ni ni-support-16"></i>
                                    <span>Support</span>
                                </a>
                                <div className="dropdown-divider"></div>
                                <button onClick={this.logout} className="dropdown-item">
                                    <i className="ni ni-user-run"></i>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
};

export default Navbar;