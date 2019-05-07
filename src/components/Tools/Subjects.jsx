import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {BASE_URL} from '../../services/BaseUrl'
import Footer from '../../layouts/Footer'
import Sidebar from '../../layouts/Sidebar'
import Navbar from '../../layouts/Navbar'
import {Link} from 'react-router-dom'
import Loader from '../../assets/img/loading.gif'

class EditSubject extends Component{
    render(){
        return(
            <div className={this.props.modalShow ? "modal fade modelBox show" : "modal fade modelBox hideModal"} role="dialog" aria-labelledby="exampleModalLabel">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Subject</h5>
                            <button type="button" className="close" aria-label="Close">
                                <span aria-hidden="true" onClick={this.props.closeModal}>×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e, id) => this.props.updateSubject(e, this.props.subject.id)}>
                                <div className="row">
                                    <div className="form-group col-lg-12">
                                        <label>Subject Name</label>
                                        <input type="text" required={true} className="form-control form-control-alternative" id="subject_name" name="subject_name" value={this.props.subject.subject_name} placeholder="Subject Name" onChange={this.props.onChange}/>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Alternative Name</label>
                                        <input type="text" required={true} className="form-control form-control-alternative" id="alternative_name" name="alternative_name" value={this.props.subject.alternative_name} placeholder="Alternative Name"  onChange={this.props.onChange}/>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Description</label>
                                        <textarea type="text" required={true} className="form-control form-control-alternative" id="description" name="description" value={this.props.subject.description} placeholder="description"  onChange={this.props.onChange}>{this.props.subject.description}</textarea>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Is Deleted?</label>
                                        <select className="form-control form-control-alternative" name="is_deleted" onChange={this.props.onChange}>
                                            <option value={this.props.subject.is_deleted ? 'true' : 'false'}>{this.props.subject.is_deleted ? "Yes" : "No"}</option>
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

class Subjects extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            subjects : [
                { id: 0, subject_name: " ", alternative_name: " ", description:" ",is_deleted:false, },
            ],
            isLoading:true,
            error:false,
            message:'',
            openModal:false,

            newSubject:'',
            alternativeName:'',
            description:'',

            updateSubject:'',
            subject_id:'',
        };

        this.newSubjectName = this.newSubjectName.bind(this);
        this.subjectalternativeName = this.subjectalternativeName.bind(this);
        this.subjectDescription = this.subjectDescription.bind(this);
        this.addNewSubject = this.addNewSubject.bind(this);
        this.updateSubject = this.updateSubject.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onUpdateChanges = this.onUpdateChanges.bind(this);

    }

    componentDidMount() {
        document.title = "Subjects - EXAMSNU.IN";
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
                .then((responseJson) => {
                    this.setState({
                        subjects:responseJson,
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

    newSubjectName = (e) => {
        this.setState({
            newSubject:e.target.value,
        })
    }
    subjectalternativeName = (e) =>{
        this.setState({
            alternativeName:e.target.value,
        })
    }

    subjectDescription = (e) =>{
        this.setState({
            description:e.target.value,
        })
    }

    addNewSubject = (event) => {
        this.setState({
            isLoading:true,
        })
        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}subjects/`, {
                method: "POST",
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
                },
                body:JSON.stringify({
                    subject_name:this.state.newSubject,
                    alternative_name: this.state.alternativeName,
                    description: this.state.description,
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
                        subjects:responseJson,
                        isLoading:false,
                        newSubject:'',
                        alternativeName:'',
                        description:'',
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
        this.setState({
            subject_name:'',
            alternative_name:'',
            description:'',
        });

        return false;
    };

    openModal = (event, id) => {
        this.setState({
            openModal : !this.state.openModal,
            updateSubject: this.state.subjects[id],
            subject_id: this.state.subjects[id].id,
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
            updateSubject: {
                ...this.state.updateSubject, [e.target.name]: e.target.value
            }
        });
    };

    updateSubject = (event, id) => {
        this.setState({
            isLoading:true,
        });
        event.preventDefault();

        const formData = new FormData(event.target);
        const subjectDet = {};

        for (let entry of formData.entries()) {
            subjectDet[entry[0]] = entry[1]
        }

        subjectDet['subject_id'] = this.state.subject_id;

        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}subjects/`, {
                method: "PUT",
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
                },
                body:JSON.stringify(subjectDet),
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
                        subjects:responseJson,
                        isLoading:false,
                        openModal:false,
                        updateSubject:'',
                        subject_id:'',
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
                                <h2 className="headline">Different Subjects</h2>
                            </div>
                            <Link to={`/tools`} className="btn btn-info btn-lg">Other Tools</Link>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">
                        <div className="row">
                            <div className="col">
                                <div className="card shadow">
                                    <div className="card-header bg-transparent">
                                        <h3 className="mb-0">Subjects</h3>
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
                                    <EditSubject
                                        modalShow={this.state.openModal}
                                        closeModal={this.closeModal}
                                        subject={this.state.updateSubject}
                                        onChange={this.onUpdateChanges}
                                        updateSubject={this.updateSubject}
                                    />

                                    <div  className={this.state.isLoading ? "card-body hideBox" : "card-body"}>
                                        <div className="row icon-examples">
                                            {
                                                this.state.subjects.map((subject, index) => (


                                                    <div className="col-lg-4 box-shadow" key={index}>
                                                        <div className="card shadow border-0">
                                                            <div className="card-body py-5">
                                                                <h2 className={!subject.is_deleted ? "text-success text-uppercase" : "text-danger text-uppercase"}>{subject.subject_name}</h2>
                                                                <h6 className={!subject.is_deleted ? "text-success text-uppercase" : "text-danger text-uppercase"}>({subject.alternative_name})</h6>

                                                                <p className="description mt-3">{subject.description}</p>

                                                                <button type="button" className="btn btn-danger btn-sm" onClick={(event, id) => this.openModal(event, index)}>Edit</button>
                                                            </div>
                                                        </div>
                                                    </div>


                                                    )
                                                )
                                            }

                                            <div className="col-lg-4 box-shadow">
                                                <div className="card shadow border-0">
                                                    <div className="card-body py-5">


                                                        <div className="row">
                                                            <div className="form-group col-lg-12">
                                                                <input type="text" required={true} className="form-control form-control-alternative" id="category_name" value={this.state.newSubject} onChange={(e) => this.newSubjectName(e)} placeholder="New Subject name" />
                                                            </div>
                                                            <div className="form-group col-lg-12">
                                                                <input type="text" required={true} className="form-control form-control-alternative" id="alternative_name" value={this.state.alternativeName} onChange={(e) => this.subjectalternativeName(e)} placeholder="Alternative Name" />
                                                            </div>
                                                            <div className="form-group col-lg-12">
                                                                <input type="text" required={true} className="form-control form-control-alternative" id="description" value={this.state.description} onChange={(e) => this.subjectDescription(e)} placeholder="Description" />
                                                            </div>
                                                            <div className="form-group col-lg-12">
                                                                <button type="button" className="btn btn-primary btn-sm" onClick={(event) => this.addNewSubject(event)}>Add Now</button>
                                                            </div>
                                                        </div>


                                                    </div>
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

export default Subjects;

