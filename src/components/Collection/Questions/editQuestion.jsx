import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {BASE_URL} from '../../../services/BaseUrl';
import Footer from '../../../layouts/Footer';
import Sidebar from '../../../layouts/Sidebar';
import Navbar from '../../../layouts/Navbar';
import {Link} from 'react-router-dom';
import Loader from '../../../assets/img/loading.gif';
import Moment from 'moment';

import DOMPurify from 'dompurify';

class editQuestion extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            isLoading:true,
            error:false,
            message:'',
            questionID:'None',

            question:[{id:"",topics:[{id:"",topic_title:""}],subject:{id:"",subject_name:""},options:[{id:"",option_title:""}],correct_options:[{id:"",option_title:""}],created_by:"",created_by_id:"",question:"",hindi_question:"",solution:"",hindi_solution:"",question_type:"",correct_marks:"",negative_marks:"",is_negative_marking:"",is_deleted:""}],
            options:[{option_title:'',hindi_option_title:'',is_deleted:'',created_by:'',created_at:'',updated_at:''}],
            question_topics:[],

            all_subjects:[
                { id: 0, subject_name: " ", alternative_name: " ", description:" ",is_deleted:false, },
            ],
            all_topics:[
                { id: 0, topic_title: "", is_deleted: false, },
            ],

        };

        this.onChange = this.onChange.bind(this);
        this.searchOptions = this.searchOptions.bind(this);
        this.deleteOption = this.deleteOption.bind(this);
        this.deleteCorrectOption = this.deleteCorrectOption.bind(this);
        this.correctOption = this.correctOption.bind(this);
    }

    componentDidMount() {
        document.title = "Update Question - examsnu.in";

        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}question/?id=${this.props.match.params.question_id}`, {
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
                        question:responseJson,
                        isLoading:false,
                    })
                })
                .catch((error) => {
                    this.setState({
                        error:true,
                        isLoading:false,
                        message:'Some Error Occurred',
                    })
                });

            fetch(`${BASE_URL}question-options/?page=1`, {
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
                        options:responseJson,
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

        if(e.target.name === 'topics'){
            this.setState({
                question_topics: [].slice.call(e.target.selectedOptions).map(o => {
                    return o.value;
                })
            });
        }else{
            this.setState({
                question: {
                    ...this.state.question, [e.target.name]: e.target.value
                }
            });
        };
    };
    searchOptions = (event) =>{
        this.setState({
            isLoading:true,
        });
        fetch(`${BASE_URL}search-question-option/?search=`+event.target.value, {
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
                    options:responseJson,
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

    addOption = (event, option_id) => {
        fetch(`${BASE_URL}question-option-update/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
            body:JSON.stringify({
                'question_id':this.props.match.params.question_id,
                'option_id':option_id,
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
                    question:responseJson,
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
    deleteOption = (e, option_id) => {
        fetch(`${BASE_URL}question-option-update/`, {
            method: "PUT",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
            body:JSON.stringify({
                'question_id':this.props.match.params.question_id,
                'option_id':option_id,
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
                    question:responseJson,
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
    correctOption = (e, option_id) => {
        fetch(`${BASE_URL}question-correct-option-update/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
            body:JSON.stringify({
                'question_id':this.props.match.params.question_id,
                'option_id':option_id,
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
                    question:responseJson,
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
    deleteCorrectOption = (e, option_id) =>{
        fetch(`${BASE_URL}question-correct-option-update/`, {
            method: "PUT",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
            body:JSON.stringify({
                'question_id':this.props.match.params.question_id,
                'option_id':option_id,
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
                    question:responseJson,
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
        if(this.state.questionID !== 'None'){
            return(<Redirect to={`/collection/question/edit/${this.state.questionID}`}  />);
        }
        return(
            <div>
                <Sidebar/>
                <div className="main-content">
                    <Navbar/>


                    <div className="header bg-gradient-primary pb-8 pt-5 pt-md-8">
                        <div className="container-fluid">
                            <div className="header-body">
                                <h2 className="headline">Update Question</h2>
                            </div>
                            <Link to={`/collection/questions`} className="btn btn-info btn-lg">Check Question Collection</Link>
                            <Link to={`/collection/question/add`} className="btn btn-warning btn-lg">Add Question</Link>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">

                        {/*Content Starts Here*/}

                        <div className="row mt-5">
                            <div className="col">
                                <div className="card shadow">
                                    <div className="card-header bg-transparent">
                                        <h3 className="mb-0">Update Question</h3>
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
                                                <Link to={`/collection/questions/${this.props.match.params.question_id}`} className="btn btn-primary btn-sm">Edit Question</Link>
                                                <div className="col-lg-12 box-shadow">
                                                    <div className="card shadow border-0">
                                                        <div className="card-body">

                                                            <p className="mt-0 mb-5"><b>Q.)  </b>{this.state.question.question}</p>
                                                            <p className="mt-0 mb-5">{this.state.question.hindi_question}</p>
                                                            <p className="mt-0 mb-1 text-danger">{this.state.question.question_type}</p>

                                                            <span>
                                                                {
                                                                    this.state.question.options ? (
                                                                        <div className="input-radio">
                                                                            {
                                                                                this.state.question.options.map((option, index) => (
                                                                                    <div key={index}>
                                                                                        <div className="radiobtn">
                                                                                            <input type="radio" name="option" value={option.id}/>
                                                                                            <label for={option.id}>
                                                                                                <div className="input_data" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(option.option_title)}}>

                                                                                                </div>
                                                                                                <button className="btn btn-danger btn-sm" onClick={(e, id) => this.deleteOption(e, option.id)}>Delete Option</button>
                                                                                                <button className="btn btn-success btn-sm" onClick={(e, id) => this.correctOption(e, option.id)}>Set As Correct Option</button>
                                                                                            </label>
                                                                                        </div>

                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    ) :""
                                                                }
                                                            </span>
                                                            <h2>Correct Options</h2>
                                                            <span>
                                                                {
                                                                    this.state.question.correct_options ? (
                                                                        <div className="input-radio">
                                                                            {
                                                                                this.state.question.correct_options.map((option, index) => (
                                                                                    <div key={index}>
                                                                                        <div className="radiobtn">
                                                                                            <input type="radio" name="option" value={option.id}/>
                                                                                            <label for={option.id}>
                                                                                                <div className="input_data" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(option.option_title)}}>

                                                                                                </div>
                                                                                                <button className="btn btn-danger btn-sm" onClick={(e, id) => this.deleteCorrectOption(e, option.id)}>Delete Option</button>
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
                                                    onChange={this.searchOptions}
                                                />
                                            </div>
                                        </div>
                                        <table className="table align-items-center table-dark table-flush">
                                            <thead className="thead-dark">
                                            <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col">Title</th>
                                                <th scope="col">Hindi Title</th>
                                                <th scope="col">Created By</th>
                                                <th scope="col">Created At</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>


                                            {/*Content Repeat and Loop Starts Here*/}
                                            {
                                                this.state.options.map((option, index) => (
                                                    <tr key={index}>
                                                        <th scope="row">
                                                            <span className="mb-0 text-sm">{option.id}</span>
                                                        </th>
                                                        <th scope="row">
                                                            <span className={option.is_deleted ? "mb-0 text-sm text-danger" : "mb-0 text-sm text-success"} dangerouslySetInnerHTML={{__html: option.option_title}}></span>
                                                        </th>
                                                        <th scope="row">
                                                            <span className={option.is_deleted ? "mb-0 text-sm text-danger" : "mb-0 text-sm text-success"} dangerouslySetInnerHTML={{__html: option.hindi_option_title}}></span>
                                                        </th>
                                                        <td>
                                                            <Link to={`/author/${option.created_by_id}`}>{option.created_by}</Link>
                                                        </td>
                                                        <td>
                                                            {Moment(option.created_at).format('MMMM Do YYYY')}
                                                        </td>
                                                        <td>
                                                            <button type="button" className="btn btn-info btn-sm delete-btn" onClick={(event, id) =>this.addOption(event, option.id)}>Add Option</button>
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

export default editQuestion;

