import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {BASE_URL} from '../../services/BaseUrl'
import Footer from '../../layouts/Footer'
import Sidebar from '../../layouts/Sidebar'
import Navbar from '../../layouts/Navbar'
import {Link} from 'react-router-dom'
import Loader from '../../assets/img/loading.gif'

class EditTopics extends Component{
    render(){
        return(
            <div className={this.props.modalShow ? "modal fade modelBox show" : "modal fade modelBox hideModal"} role="dialog" aria-labelledby="exampleModalLabel">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Topics</h5>
                            <button type="button" className="close" aria-label="Close">
                                <span aria-hidden="true" onClick={this.props.closeModal}>×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e, id) => this.props.onSubmit(e, this.props.topic.id)}>
                                <div className="row">
                                    <div className="form-group col-lg-12">
                                        <label>Topic Title</label>
                                        <input type="text" required={true} className="form-control form-control-alternative" id="topic_title" name="topic_title" value={this.props.topic.topic_title} placeholder="Topic Title" onChange={this.props.onChange}/>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Is Deleted?</label>
                                        <select className="form-control form-control-alternative" name="is_deleted" onChange={this.props.onChange}>
                                            <option value={this.props.topic.is_deleted ? 'true' : 'false'}>{this.props.topic.is_deleted ? "Yes" : "No"}</option>
                                            <option value='true'>Yes</option>
                                            <option value='false'>No</option>
                                        </select>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <button className="btn btn-primary" value="Update">Update</button>
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
};

class Topics extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            topics : [
                { id: 0, topic_title: "", is_deleted: false, },
            ],
            isLoading:true,
            error:false,
            message:'',
            openModal:false,

            newTopic:'',

            updateTopic:'',
        };

        this.newTopicName = this.newTopicName.bind(this);
        this.addNewTopic = this.addNewTopic.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onUpdateChanges = this.onUpdateChanges.bind();
        this.updateTopic = this.updateTopic.bind(this);
    }

    componentDidMount() {
        document.title = "All Question Topics - EXAMSNU.IN";
        if (this.state.isAuthenticated) {
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
                .then((responseJson) => {
                    this.setState({
                        topics:responseJson,
                        isLoading:false,
                    })
                })
                .catch((error) => {
                    this.setState({
                        error:true,
                        isLoading:false,
                        message:"Some Error Occurred",
                    })
                });
        }
    };

    newTopicName = (e) => {
        this.setState({
            newTopic:e.target.value,
        })
    }

    addNewTopic = (event) => {
        this.setState({
            isLoading:true,
        })
        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}topics/`, {
                method: "POST",
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
                },
                body:JSON.stringify({
                    topic_title:this.state.newTopic,
                }),
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
                        topics:responseJson,
                        isLoading:false,
                        newTopic:'',
                    })
                })
                .catch((error) => {
                    this.setState({
                        error:true,
                        isLoading:false,
                        message:"Some Error Occurred",
                    })
                });
        };

        return false;
    };

    openModal = (event, id) => {
        this.setState({
            openModal : !this.state.openModal,
            updateTopic: this.state.topics[id],
        });
    };

    closeModal = (event) => {
        this.setState({
            openModal : !this.state.openModal,
        });
    };

    onUpdateChanges = (e) => {
        e.preventDefault();

        this.setState({
            updateTopic: {
                ...this.state.updateTopic, [e.target.name]: e.target.value
            }
        });
    };

    updateTopic = (event, id) =>{
        this.setState({
            isLoading:true,
        });
        event.preventDefault();

        const formData = new FormData(event.target);
        const topicDet = {};

        for (let entry of formData.entries()) {
            topicDet[entry[0]] = entry[1]
        }

        topicDet['topic_id'] = id;

        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}topics/`, {
                method: "PUT",
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
                },
                body:JSON.stringify(topicDet),
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
                        topics:responseJson,
                        isLoading:false,
                        openModal:false,
                        updateCategory:'',
                    });
                    this.setState(this.state);
                })
                .catch((error) => {
                    this.setState({
                        error:true,
                        isLoading:false,
                        openModal:false,
                        message:'Some Error Occurred',
                    })
                });
        };

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
                                <h2 className="headline">All Questions Topics</h2>
                            </div>
                            <Link to={`/tools`} className="btn btn-info btn-lg">Other Tools</Link>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">
                        <div className="row">
                            <div className="col">
                                <div className="card shadow">
                                    <div className="card-header bg-transparent">
                                        <h3 className="mb-0">All Questions Topics</h3>
                                        <p><span className="text-danger">Red = Deactivated</span><br/><span className="text-success">Green = Activated</span></p>
                                    </div>
                                    <div className="margin">
                                        {this.state.message ? (
                                            <div className="alert alert-danger" role="alert">
                                                {this.state.message}
                                            </div>
                                        ) : ''}
                                    </div>

                                    {/*Loader*/}
                                    <div className="loader-justify">
                                        <img
                                            src={Loader}
                                            className={!this.state.isLoading ? "hideBox" : "loader"}
                                            alt="Loader"
                                        />
                                    </div>


                                    {/*Modal for Updating Subject Details*/}
                                    <EditTopics
                                        modalShow={this.state.openModal}
                                        closeModal={this.closeModal}
                                        topic={this.state.updateTopic}
                                        onChange={this.onUpdateChanges}
                                        onSubmit={this.updateTopic}
                                    />


                                    <div  className={this.state.isLoading ? "card-body hideBox" : "card-body"}>
                                        <div className="row icon-examples">
                                            {
                                                this.state.topics.map((topic, index) => (

                                                        <div className="col-lg-3 col-md-6" key={index}>
                                                            <div className={!topic.is_deleted ? "btn-icon-clipboard text-success text-uppercase" : "btn-icon-clipboard text-danger text-uppercase"} title={topic.topic_title}>
                                                                <div>
                                                                    {topic.topic_title}
                                                                </div>
                                                                <br/>
                                                                <button type="button" className="btn btn-danger btn-sm" onClick={(event, id) => this.openModal(event, index)}>Edit</button>
                                                            </div>
                                                        </div>
                                                    )
                                                )
                                            }


                                            <div className="col-lg-3 col-md-6">
                                                <div className="btn-icon-clipboard" title="Add New Category">
                                                    <input type="text" required className="form-control form-control-alternative" id="topic_title" value={this.state.newTopic} onChange={(e) => this.newTopicName(e)} placeholder="New Topic title" />
                                                    <br/>
                                                    <button type="button" className="btn btn-primary btn-sm" onClick={(event) => this.addNewTopic(event)}>Add Now</button>
                                                </div>
                                            </div>


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

export default Topics;

