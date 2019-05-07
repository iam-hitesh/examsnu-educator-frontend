import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {BASE_URL} from '../../../services/BaseUrl';
import Footer from '../../../layouts/Footer';
import Sidebar from '../../../layouts/Sidebar';
import Navbar from '../../../layouts/Navbar';
import {Link} from 'react-router-dom';
import Loader from '../../../assets/img/loading.gif';

class viewQuiz extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            isLoading:true,
            error:false,
            message:'',

            quiz:[{id:1,exam:"Air Force Common Admission Test",exam_id:1,videos:[{id:1,title:"Maths - 1"}],created_by:"Hitesh Yadav",created_by_id:1,title:"Video - 1",alt_title_video:"V1",is_active:true,active_on:"2019-04-04T00:00:00+05:30",is_deleted:false}],
            quiz_exams:[],

            all_exams : [
                { id: 0, exam_category: "", subjects: [{ id: 0, subject_name: " ", alternative_name: " ", description:" " },],exam_name:"",alternative_name:"",is_deleted:"" },
            ],

        };
        this.onChange = this.onChange.bind(this);
        this.updateQuiz = this.updateQuiz.bind(this);
    }

    componentDidMount() {
        document.title = "View Quiz Details - examsnu.in";

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
                    })
                })
                .catch((error) => {
                    this.setState({
                        error:true,
                        isLoading:false,
                        message:'Some Error Occurred',
                    })
                });

            fetch(`${BASE_URL}exams/`, {
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
                        all_exams:responseJson,
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
        }
    };
    onChange = (e) => {
        e.preventDefault();

        if(e.target.name === 'exam'){
            this.setState({
                quiz_exams: [].slice.call(e.target.selectedOptions).map(o => {
                    return o.value;
                })
            });
        }else{
            this.setState({
                quiz: {
                    ...this.state.quiz, [e.target.name]: e.target.value
                }
            });
        }
    };
    updateQuiz = (e, quiz_id) => {
        this.setState({
            isLoading:true,
        });
        e.preventDefault();

        const formData = new FormData(e.target);
        const quizDet = {};

        for (let entry of formData.entries()) {
            quizDet[entry[0]] = entry[1]
        }

        if(this.state.quiz_exams.length > 0){
            quizDet['exam'] = this.state.quiz_exams;
        }else{
            quizDet['exam'] = this.state.quiz.exam;
        }

        quizDet['quiz_id'] = quiz_id;

        fetch(`${BASE_URL}quizzes/`, {
            method: "PUT",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
            body:JSON.stringify(quizDet),
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
                    isLoading:false,
                    quiz:responseJson,
                    message:'Updated Successfully',
                });
            })
            .catch((error) => {
                this.setState({
                    error:true,
                    isLoading:false,
                    openModal:false,
                    message:'Some Error Occurred',
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
                                <h2 className="headline">View Quiz</h2>
                            </div>
                            <Link to={`/product/quizzes/`} className="btn btn-success btn-lg">Back to Quiz Collection</Link>
                            <Link to={`/collection/questions`} className="btn btn-info btn-lg">Questions Collection</Link>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">

                        {/*Content Starts Here*/}

                        <div className="row mt-5">
                            <div className="col">
                                <div className="card shadow">
                                    <div className="card-header bg-transparent">
                                        <h3 className="mb-0">View Quiz</h3>
                                        <Link to={`/product/quiz/edit/${this.props.match.params.quiz_id}`} className="btn btn-primary btn-sm">Add/Delete Questions</Link>
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

                                            {/*Form for adding Notes starts*/}
                                            <div className="col-lg-12">
                                                <form onSubmit={(event, id) => this.updateQuiz(event, this.props.match.params.quiz_id)} ref="form">
                                                    <div className="row">
                                                        <div className="form-group col-lg-12">
                                                            <label>Title of the Quiz(E.g. SSC - Aptitude)</label>
                                                            <input
                                                                type="text"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                id="title"
                                                                name="title"
                                                                value={this.state.quiz.title}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Title for QUiz"
                                                            />
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Alternative Title of the Notes Lecture's(E.g. SSC - Aptitude)</label>
                                                            <input
                                                                type="text"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                id="alt_title"
                                                                name="alt_title"
                                                                value={this.state.quiz.alt_title}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Alternative Title for Quiz"
                                                            />
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <lable>Duration(In Minutes) Insert 0 For no time bound</lable>
                                                            <input
                                                                type="number"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                name="duration"
                                                                id="duration"
                                                                value={this.state.quiz.duration}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Duration of Quiz(Insert 0 For no time bound)"
                                                            />
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Is Active?</label>
                                                            <select className="form-control form-control-alternative" name="is_active" onChange={(e) => this.onChange(e)} required={true}>
                                                                <option value={this.state.quiz.is_active ? "true" : "false"}>{this.state.quiz.is_active ? "Yes" : "No"}</option>
                                                                <option value="true">Yes</option>
                                                                <option value="false">No</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <lable>Will Active On(If Unactive) ({this.state.quiz.active_on})</lable>
                                                            <input
                                                                type="datetime-local"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                name="active_on"
                                                                id="active_on"
                                                                value={this.state.quiz.active_on}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Will be available on?"
                                                            />
                                                        </div>

                                                        <div className="form-group col-lg-12">
                                                            <lable>Will Expire On(If Unactive) ({this.state.quiz.expire_on})</lable>
                                                            <input
                                                                type="datetime-local"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                name="expire_on"
                                                                id="expire_on"
                                                                value={this.state.quiz.expire_on}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Will be Expire on?"
                                                            />
                                                        </div>

                                                        <div className="form-group col-lg-12">
                                                            <label>Exam(To which Quiz related)</label>
                                                            <select className="form-control form-control-alternative" style={{height:'400px'}} name="exam" onChange={(e) => this.onChange(e)} required={true} multiple={true}>
                                                                {
                                                                    this.state.all_exams.map((exam, index)=>(
                                                                        <option value={exam.id} key={index} selected={true}>{exam.exam_name}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Is Deleted?</label>
                                                            <select className="form-control form-control-alternative" name="is_deleted" onChange={(e) => this.onChange(e)} required={true}>
                                                                <option value={this.state.quiz.is_deleted ? "true" : "false"}>{this.state.quiz.is_deleted ? "Yes" : "No"}</option>
                                                                <option value="true">Yes</option>
                                                                <option value="false">No</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <input type="submit" className="btn btn-primary btn-lg" value="Update Now"/>
                                                        </div>
                                                    </div>


                                                </form>
                                            </div>
                                            {/*Form for adding Notes ends*/}



                                        </div>
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

export default viewQuiz;