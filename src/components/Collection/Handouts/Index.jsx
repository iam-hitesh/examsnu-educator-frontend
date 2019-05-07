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


class UpdateHandout extends Component{
    render(){
        return(
            <div className={this.props.modalShow ? "modal fade modelBox show" : "modal fade modelBox hideModal"} role="dialog" aria-labelledby="exampleModalLabel">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Handout</h5>
                            <button type="button" className="close" aria-label="Close">
                                <span aria-hidden="true" onClick={this.props.closeModal}>×</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <form onSubmit={(event, id) => this.props.onSubmit(event, this.props.handout.id)} ref="form">
                                <div className="row">
                                    <div className="form-group col-lg-12">
                                        <label>Handout Title</label>
                                        <input
                                            type="text"
                                            required={true}
                                            className="form-control form-control-alternative"
                                            id="title"
                                            name="title"
                                            value={this.props.handout.title}
                                            onChange={(e) => this.props.onChange(e)}
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
                                            value={this.props.handout.handout_alt_title}
                                            onChange={(e) => this.props.onChange(e)}
                                            placeholder="Handout Alternative Title"
                                        />
                                    </div>

                                    <div className="form-group col-lg-12">
                                        <label>Handout Link(Youtube/Vimeo)</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-alternative"
                                            id="link"
                                            name="link"
                                            value={this.props.handout.link}
                                            onChange={(e) => this.props.onChange(e)}
                                            placeholder="Handout Link(Youtube/Vimeo/Blog/Medium)"
                                        />
                                    </div>

                                    <div className="form-group col-lg-12">
                                        <label>Handout Description</label>
                                        <textarea
                                            className="form-control form-control-alternative"
                                            name="description"
                                            onChange={(e) => this.props.onChange(e)}
                                            value={this.props.handout.description}
                                            rows="20"
                                        >

                                                            </textarea>
                                    </div>

                                    <div className="form-group col-lg-12">
                                        <label>Subject(To which handout related)</label>
                                        <select className="form-control form-control-alternative" name="subject_id" onChange={(e) => this.props.onChange(e)} required={true}>
                                            <option value={this.props.handout.subject_id}>{this.props.handout.subject}</option>
                                            {
                                                this.props.all_subjects.map((subject, index)=>(
                                                    <option value={subject.id} key={index}>{subject.subject_name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Is Deleted?</label>
                                        <select className="form-control form-control-alternative" name="is_deleted" onChange={this.props.onChange} defaultValue={this.props.handout.is_deleted ? 'true' : 'false'}>
                                            <option value={this.props.handout.is_deleted ? 'true' : 'false'}>{this.props.handout.is_deleted ? "Yes" : "No"}</option>
                                            <option value='true'>Yes</option>
                                            <option value='false'>No</option>
                                        </select>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Handout related topics(Left Unselected if need to not any changes)</label>
                                        <select className="form-control form-control-alternative" style={{height:'400px'}} name="topics"  multiple={true} onChange={(e) => this.props.onChange(e)} required={true}>
                                            {
                                                this.props.all_topics.map((topic, index)=>(
                                                    <option value={topic.id} key={index} selected={true}>{topic.topic_title}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <input type="submit" className="btn btn-primary btn-lg" value="Update"/>
                                    </div>
                                </div>
                            </form>

                        </div>
                        {/*<div className="modal-footer">*/}
                        {/*<button type="button" className="btn btn-secondary" onClick={this.props.closeModal}>Close</button>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        )
    }
}

class Handouts extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            isLoading:true,
            error:false,
            message:'',
            page:1,
            openModal:false,

            handouts:[{"id":1,"topics":[{"id":2,"topic_title":"Geography"},{"id":1,"topic_title":"History"}],"subject":"General Knowledge","subject_id":1,"created_by":"Hitesh Yadav","created_by_id":1,"title":"Maths - 1","handout_alt_title":"Maths - 1","description":"This is Just a trial Methodd","link":"http://google.com","is_deleted":false}],

            all_subjects:[
                { id: 0, subject_name: " ", alternative_name: " ", description:" ",is_deleted:false, },
            ],
            all_topics:[
                { id: 0, topic_title: "", is_deleted: false, },
            ],
            updateHandout:[{"id":1,"topics":[{"id":2,"topic_title":"Geography"},{"id":1,"topic_title":"History"}],"subject":"General Knowledge","subject_id":1,"created_by":"Hitesh Yadav","created_by_id":1,"title":"Maths - 1","handout_alt_title":"Maths - 1","description":"This is Just a trial Methodd","link":"http://google.com","is_deleted":false}],
            updateHandoutTopics:[],
        };

        this.changePage = this.changePage.bind(this);
        this.searchHandouts = this.searchHandouts.bind(this);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onUpdateChanges = this.onUpdateChanges.bind(this);
        this.updateHandout = this.updateHandout.bind(this);
    }

    componentDidMount() {
        document.title = "Handouts Collection - examsnu.in";
        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}handouts/?page=`+this.state.page, {
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
                        })
                    })
                    .catch((error) => {
                        this.setState({

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
        fetch(`${BASE_URL}handouts/?page=`+page, {
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
    openModal = (event, id) =>{
        this.setState({
            openModal : !this.state.openModal,
            updateHandout: this.state.handouts[id],
        });
    };
    closeModal = () => {
        this.setState({
            openModal : !this.state.openModal,
        });
    };
    onUpdateChanges = (e) =>{
        e.preventDefault();

        if(e.target.name === 'topics'){
            this.setState({
                updateHandoutTopics: [].slice.call(e.target.selectedOptions).map(o => {
                    return o.value;
                })
            });
        }else{
            this.setState({
                updateHandout: {
                    ...this.state.updateHandout, [e.target.name]: e.target.value
                }
            });
        }
    };
    updateHandout = (e, id) =>{
        this.setState({
            isLoading:true,
        });
        e.preventDefault();

        const formData = new FormData(e.target);
        const handoutDet = {};

        for (let entry of formData.entries()) {
            handoutDet[entry[0]] = entry[1]
        }
        handoutDet['handout_id'] = id;
        let topics = [];

        if(this.state.updateHandoutTopics.length === 0){
            for(let i=0;i<this.state.updateHandout.topics.length;i++){
                topics.push(this.state.updateHandout.topics[i].id)
            }
        }else{
            topics = this.state.updateHandoutTopics;
        }

        handoutDet['topics'] = topics;

        fetch(`${BASE_URL}handouts/`, {
            method: "PUT",
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
                    handouts: responseJson,
                    isLoading:false,
                    openModal:false,
                    page:1,
                    updateHandout:'',
                    updateHandoutTopics:[],
                });
            })
            .catch((error) => {
                this.setState({
                    error:true,
                    isLoading:false,
                    message:'Some Error Occurred',
                })
            });
        console.log(JSON.stringify(handoutDet))
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
                                <h2 className="headline">Handouts Collection</h2>
                            </div>
                            <Link to={`/collection/handout/add`} className="btn btn-info btn-lg">Add New Handout</Link>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">

                        {/*Content Starts Here*/}

                        <div className="row mt-5">
                            <div className="col">
                                <div className="card bg-default shadow">
                                    <div className="card-header bg-transparent border-0">
                                        <h3 className="text-white mb-0">Handouts Collection</h3>
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
                                                onChange={this.searchHandouts}
                                            />
                                        </div>
                                    </div>

                                    {/*Warning Message*/}
                                    <div className="margin">
                                        {this.state.message ? (
                                            <div className="alert alert-danger" role="alert">
                                                {this.state.message}
                                            </div>
                                        ) : ''}
                                    </div>

                                    {/*UpdateHandout Modal*/}
                                    <UpdateHandout
                                        modalShow={this.state.openModal}
                                        closeModal={this.closeModal}
                                        handout={this.state.updateHandout}
                                        onChange={this.onUpdateChanges}
                                        onSubmit={this.updateHandout}
                                        all_subjects={this.state.all_subjects}
                                        all_topics={this.state.all_topics}
                                    />

                                    {/*Loader*/}
                                    <div className="loader-justify">
                                        <img
                                            src={Loader}
                                            className={!this.state.isLoading ? "hideBox" : "loader"}
                                            alt="Loader"
                                        />
                                    </div>

                                    {/*Handouts Table*/}
                                    <div className="table-responsive">
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
                                                            <span className={handout.is_deleted ? "mb-0 text-sm text-danger" : "mb-0 text-sm text-success"} onClick={(event, id) =>this.openModal(event, index)}>{cutString(handout.title, 30)}</span>
                                                        </th>
                                                        <td>
                                                            <a href={handout.link} target="_blank" rel="noopener noreferrer">Any Link</a>
                                                        </td>
                                                        <td>
                                                            {handout.subject}
                                                        </td>
                                                        <td>
                                                            <div>
                                                                {
                                                                    handout.topics.map((topic, handindex) => (
                                                                        <div>
                                                                            <span className="badge badge-pill badge-success text-white" key={handindex}>{topic.topic_title}</span>
                                                                            <br/>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {handout.created_by}
                                                        </td>
                                                        <td>
                                                            {Moment(handout.created_at).format('MMMM Do YYYY')}
                                                        </td>
                                                        <td>
                                                            <button type="button" className="btn btn-info btn-sm delete-btn" onClick={(event, id) =>this.openModal(event, index)}>Edit</button>
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

export default Handouts;

