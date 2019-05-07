import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';

import {PostData} from '../services/PostData'

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
        }
        this.login = this.login.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    login = (e) => {
        e.preventDefault();
        if(this.state.email && this.state.password){
            PostData('login', this.state).then((result) => {
                let responseJSON = result;
                if(responseJSON.status === 1){

                    // localStorage.setItem('examsnuToken', responseJSON.token);
                    // localStorage.setItem('profile', JSON.stringify(responseJSON.profile));

                    sessionStorage.setItem('examsnuDashToken', responseJSON.token);
                    sessionStorage.setItem('examsnuDashProfile', JSON.stringify(responseJSON.profile));
                    this.setState({
                        isAuthenticated:true
                    })
                }else{
                    this.setState({
                        isAuthenticated:false
                    })
                }
            });
        }
    }

    onChange = e =>{
        e.preventDefault();
        this.setState({
            [e.target.name] : e.target.value,
        })
    }
    render(){
        if(this.state.isAuthenticated){
            return(<Redirect to="/"/>);
        }
        return(
            <div className="bg-default">
                <div className="main-content">

                    <nav className="navbar navbar-top navbar-horizontal navbar-expand-md navbar-dark">
                        <div className="container px-4">
                            <a className="navbar-brand" href="../index.html">
                                <img src="../assets/img/brand/white.png" alt="white"/>
                            </a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-collapse-main" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbar-collapse-main">

                                <div className="navbar-collapse-header d-md-none">
                                    <div className="row">
                                        <div className="col-6 collapse-brand">
                                            <a href="../index.html">
                                                <img src="../assets/img/brand/blue.png" alt="white"/>
                                            </a>
                                        </div>
                                        <div className="col-6 collapse-close">
                                            <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbar-collapse-main" aria-controls="sidenav-main" aria-expanded="false" aria-label="Toggle sidenav">
                                                <span></span>
                                                <span></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <ul className="navbar-nav ml-auto">
                                    <li className="nav-item">
                                        <a className="nav-link nav-link-icon" href="../index.html">
                                            <i className="fa fa-dashcube"></i>
                                            <span className="nav-link-inner--text">Dashboard</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link nav-link-icon" href="../examples/register.html">
                                            <i className="fa fa-plus-circle"></i>
                                            <span className="nav-link-inner--text">Register</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link nav-link-icon" href="../examples/login.html">
                                            <i className="fa fa-sign-in"></i>
                                            <span className="nav-link-inner--text">Login</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link nav-link-icon" href="../examples/profile.html">
                                            <i className="fa fa-user"></i>
                                            <span className="nav-link-inner--text">Profile</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>

                    <div className="header bg-gradient-primary py-7 py-lg-8">
                        <div className="container">
                            <div className="header-body text-center mb-7">
                                <div className="row justify-content-center">
                                    <div className="col-lg-5 col-md-6">
                                        <h1 className="text-white">Welcome!</h1>
                                        <p className="text-lead text-light">Login to your account using email and password.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="separator separator-bottom separator-skew zindex-100">
                            <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <polygon className="fill-default" points="2560 0 2560 100 0 100"></polygon>
                            </svg>
                        </div>
                    </div>

                    <div className="container mt--8 pb-5">
                        <div className="row justify-content-center">
                            <div className="col-lg-5 col-md-7">
                                <div className="card bg-secondary shadow border-0">
                                    <div className="card-body px-lg-5 py-lg-5">
                                        <form onSubmit={this.login}>
                                            <div className="form-group mb-3">
                                                <div className="input-group input-group-alternative">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i className="fa fa-envelope-o"></i></span>
                                                    </div>
                                                    <input
                                                        name="email"
                                                        type="text"
                                                        className="form-control form-control-user"
                                                        id="exampleInputEmail"
                                                        aria-describedby="emailHelp"
                                                        placeholder="Enter Email/Mobile Number"
                                                        value={this.state.email}
                                                        onChange={this.onChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="input-group input-group-alternative">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i className="fa fa-unlock-alt"></i></span>
                                                    </div>
                                                    <input
                                                        name="password"
                                                        type="password"
                                                        className="form-control form-control-user"
                                                        id="exampleInputPassword"
                                                        placeholder="Password"
                                                        value={this.state.password}
                                                        onChange={this.onChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="custom-control custom-control-alternative custom-checkbox">
                                                <input className="custom-control-input" id=" customCheckLogin" type="checkbox" />
                                                <label className="custom-control-label">
                                                    <span className="text-muted">Remember me</span>
                                                </label>
                                            </div>
                                            <div className="text-center">
                                                <input
                                                    type="submit"
                                                    name="login"
                                                    value="Login"
                                                    className="btn btn-primary my-4"
                                                />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-6">
                                        <a href="forgot" className="text-light"><small>Forgot password?</small></a>
                                    </div>
                                    <div className="col-6 text-right">
                                        <Link className="text-light" to={`/signup`}>Create new account</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;