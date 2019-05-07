import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {BASE_URL} from '../../services/BaseUrl'
import Footer from '../../layouts/Footer'
import Sidebar from '../../layouts/Sidebar'
import Navbar from '../../layouts/Navbar'
import {Link} from 'react-router-dom'
import Loader from '../../assets/img/loading.gif'


class EditExam extends Component{
    render(){
        return(
            <div className={this.props.modalShow ? "modal fade modelBox show" : "modal fade modelBox hideModal"} role="dialog" aria-labelledby="exampleModalLabel">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Exam</h5>
                            <button type="button" className="close" aria-label="Close">
                                <span aria-hidden="true" onClick={this.props.closeModal}>×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e, id) => this.props.onSubmit(e, this.props.exam.id)}>
                                <div className="row">
                                    <div className="form-group col-lg-12">
                                        <label>Exam Name</label>
                                        <input type="text" required={true} className="form-control form-control-alternative" id="exam_name" name="exam_name" value={this.props.exam.exam_name} placeholder="Plan Name" onChange={this.props.onChange}/>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Alternative Name</label>
                                        <input type="text" required={true} className="form-control form-control-alternative" id="alternative_name" name="alternative_name" value={this.props.exam.alternative_name} placeholder="Alternative Name"  onChange={this.props.onChange}/>
                                    </div>
                                    
