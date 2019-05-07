import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {BASE_URL} from '../../../services/BaseUrl';
import Footer from '../../../layouts/Footer';
import Sidebar from '../../../layouts/Sidebar';
import Navbar from '../../../layouts/Navbar';
import {Link} from 'react-router-dom';
import Loader from '../../../assets/img/loading.gif';
import {cutString} from '../../../services/cutString';
import Moment from 'moment';

class editQuiz extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            isLoading:true,
            error:false,
            message:'',

            quiz:[{id:1,exam:"Air Force Common Admission Test",exam_id:1,videos:[{id:1,title:"Maths - 1"}],created_by:"Hitesh Yadav",created_by_id:1,title:"Video - 1",alt_title_video:"V1",is_active:true,active_on:"2019-04-04T00:00:00+05:30",is_deleted:false}],

            questions:[{id:1,topics:[{"id":2,"topic_title":"Geography"},{"id":1,"topic_title":"History"}],"subject":"General Knowledge","subject_id":1,"created_by":"Hitesh Yadav","created_by_id":1,question:"Maths - 1","video_alt_title":"Maths - 1","description":"This is Just a trial Methodd","link":"http://google.com","created_at":"2019-03-06T10:34:25.860953+05:30","updated_at":"2019-03-06T10:34:25.868162+05:30","is_deleted":false}],
        };

        this.onChange = this.onChange.bind(this);
        this.searchQuestion = this.searchQuestion.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);

    }

    componentDidMount() {
        document.title = "Update Notes - examsnu.in";

        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}quiz/?id=${this.props.match.params.quiz_id}`, {
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
                        quiz:responseJson,
                        isLoading:false,
                        quizID:this.props.match.params.quiz_id,
                    })
                })
                .catch((error) => {
                    this.setState({
                        error:true,
                        isLoading:false,
                        message:'Some Error Occurred',
                    })
                });

            fetch(`${BASE_URL}questions/?is_deleted=0&page=1`, {
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
        }
    };
    onChange = (e) => {
        e.preventDefault();
        this.setState({
            search:e.target.value,
        });
    };
    searchQuestion = (event) =>{
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
        return false;
    };

    addQuestion = (event, question_id) => {
        fetch(`${BASE_URL}quiz/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
            body:JSON.stringify({
                'quiz_id':this.props.match.params.quiz_id,
                'question_id':question_id,
            })
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
                    quiz:responseJson,
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
        return false;
    };
    deleteQuestion = (e, question_id) => {
        fetch(`${BASE_URL}quiz/`, {
            method: "PUT",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
            body:JSON.stringify({
                'quiz_id':this.props.match.params.quiz_id,
                'question_id':question_id,
            })
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
                    quiz:responseJson,
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
        return false;
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
                                <h2 className="headline">Update Quiz</h2>
                            </div>

                        </div>
                    </div>
                    <div className="container-fluid mt--7">

                        {/*Content Starts Here*/}

                        <div className="row mt-5">
                            <div className="col">
                                <div className="card shadow">
                                    <div className="card-header bg-transparent">
                                        <h3 className="mb-0">Update Quiz</h3>
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

                                    <div  className={this.state.isLoading ? "card-body hideBox" : "card-body"}>
                                        <div className="row icon-examples">

                                            {/*Form for Editing Question starts*/}
                                            <div className="col-lg-12">
                                                <Link to={`/product/quiz/view/${this.props.match.params.quiz_id}`} className="btn btn-primary btn-sm">Edit Quiz Details</Link>
                                                <div className="col-lg-12 box-shadow">
                                                    <div className="card shadow border-0">
                                                        <div className="card-body">

                                                            <h3 className="mt-0 mb-5"><b>Quiz Title.)  </b>{this.state.quiz.title}</h3>

                                                            <span>
                                                                {
                                                                    this.state.quiz.questions ? (
                                                                        <div className="input-radio">
                                                                            {
                                                                                this.state.quiz.questions.map((question, index) => (
                                                                                    <div key={index}>
                                                                                        <div className="radiobtn">

                                                                                            <label for={question.id}>
                                                                                                ({question.id}) {question.question}
                                                                                                <br/>
                                                                                                <button className="btn btn-danger btn-sm" onClick={(e, id) => this.deleteQuestion(e, question.id)}>Remove Question</button>
                                                                                            </label>

                                                                                        </div>

                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    ) :""
                                                                }
                                                            </span>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*Form for adding Video ends*/}



                                        </div>
                                    </div>
                                    <div className="table-responsive">
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
                                                    onChange={this.searchQuestion}
                                                />
                                            </div>
                                        </div>
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
                                                            <span className="mb-0 text-sm">{question.id}</span>
                                                        </th>
                                                        <th scope="row">
                                                            <span style={{width:'100px'}} className={question.is_deleted ? "mb-0 text-sm text-danger" : "mb-0 text-sm text-success"} dangerouslySetInnerHTML={{__html: cutString(question.question, 30)}}></span>
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
                                                            {question.is_deleted ? "" : (<button type="button" className="btn btn-info btn-sm delete-btn" onClick={(event, id) =>this.addQuestion(event, question.id)}>Add Question</button>)}
                                                        </td>
                                                    </tr>

                                                ))
                                            }
                                            {/*Content Repeat Loops ends here*/}

                                            </tbody>
                                        </table>
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

export default editQuiz;

