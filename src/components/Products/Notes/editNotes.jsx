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

class editNotes extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            isLoading:true,
            error:false,
            message:'',

            notes:[{id:1,exam:"Air Force Common Admission Test",exam_id:1,videos:[{id:1,title:"Maths - 1"}],created_by:"Hitesh Yadav",created_by_id:1,title:"Video - 1",alt_title_video:"V1",is_active:true,active_on:"2019-04-04T00:00:00+05:30",is_deleted:false}],

            handouts:[{"id":1,"topics":[{"id":2,"topic_title":"Geography"},{"id":1,"topic_title":"History"}],"subject":"General Knowledge","subject_id":1,"created_by":"Hitesh Yadav","created_by_id":1,"title":"Maths - 1","video_alt_title":"Maths - 1","description":"This is Just a trial Methodd","link":"http://google.com","created_at":"2019-03-06T10:34:25.860953+05:30","updated_at":"2019-03-06T10:34:25.868162+05:30","is_deleted":false}],
        };

        this.onChange = this.onChange.bind(this);
        this.searchHandouts = this.searchHandouts.bind(this);
        this.addHandout = this.addHandout.bind(this);
        this.deleteHandout = this.deleteHandout.bind(this);

    }

    componentDidMount() {
        document.title = "Update Notes - examsnu.in";

        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}note/?id=${this.props.match.params.note_id}`, {
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
                        notes:responseJson,
                        isLoading:false,
                        notesID:this.props.match.params.note_id,
                    })
                })
                .catch((error) => {
                    this.setState({
                        error:true,
                        isLoading:false,
                        message:'Some Error Occurred',
                    })
                });

            fetch(`${BASE_URL}handouts/?is_deleted=0&page=1`, {
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
                        handouts:responseJson,
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
    searchHandouts = (event) =>{
        this.setState({
            isLoading:true,
        });
        fetch(`${BASE_URL}searchHandout/?search=`+event.target.value, {
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
                    handouts:responseJson,
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

    addHandout = (event, handout_id) => {
        fetch(`${BASE_URL}note/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
            body:JSON.stringify({
                'note_id':this.props.match.params.note_id,
                'handout_id':handout_id,
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
                    notes:responseJson,
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
    deleteHandout = (e, handout_id) => {
        fetch(`${BASE_URL}note/`, {
            method: "PUT",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
            body:JSON.stringify({
                'note_id':this.props.match.params.note_id,
                'handout_id':handout_id,
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
                    notes:responseJson,
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
                                <h2 className="headline">Update Notes</h2>
                            </div>
                            <Link to={`/product/notes`} className="btn btn-info btn-lg">Check Notes Collection</Link>
                            <Link to={`/product/note`} className="btn btn-warning btn-lg">Create Notes</Link>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">

                        {/*Content Starts Here*/}

                        <div className="row mt-5">
                            <div className="col">
                                <div className="card shadow">
                                    <div className="card-header bg-transparent">
                                        <h3 className="mb-0">Update Notes</h3>
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
                                                <Link to={`/product/note/view/${this.props.match.params.note_id}`} className="btn btn-primary btn-sm">Edit Notes Details</Link>
                                                <div className="col-lg-12 box-shadow">
                                                    <div className="card shadow border-0">
                                                        <div className="card-body">

                                                            <h3 className="mt-0 mb-5"><b>Notes Title.)  </b>{this.state.notes.title}</h3>

                                                            <span>
                                                                {
                                                                    this.state.notes.notes ? (
                                                                        <div className="input-radio">
                                                                            {
                                                                                this.state.notes.notes.map((note, index) => (
                                                                                    <div key={index}>
                                                                                        <div className="radiobtn">

                                                                                            <label for={note.id}>
                                                                                                ({note.id}) <a href={note.link} className="mt-5 text-blue" target="_BLANK" rel="noopener noreferrer">{note.title}</a>
                                                                                                <br/>
                                                                                                <button className="btn btn-danger btn-sm" onClick={(e, id) => this.deleteHandout(e, note.id)}>Remove Handout</button>
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
                                                    onChange={this.searchHandouts}
                                                />
                                            </div>
                                        </div>
                                        <table className="table align-items-center table-dark table-flush">
                                            <thead className="thead-dark">
                                            <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col">Title</th>
                                                <th scope="col">Link</th>
                                                <th scope="col">Subject</th>
                                                <th scope="col">Topics</th>
                                                <th scope="col">Created By</th>
                                                <th scope="col">Created At</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>


                                            {/*Content Repeat and Loop Starts Here*/}
                                            {
                                                this.state.handouts.map((handout, index) => (
                                                    <tr key={index}>
                                                        <th scope="row">
                                                            <span className="mb-0 text-sm">{handout.id}</span>
                                                        </th>
                                                        <th scope="row">
                                                            <span className={handout.is_deleted ? "mb-0 text-sm text-danger" : "mb-0 text-sm text-success"} dangerouslySetInnerHTML={{__html: cutString(handout.title, 30)}}></span>
                                                        </th>
                                                        <th scope="row">
                                                            <a href={handout.link} target="_BLANK" rel="noopener noreferrer">link</a>
                                                        </th>
                                                        <th scope="row">
                                                            {handout.subject}
                                                        </th>
                                                        <th scope="row">
                                                            <div>
                                                                {
                                                                    handout.topics.map((topic, index) => (
                                                                        <div key={index}>
                                                                            <span className="badge badge-pill badge-success text-white" key={index}>{topic.topic_title}</span>
                                                                            <br/>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </th>
                                                        <td>
                                                            <Link to={`/author/${handout.created_by_id}`}>{handout.created_by}</Link>
                                                        </td>
                                                        <td>
                                                            {Moment(handout.created_at).format('MMMM Do YYYY')}
                                                        </td>
                                                        <td>
                                                            {handout.is_deleted ? "" : (<button type="button" className="btn btn-info btn-sm delete-btn" onClick={(event, id) =>this.addHandout(event, handout.id)}>Add Handout</button>)}
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

export default editNotes;

