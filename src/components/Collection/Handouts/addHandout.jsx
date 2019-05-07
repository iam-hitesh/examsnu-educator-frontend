import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {BASE_URL} from '../../../services/BaseUrl'
import Footer from '../../../layouts/Footer'
import Sidebar from '../../../layouts/Sidebar'
import Navbar from '../../../layouts/Navbar'
import {Link} from 'react-router-dom'
import Loader from '../../../assets/img/loading.gif'


class addHandout extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            isLoading:true,
            error:false,
            message:'',

            handout:[{
                "id":'',
                "subject_id":"",
                "title":"",
                "handout_alt_title":"",
                "description":"",
                "link":"",
            }],

            all_subjects:[
                { id: 0, subject_name: " ", alternative_name: " ", description:" ",is_deleted:false, },
            ],
            all_topics:[
                { id: 0, topic_title: "", is_deleted: false, },
            ],

            newHandoutTopics:'',
        };

        this.onChange = this.onChange.bind(this);
        this.addNewHandout = this.addNewHandout.bind(this);
    }

    componentDidMount() {
        document.title = "Add New Handout - examsnu.in";

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

    onChange = (e) =>{
        e.preventDefault();

        if(e.target.name === 'topics'){
            this.setState({
                newHandoutTopics: [].slice.call(e.target.selectedOptions).map(o => {
                    return o.value;
                })
            });
        }else{
            this.setState({
                handout: {
                    ...this.state.handout, [e.target.name]: e.target.value
                }
            });
        }
    };

    addNewHandout = (e) => {
        this.setState({
            isLoading:true,
        });
        e.preventDefault();

        const formData = new FormData(e.target);
        const handoutDet = {};

        for (let entry of formData.entries()) {
            handoutDet[entry[0]] = entry[1]
        }

        handoutDet['topics'] = this.state.newHandoutTopics;

        fetch(`${BASE_URL}handouts/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
            body:JSON.stringify(handoutDet),
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
                    error:false,
                    message:'Added Successfully, Handout ID is '+responseJson.id+', Add another Video',
                    isLoading:false,
                    handout: {
                        ...this.state.handout, link:'',
                    },
                });
                this.setState({
                    handout: {
                        ...this.state.handout, title: '',
                    },
                });
                this.setState({
                    handout: {
                        ...this.state.handout, handout_alt_title:'',
                    },
                });
                this.setState({
                    handout: {
                        ...this.state.handout, description:'',
                    },
                });
            })
            .catch((error) => {
                this.setState({
                    error:true,
                    isLoading:false,
                    message:'Some Error Occurred',
                })
            });

        this.refs.form.reset();
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
                                <h2 className="headline">Add New Handout</h2>
                            </div>
                            <Link to={`/collection/handouts`} className="btn btn-info btn-lg">Back to Handouts Collection</Link>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">
                        <div className="row">
                            <div className="col">
                                <div className="card shadow">
                                    <div className="card-header bg-transparent">
                                        <h3 className="mb-0">Add New Handout</h3>
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
                                                <div className="margin">
                                                    {this.state.message && this.state.error ? (
                                                        <div className="alert alert-danger" role="alert">
                                                            {this.state.message}
                                                        </div>
                                                    ) : ''}
                                                </div>
                                                <div className="margin">
                                                    {this.state.message && !this.state.error ? (
                                                        <div className="alert alert-info" role="alert">
                                                            {this.state.message}
                                                        </div>
                                                    ) : ''}
                                                </div>

                                                <form onSubmit={(event) => this.addNewHandout(event)} ref="form">
                                                    <div className="row">
                                                        <div className="form-group col-lg-12">
                                                            <label>Handout Title</label>
                                                            <input
                                                                type="text"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                id="title"
                                                                name="title"
                                                                value={this.state.handout.title}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Handout Title"
                                                            />
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Handout Alternative Title</label>
                                                            <input
                                                                type="text"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                id="handout_alt_title"
                                                                name="handout_alt_title"
                                                                value={this.state.handout.handout_alt_title}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Handout Alternative Title"
                                                            />
                                                        </div>

                                                        <div className="form-group col-lg-12">
                                                            <label>Any Link(Youtube/Vimeo/Blog/Medium/Other)</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-alternative"
                                                                id="link"
                                                                name="link"
                                                                value={this.state.handout.link}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Video Link(Youtube/Vimeo)"
                                                            />
                                                        </div>

                                                        <div className="form-group col-lg-12">
                                                            <label>Handout Description</label>
                                                            <textarea
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                name="description"
                                                                onChange={(e) => this.onChange(e)}
                                                                value={this.state.handout.description}
                                                                rows="20"
                                                            >

                                                            </textarea>
                                                        </div>

                                                        <div className="form-group col-lg-12">
                                                            <label>Subject(To which handout related)</label>
                                                            <select className="form-control form-control-alternative" name="subject_id" onChange={(e) => this.onChange(e)} required={true}>
                                                                {
                                                                    this.state.all_subjects.map((subject, index)=>(
                                                                        <option value={subject.id} key={index}>{subject.subject_name}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Handout related topics</label>
                                                            <select className="form-control form-control-alternative" style={{height:'400px'}} name="topics"  multiple={true} onChange={(e) => this.onChange(e)} required={true}>
                                                                {
                                                                    this.state.all_topics.map((topic, index)=>(
                                                                        <option value={topic.id} key={index}>{topic.topic_title}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <input type="submit" className="btn btn-primary btn-lg" value="Add"/>
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


                        {/*Footer*/}
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
};

export default addHandout;

