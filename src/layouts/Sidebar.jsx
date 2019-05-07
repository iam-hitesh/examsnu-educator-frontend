import React, { Component } from 'react';

import {Link} from 'react-router-dom';


class Sidebar extends Component{
    render(){
        return(
            <nav className="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white" id="sidenav-main">
                <div className="container-fluid">

                    <Link className="navbar-brand pt-0" to={`/`}>
                        {/*<img src="./assets/img/brand/blue.png" className="navbar-brand-img" alt="..." />*/}
                        UNKNOWN
                    </Link>

                    <div className="collapse navbar-collapse" id="sidenav-collapse-main">
                        <div className="navbar-collapse-header d-md-none">
                            <div className="row">
                                <div className="col-6 collapse-brand">
                                    <a href="./index.html">
                                        <img src="./assets/img/brand/blue.png" alt="blue"/>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <hr className="my-3" />

                        <h6 className="navbar-heading text-muted">Collection</h6>

                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to={`/`}>
                                    <i className="fa fa-desktop text-primary"> </i> Dashboard
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/tools`}>
                                    <i className="fa fa-cogs text-blue"> </i> Tools
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/tools`}>
                                    <i className="fa fa-credit-card text-orange"> </i> Payment Details
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/collection/questions`}>
                                    <i className="fa fa-question-circle text-yellow"> </i> Question Bank
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/collection/handouts`}>
                                    <i className="fa fa-file-text text-red"> </i> Handouts
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/collection/videos`}>
                                    <i className="fa fa-video-camera text-info"> </i> Videos
                                </Link>
                            </li>
                        </ul>

                        <hr className="my-3" />

                        <h6 className="navbar-heading text-muted">Products</h6>

                        <ul className="navbar-nav mb-md-3">
                            <li className="nav-item">
                                <Link className="nav-link" to={`/product/quizzes`}>
                                    <i className="fa fa-question-circle text-yellow"> </i> Quizzes
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/product/lectures`}>
                                    <i className="fa fa-youtube-play text-red"> </i> Video Lectures
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/product/notes`}>
                                    <i className="fa fa-book text-info"> </i> Notes
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/tools`}>
                                    <i className="fa fa-laptop text-success"> </i> Online Test Series
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/tools`}>
                                    <i className="fa fa-user text-red"> </i> Users
                                </Link>
                            </li>
                        </ul>
                        <hr className="my-3" />

                        <h6 className="navbar-heading text-muted">Analysis</h6>

                        <ul className="navbar-nav mb-md-3">
                            <li className="nav-item">
                                <Link className="nav-link" to={`/tools`}>
                                    <i className="fa fa-credit-card text-yellow"> </i> Payment
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/tools`}>
                                    <i className="fa fa-youtube-play text-blue"> </i> Videos
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/tools`}>
                                    <i className="fa fa-book text-red"> </i> Notes
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/tools`}>
                                    <i className="fa fa-laptop text-success"> </i> Online Test Series
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/tools`}>
                                    <i className="fa fa-user text-warning"> </i> Users
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/tools`}>
                                    <i className="fa fa-credit-card text-yellow"> </i> Referrals
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
};

export default Sidebar;