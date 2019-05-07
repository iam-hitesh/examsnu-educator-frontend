import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {BASE_URL} from '../../../services/BaseUrl';
import Footer from '../../../layouts/Footer';
import Sidebar from '../../../layouts/Sidebar';
import Navbar from '../../../layouts/Navbar';
import {Link} from 'react-router-dom';
import Loader from '../../../assets/img/loading.gif';
import {cutString} from '../../../services/cutString';
import Moment from 'moment'

class Questions extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            isLoading:true,
            error:false,
            message:'',
            page:1,

            questions:[{"id":1,"topics":[{"id":2,"topic_title":"Geography"},{"id":1,"topic_title":"History"}],"subject":{"id":1,"subject_name":"General Knowledge"},"options":[{"id":1,"option_title":"459"}],"correct_options":[{"id":1,"option_title":"459"}],"created_by":"Hitesh Yadav","created_by_id":1,"question":"This is First Question","hindi_question":"","hindi_solution":"","solution":"This is First Questions Solution","question_type":1,"correct_marks":3.0,"negative_marks":-1.0,"is_negative_marking":true,"created_at":"2019-03-06T13:49:27.940380+05:30","updated_at":"2019-03-06T13:49:27.941418+05:30","is_deleted":false}],
        };

        this.changePage = this.changePage.bind(this);
        this.searchQuestions = this.searchQuestions.bind(this);
    }

    componentDidMount() {
        document.title = "Questions Collection - examsnu.in";
        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}questions/?page=`+this.state.page, {
                method: "GET",
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
                },
            })
                .then((response) => {
                    if(!response.ok){
                        throw new Error(response.status)
                    }else{
                        return response.json();
                    }
                })
                .then((responseJson) => {
                    this.setState({
                        questions:responseJson,
                        isLoading:false,
                    })
                })
                .catch((error) => {
                    this.setState({
                        error:true,
                        isLoading:false,
                        message: 'Some Error Occurred, Try Again!',
                    })
                });
        };
    };

    searchQuestions = (event) =>{
        this.setState({
            isLoading:true,
        });
        fetch(`${BASE_URL}searchQuestion/?search=`+event.target.value, {
            method: "GET",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
        })
            .then((response) => {
                if(!response.ok){
                    throw new Error(response.status)
                }else{
                    return response.json();
                }
            })
            .then((responseJson) => {
                this.setState({
                    questions:responseJson,
                    isLoading:false,
                })
            })
            .catch((error) => {
                this.setState({
                    error:true,
                    isLoading:false,
                    message: 'Some Error Occurred, Try Again!',
                })
            });
    };

    changePage = (event, id) => {
        this.setState({
            isLoading:true,
        });
        let page = 0;
        if(id === 1){
            page = this.state.page + 1;
        }else{
            page = this.state.page - 1;
        }
        fetch(`${BASE_URL}questions/?page=`+page, {
            method: "GET",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
        })
            .then((response) => {
                if(!response.ok){
                    throw new Error(response.status)
                }else{
                    return response.json();
                }
            })
            .then((responseJson) => {
                this.setState({
                    questions:responseJson,
                    isLoading:false,
                    page:page,
                })
            })
            .catch((error) => {
                this.setState({
                    error:true,
                    isLoading:false,
                    message: 'Some Error Occurred, Try Again!',
                })
            });
    };
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
                                <h2 className="headline">Questions Collection</h2>
                            </div>
                            <Link to={`/collection/question/add`} className="btn btn-info btn-lg">Add New Question</Link>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">

                        {/*Content Starts Here*/}

                        <div className="row mt-5">
                            <div className="col">
                                <div className="card bg-default shadow">
                                    <div className="card-header bg-transparent border-0">
                                        <h3 className="text-white mb-0">Questions Collection</h3>
                                    </div>
                                    <div className="navbar-search mr-6 d-none d-md-flex col-lg-12">
                                        <div className="input-group input-group-alternative">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text"><i className="fa fa-search"></i></span>
                                            </div>
                                            <input
                                                className="form-control"
                                                placeholder="Search(Date in YYYY-MM-DD Format)"
                                                type="text"
                                                id="search-input"
                                                onChange={this.searchQuestions}
                                            />
                                        </div>
                                    </div>

                                    {/*Warning Message*/}
                                    <div className="margin">
                                        {this.state.message && this.state.error ? (
                                            <div className="alert alert-danger" role="alert">
                                                {this.state.message}
                                            </div>
                                        ) : (
                                            this.state.message && !this.state.error ? (
                                                <div className="alert alert-info" role="alert">
                                                    {this.state.message}
                                                </div>
                                            ) : ''
                                        )}
                                    </div>

                                    {/*Loader*/}
                                    <div className="loader-justify">
                                        <img
                                            src={Loader}
                                            className={!this.state.isLoading ? "hideBox" : "loader"}
                                            alt="Loader"
                                        />
                                    </div>

                                    {/*Videos Table*/}
                                    <div className="table-responsive">
                                        <table className="table align-items-center table-dark table-flush">
                                            <thead className="thead-dark">
                                            <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col">Question</th>
                                                <th scope="col">Subject</th>
                                                <th scope="col">Topics</th>
                                                <th scope="col">Question Type</th>
                                                <th scope="col">Created By</th>
                                                <th scope="col">Created At</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>


                                            {/*Content Repeat and Loop Starts Here*/}
                                            {
                                                this.state.questions.map((question, index) => (
                                                    <tr key={index}>
                                                        <th scope="row">
                                                            <Link to={`/collection/questions/${question.id}`} className="mb-0 text-sm">{question.id}</Link>
                                                        </th>
                                                        <th scope="row">
                                                            <span className={question.is_deleted ? "mb-0 text-sm text-danger" : "mb-0 text-sm text-success"}>{cutString(question.question, 30)}</span>
                                                        </th>
                                                        <td>
                                                            {question.subject.subject_name}
                                                        </td>
                                                        <td>
                                                            <div>
                                                                {
                                                                    question.topics.map((topic, index) => (
                                                                        <div>
                                                                            <span className="badge badge-pill badge-success text-white" key={index}>{topic.topic_title}</span>
                                                                            <br/>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {question.question_type}
                                                        </td>
                                                        <td>
                                                            <Link to={`/author/${question.created_by_id}`}>{question.created_by}</Link>
                                                        </td>
                                                        <td>
                                                            {Moment(question.created_at).format('MMMM Do YYYY')}
                                                        </td>
                                                        <td>
                                                            <Link to={`/collection/question/edit/${question.id}`} className="btn btn-info btn-sm delete-btn">Edit</Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                            {/*Content Repeat Loops ends here*/}

                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="card-footer bg-default py-4">
                                        <nav aria-label="...">
                                            <ul className="pagination justify-content-center mb-0">

                                                {this.state.page === 1 ? "" : (
                                                    <li className="page-item">
                                                        <button className="page-link" onClick={(event, page) => this.changePage(event, 0)}>
                                                            <i className="fa fa-angle-left"></i>
                                                            <span className="sr-only">Previous</span>
                                                        </button>
                                                    </li>
                                                )}
                                                {this.state.page === 0 ? "" : (
                                                    <li className="page-item">
                                                        <button className="page-link" onClick={(event, page) => this.changePage(event, 1)}>
                                                            <i className="fa fa-angle-right"></i>
                                                            <span className="sr-only">Next</span>
                                                        </button>
                                                    </li>
                                                )}


                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*Content Ends Here*/}


                        {/*Footer*/}
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
};

export default Questions;

