import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {BASE_URL} from '../../../services/BaseUrl';
import Footer from '../../../layouts/Footer';
import Sidebar from '../../../layouts/Sidebar';
import Navbar from '../../../layouts/Navbar';
import {Link} from 'react-router-dom';
import Loader from '../../../assets/img/loading.gif';

class addQuestion extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            isLoading:true,
            error:false,
            message:'',
            questionID:'None',

            question:[{id:"",topics:[{id:"",topic_title:""}],"subject":{id:"",subject_name:""},options:[{id:"",option_title:""}],correct_options:[{id:"",option_title:""}],created_by:"",created_by_id:"",question:"",hindi_question:"",solution:"",hindi_solution:"",question_type:"",correct_marks:"",negative_marks:"",is_negative_marking:"",is_deleted:""}],
            question_topics:[],

            all_subjects:[
                { id: 0, subject_name: " ", alternative_name: " ", description:" ",is_deleted:false, },
            ],
            all_topics:[
                { id: 0, topic_title: "", is_deleted: false, },
            ],

        };
        this.onChange = this.onChange.bind(this);
        this.addNewQuestion = this.addNewQuestion.bind(this);
    }

    componentDidMount() {
        document.title = "Add New Question - examsnu.in";

        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}subjects/`, {
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
                .then((subjectJson) => {
                    // This is for Calling all available topics

                    fetch(`${BASE_URL}topics/`, {
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
                        .then((topicsJson) => {
                            this.setState({
                                all_subjects:subjectJson,
                                all_topics:topicsJson,
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
        }
    };
    addNewQuestion = (e) => {
        this.setState({
            isLoading:true,
        });
        e.preventDefault();

        const formData = new FormData(e.target);
        const questionDet = {};

        for (let entry of formData.entries()) {
            questionDet[entry[0]] = entry[1]
        }
        questionDet['topics'] = this.state.question_topics;

        fetch(`${BASE_URL}questions/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
            body:JSON.stringify(questionDet),
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
                    questionID:responseJson.id,
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
                                <h2 className="headline">Add New Question</h2>
                            </div>
                            <Link to={`/collection/questions`} className="btn btn-info btn-lg">Check Question Collection</Link>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">

                        {/*Content Starts Here*/}

                        <div className="row mt-5">
                            <div className="col">
                                <div className="card shadow">
                                    <div className="card-header bg-transparent">
                                        <h3 className="mb-0">Add New Question</h3>
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

                                            {/*Form for adding Video starts*/}
                                            <div className="col-lg-12">
                                                <form onSubmit={(event) => this.addNewQuestion(event)} ref="form">
                                                    <div className="row">
                                                        <div className="form-group col-lg-12">
                                                            <label>Write Question Here(In English)(If Have any image then insert with img tag).</label>
                                                            <textarea
                                                                type="text"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                id="question"
                                                                name="question"
                                                                value={this.state.question.question}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Question in English"
                                                                rows="5"
                                                            >
                                                            </textarea>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Write Question Here(In Hindi)(If Have any image then insert with img tag).</label>
                                                            <textarea
                                                                type="text"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                id="hindi_question"
                                                                name="hindi_question"
                                                                value={this.state.question.hindi_question}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Question in Hindi"
                                                                rows="5"
                                                            >
                                                            </textarea>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Write Question's Solution Here(In English)(If Have any image then insert with img tag).</label>
                                                            <textarea
                                                                type="text"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                id="solution"
                                                                name="solution"
                                                                value={this.state.question.solution}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Question's Solution in English"
                                                                rows="5"
                                                            >
                                                            </textarea>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Write Question's Solution Here(In Hindi)(If Have any image then insert with img tag).</label>
                                                            <textarea
                                                                type="text"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                id="hindi_solution"
                                                                name="hindi_solution"
                                                                value={this.state.question.hindi_solution}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Question's Solution in Hindi"
                                                                rows="5"
                                                            >
                                                            </textarea>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Question Type</label>
                                                            <select className="form-control form-control-alternative" name="question_type" onChange={(e) => this.onChange(e)} required={true}>
                                                                <option value="1">Single Correct</option>
                                                                <option value="2">Multiple Correct</option>
                                                                <option value="3">Integer Type</option>
                                                                <option value="4">Fill in the Blanks</option>
                                                                <option value="5">True/False</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Difficulty Level</label>
                                                            <select className="form-control form-control-alternative" name="difficulty_level" onChange={(e) => this.onChange(e)} required={true}>
                                                                <option value="1">Easy</option>
                                                                <option value="2">Medium</option>
                                                                <option value="3">Hard</option>
                                                                <option value="4">Expert</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Average Solving Time(In Seconds)</label>
                                                            <input
                                                                type="number"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                id="avg_time"
                                                                name="avg_time"
                                                                value={this.state.question.avg_time}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Average Solving Time(In Seconds)"
                                                            />
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Marks for Correct Answer</label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                id="correct_marks"
                                                                name="correct_marks"
                                                                value={this.state.question.correct_marks}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Marks for Correct Answer"
                                                            />
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Negative Marks for Incorrect Answer</label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                id="negative_marks"
                                                                name="negative_marks"
                                                                value={this.state.question.negative_marks}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Negative Marks for Incorrect Answer"
                                                            />
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Is Negative Marking?</label>
                                                            <select className="form-control form-control-alternative" name="is_negative_marking" onChange={(e) => this.onChange(e)} required={true}>
                                                                <option value="true">Yes</option>
                                                                <option value="false">No</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Subject(To which Question related)</label>
                                                            <select className="form-control form-control-alternative" name="subject" onChange={(e) => this.onChange(e)} required={true}>
                                                                {
                                                                    this.state.all_subjects.map((subject, index)=>(
                                                                        <option value={subject.id} key={index}>{subject.subject_name}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Video related topics</label>
                                                            <select className="form-control form-control-alternative" style={{height:'400px'}} name="topics"  multiple={true} onChange={(e) => this.onChange(e)} required={true}>
                                                                {
                                                                    this.state.all_topics.map((topic, index)=>(
                                                                        <option value={topic.id} key={index}>{topic.topic_title}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <input type="submit" className="btn btn-primary btn-lg" value="Add Now"/>
                                                        </div>
                                                    </div>


                                                </form>
                                            </div>
                                            {/*Form for adding Video ends*/}



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

export default addQuestion;

