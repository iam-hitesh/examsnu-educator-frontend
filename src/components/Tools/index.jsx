import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import Footer from '../../layouts/Footer'
import Sidebar from '../../layouts/Sidebar'
import Navbar from '../../layouts/Navbar'
import {Link} from 'react-router-dom';


class Tools extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),
        };
    }

    componentDidMount() {
        document.title = "Tools - EXAMSNU.IN";
    }

    render(){
        if(!this.state.isAuthenticated){
            return(<Redirect to="/login"/>);
        }
        return(
            <div>
                <Sidebar/>
                <div className="main-content">
                    <Navbar/>


                    <div className="header bg-gradient-primary pb-8 pt-5 pt-md-8">
                        <div className="container-fluid">
                            <div className="header-body">
                                <h2 className="headline">Tools Available</h2>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">
                        <div className="row">
                            <div className="col">
                                <div className="card shadow">
                                    <div className="card-header bg-transparent">
                                        <h3 className="mb-0">Tools Available</h3>
                                    </div>
                                    <div  className={this.state.isLoading ? "card-body hideBox" : "card-body"}>
                                        <div className="row icon-examples">

                                            <div className="col-lg-4 box-shadow">
                                                <div className="card shadow border-0">
                                                    <div className="card-body py-5">
                                                        <h2><span className="text-danger">Red = Deactivated</span><br/><span className="text-success">Green = Activated</span></h2>
                                                    </div>
                                                </div>
                                            </div>

                                            <Link to={`/tool/categories`} className="col-lg-4 box-shadow">
                                                <div className="card shadow border-0">
                                                    <div className="card-body py-5">
                                                        <h2 className="text-primarys text-uppercase">Exam Categories</h2>
                                                        <div>
                                                            <span className="badge badge-pill badge-success">Defence</span>
                                                            <span className="badge badge-pill badge-primary">Civil Services</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                            <Link to={`/tool/subjects`} className="col-lg-4 box-shadow">
                                                <div className="card shadow border-0">
                                                    <div className="card-body py-5">
                                                        <h2 className="text-primarys text-uppercase">Subjects</h2>
                                                        <div>
                                                            <span className="badge badge-pill badge-warning">GK</span>
                                                            <span className="badge badge-pill badge-primary">Science</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                            <Link to={`/tool/topics`} className="col-lg-4 box-shadow">
                                                <div className="card shadow border-0">
                                                    <div className="card-body py-5">
                                                        <h2 className="text-primarys text-uppercase">Topics</h2>
                                                        <div>
                                                            <span className="badge badge-pill badge-success">Physics</span>
                                                            <span className="badge badge-pill badge-danger">Maths</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                            <Link to={`/tool/exams`} className="col-lg-4 box-shadow">
                                                <div className="card shadow border-0">
                                                    <div className="card-body py-5">
                                                        <h2 className="text-primarys text-uppercase">Exams</h2>
                                                        <div>
                                                            <span className="badge badge-pill badge-warning">AFCAT</span>
                                                            <span className="badge badge-pill badge-primary">CDS</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                            <Link to={`/tool/plans`} className="col-lg-4 box-shadow">
                                                <div className="card shadow border-0">
                                                    <div className="card-body py-5">
                                                        <h2 className="text-primarys text-uppercase">Plans</h2>
                                                        <div>
                                                            <span className="badge badge-pill badge-primary">Monthly</span>
                                                            <span className="badge badge-pill badge-warning">Quarterly</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/*Footer*/}
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
};

export default Tools;