                                    <div className="form-group col-lg-12">
                                        <label>Subjects(Left Unchanged if need no changes)</label>
                                        <select className="form-control form-control-alternative" name="subjects" required={true} multiple={true} onChange={this.props.onChange}>
                                            {
                                                this.props.all_subjects.map((subject, index)=>(
                                                    <option value={subject.id} key={index} selected={true}>{subject.subject_name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Exam Category</label>
                                        <select className="form-control form-control-alternative" name="exam_category" required={true} onChange={this.props.onChange}>
                                            <option value={this.props.exam.exam_category_id}>{this.props.exam.exam_category}</option>
                                            {
                                                this.props.all_exam_categories.map((category, index)=>(
                                                    <option value={category.id} key={index}>{category.category_name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Is Deleted?</label>
                                        <select className="form-control form-control-alternative" name="is_deleted" onChange={this.props.onChange}>
                                            <option value={this.props.exam.is_deleted ? 'true' : 'false'}>{this.props.exam.is_deleted ? "Yes" : "No"}</option>
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
}


class Exams extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            exams : [
                { id: 0, exam_category: "", subjects: [{ id: 0, subject_name: " ", alternative_name: " ", description:" " },],exam_name:"",alternative_name:"",is_deleted:"" },
            ],
            all_exam_categories:[
                { id: 0, category_name: "", alternative_name: "",is_deleted:"" },
            ],
            all_subjects : [
                { id: 0, subject_name: " ", alternative_name: " ", description:" ",is_deleted:"" },
            ],

            isLoading:true,
            error:false,
            message:'',
            openModal:false,

            newExam:'',
            newExamAlternativeName:'',
            newExamSubjects:'',

            updateExam:'',
            updatedExamSubjects:'',
        };

        this.newExamName = this.newExamName.bind(this);
        this.newExamAlternativeName = this.newExamAlternativeName.bind(this);
        this.newExamSubjects = this.newExamSubjects.bind(this);

        this.addNewExam = this.addNewExam.bind(this);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onUpdateChanges = this.onUpdateChanges.bind(this);
        this.updateExam = this.updateExam.bind(this);
    }

    componentDidMount() {
        document.title = "All Available Exams - EXAMSNU.IN";
        if (this.state.isAuthenticated) {
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
                    // This is for Calling all available exam categories
                    fetch(`${BASE_URL}exams-category/`, {
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
                        .then((categoryJson) => {
                            // This is for fetching all available subjects
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
                                    this.setState({
                                        all_exam_categories:categoryJson,
                                        all_subjects:subjectJson,
                                        exams:responseJson,
                                        isLoading:false,
                                    })
                                })
                                .catch((error) => {
                                    this.setState({
                                        error:true,
                                        isLoading:false,
                                        message:error.message,
                                    })
                                });
                        })
                        .catch((error) => {
                            this.setState({
                                error:true,
                                isLoading:false,
                                message:error.message,
                            })
                        });


                })
                .catch((error) => {
                    this.setState({
                        error:true,
                        isLoading:false,
                        message: error.message,
                    })
                });
        }
    };

    newExamName = (e) => {
        this.setState({
            newExam:e.target.value,
        })
    }
    newExamAlternativeName = (e) =>{
        this.setState({
            newExamAlternativeName:e.target.value,
        })
    };
    newExamSubjects = (e) => {
        this.setState({
            newExamSubjects: [].slice.call(e.target.selectedOptions).map(o => {
                return o.value;
            })
        });
    };


    addNewExam = (event) => {
        this.setState({
            isLoading:true,
        });
        event.preventDefault();

        const formData = new FormData(event.target);
        const examDet = {};

        for (let entry of formData.entries()) {
            examDet[entry[0]] = entry[1]
        }
        examDet['subject_list'] = this.state.newExamSubjects;

        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}exams/`, {
                method: "POST",
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
                },
                body:JSON.stringify(examDet),
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
                        exams:responseJson,
                        isLoading:false,
                    })
                })
                .catch((error) => {
                    this.setState({
                        error:true,
                        isLoading:false,
                        message:error.message,
                    })
                });
        };
        this.setState({
            newExam:'',
            newExamAlternativeName:'',
            newExamSubjects:'',
        });

        this.refs.form.reset();
        return false;
    };

    openModal = (event, id) => {
        this.setState({
            openModal : !this.state.openModal,
            updateExam: this.state.exams[id],
        });
    };

    closeModal = (event) => {
        this.setState({
            openModal : !this.state.openModal,
        });
    };

    onUpdateChanges = (e) => {
        e.preventDefault();

        if(e.target.name === 'subjects'){
            this.setState({
                updatedExamSubjects: [].slice.call(e.target.selectedOptions).map(o => {
                    return o.value;
                })
            });
        }else{
            this.setState({
                updateExam: {
                    ...this.state.updateExam, [e.target.name]: e.target.value
                }
            });
        }
    };

    updateExam = (e, id) => {
        this.setState({
            isLoading:true,
        });
        e.preventDefault();

        const formData = new FormData(e.target);
        const examDet = {};

        for (let entry of formData.entries()) {
            examDet[entry[0]] = entry[1]
        }

        let subjects = [];

        if(!this.state.updatedExamSubjects){
            for(let i=0;i<this.state.updateExam.subjects.length;i++){
                subjects.push(this.state.updateExam.subjects[i].id)
            }
        }else{
            subjects = this.state.updatedExamSubjects;
        }

        examDet['exam_id'] = id;
        examDet['subjects'] = subjects;

        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}exams/`, {
                method: "PUT",
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
                },
                body:JSON.stringify(examDet),
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
                        exams:responseJson,
                        isLoading:false,
                        openModal:false,
                        updateExam:'',
                        updatedExamSubjects:'',
                    })
                })
                .catch((error) => {
                    this.setState({
                        error:true,
                        isLoading:false,
                        openModal:false,
                        message:'Some Error Occurred',
                    })
                });
        }
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
                                <h2 className="headline">All Available Exams</h2>
                            </div>
                            <Link to={`/tools`} className="btn btn-info btn-lg">Other Tools</Link>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">
                        <div className="row">
                            <div className="col">
                                <div className="card shadow">
                                    <div className="card-header bg-transparent">
                                        <h3 className="mb-0">Exams</h3>
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


                                    {/*Modal for Updating Exam Details*/}
                                    <EditExam
                                        modalShow={this.state.openModal}
                                        closeModal={this.closeModal}
                                        exam={this.state.updateExam}
                                        onChange={this.onUpdateChanges}
                                        onSubmit={this.updateExam}
                                        all_subjects={this.state.all_subjects}
                                        all_exam_categories={this.state.all_exam_categories}
                                    />

                                    <div  className={this.state.isLoading ? "card-body hideBox" : "card-body"}>
                                        <div className="row icon-examples">
                                            {
                                                this.state.exams.map((exam, index) => (

                                                    <div className="col-lg-4 box-shadow" key={index}>
                                                        <div className="card shadow border-0">
                                                            <div className="card-body py-5">
                                                                <h2 className={!exam.is_deleted ? "text-success text-uppercase" : "text-danger text-uppercase"}>{exam.exam_name}</h2>
                                                                <h6 className={!exam.is_deleted ? "text-success text-uppercase" : "text-danger text-uppercase"}>({exam.exam_category})</h6>
                                                                <div>

                                                                    {
                                                                        this.state.exams[index].subjects.map((subject, sub_index)=>(
                                                                            <span className={!exam.is_deleted ? "badge badge-pill badge-success" : "badge badge-pill badge-danger"} key={sub_index}>
                                                                                {subject.subject_name}
                                                                            </span>
                                                                        ))
                                                                    }

                                                                </div>
                                                                <button type="button" className="btn btn-primary btn-sm delete-btn" onClick={(event, id) => this.openModal(event, index)}>Edit</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    )
                                                )
                                            }


                                            <div className="col-lg-4 box-shadow">
                                                <div className="card shadow border-0">
                                                    <div className="card-body py-5">


                                                        <form onSubmit={(event) => this.addNewExam(event)} ref="form">
                                                            <div className="row">
                                                                <div className="form-group col-lg-12">
                                                                    <input type="text" required={true} className="form-control form-control-alternative" id="exam_name" name="exam_name" value={this.state.newExam} onChange={(e) => this.newExamName(e)} placeholder="Exam Name"/>
                                                                </div>
                                                                <div className="form-group col-lg-12">
                                                                    <input type="text" required={true} className="form-control form-control-alternative" id="alternative_name" name="alternative_name" value={this.state.newExamAlternativeName} onChange={(e) => this.newExamAlternativeName(e)} placeholder="Alternative Name" />
                                                                </div>
                                                                <div className="form-group col-lg-12">
                                                                    <select className="form-control form-control-alternative" name="exam_category" required={true}>
                                                                        {
                                                                            this.state.all_exam_categories.map((category, index)=>(
                                                                                <option value={category.id} key={index}>{category.category_name}</option>
                                                                            ))
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <div className="form-group col-lg-12">
                                                                    <select className="form-control form-control-alternative" name="subject_list"  multiple={true} onChange={(e) => this.newExamSubjects(e)} required={true}>
                                                                        {
                                                                            this.state.all_subjects.map((subject, index)=>(
                                                                                <option value={subject.id} key={index}>{subject.subject_name}</option>
                                                                            ))
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <div className="form-group col-lg-12">
                                                                    <input type="submit" className="btn btn-primary btn-sm" value="Add Now"/>
                                                                </div>
                                                            </div>


                                                        </form>
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

export default Exams;

