import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {BASE_URL} from '../../../services/BaseUrl';
import Footer from '../../../layouts/Footer';
import Sidebar from '../../../layouts/Sidebar';
import Navbar from '../../../layouts/Navbar';
import {Link} from 'react-router-dom';
import Loader from '../../../assets/img/loading.gif';

class viewNotes extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            isLoading:true,
            error:false,
            message:'',

            notes:[{id:1,exam:"Air Force Common Admission Test",exam_id:1,videos:[{id:1,title:"Maths - 1"}],created_by:"Hitesh Yadav",created_by_id:1,title:"Video - 1",alt_title_video:"V1",is_active:true,active_on:"2019-04-04T00:00:00+05:30",is_deleted:false}],
            notes_notes:[],

            all_exams : [
                { id: 0, exam_category: "", subjects: [{ id: 0, subject_name: " ", alternative_name: " ", description:" " },],exam_name:"",alternative_name:"",is_deleted:"" },
            ],

        };
        this.onChange = this.onChange.bind(this);
        this.updateNotes = this.updateNotes.bind(this);
    }

    componentDidMount() {
        document.title = "View Notes Details - examsnu.in";

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

        this.setState({
            notes: {
                ...this.state.notes, [e.target.name]: e.target.value
            }
        });
    };
    updateNotes = (e, notes_lecture_id) => {
        this.setState({
            isLoading:true,
        });
        e.preventDefault();

        const formData = new FormData(e.target);
        const noteDet = {};

        for (let entry of formData.entries()) {
            noteDet[entry[0]] = entry[1]
        }
        noteDet['notes_lecture_id'] = notes_lecture_id;

        fetch(`${BASE_URL}notes/`, {
            method: "PUT",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
            body:JSON.stringify(noteDet),
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
                    notes:responseJson,
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
                                <h2 className="headline">View Notes Lecture</h2>
                            </div>
                            <Link to={`/product/notes/`} className="btn btn-success btn-lg">Back to Notes Collection</Link>
                            <Link to={`/collection/handouts`} className="btn btn-info btn-lg">Handouts Collection</Link>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">

                        {/*Content Starts Here*/}

                        <div className="row mt-5">
                            <div className="col">
                                <div className="card shadow">
                                    <div className="card-header bg-transparent">
                                        <h3 className="mb-0">View Notes Lecture</h3>
                                        <Link to={`/product/note/edit/${this.props.match.params.note_id}`} className="btn btn-primary btn-sm">Add/Delete Handouts</Link>
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
                                                <form onSubmit={(event, id) => this.updateNotes(event, this.props.match.params.note_id)} ref="form">
                                                    <div className="row">
                                                        <div className="form-group col-lg-12">
                                                            <label>Title of the Notes Lecture's(E.g. SSC - Aptitude)</label>
                                                            <input
                                                                type="text"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                id="title"
                                                                name="title"
                                                                value={this.state.notes.title}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Title for Notes Lec"
                                                            />
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Alternative Title of the Notes Lecture's(E.g. SSC - Aptitude)</label>
                                                            <input
                                                                type="text"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                id="alt_title_notes"
                                                                name="alt_title_notes"
                                                                value={this.state.notes.alt_title_notes}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Alternative Title for Notes Lec"
                                                            />
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Is Active?</label>
                                                            <select className="form-control form-control-alternative" name="is_active" onChange={(e) => this.onChange(e)} required={true}>
                                                                <option value={this.state.notes.is_active ? "true" : "false"}>{this.state.notes.is_active ? "Yes" : "No"}</option>
                                                                <option value="true">Yes</option>
                                                                <option value="false">No</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <lable>Will Active On(If Unactive) ({this.state.notes.active_on})</lable>
                                                            <input
                                                                type="datetime-local"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                name="active_on"
                                                                id="active_on"
                                                                value={this.state.notes.active_on}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Will be available on?"
                                                            />
                                                        </div>

                                                        <div className="form-group col-lg-12">
                                                            <label>Exam(To which Lectures related)</label>
                                                            <select className="form-control form-control-alternative" name="exam" onChange={(e) => this.onChange(e)} required={true}>
                                                                <option value={this.state.notes.exam_id}>{this.state.notes.exam}</option>
                                                                {
                                                                    this.state.all_exams.map((exam, index)=>(
                                                                        <option value={exam.id} key={index}>{exam.exam_name}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Is Deleted?</label>
                                                            <select className="form-control form-control-alternative" name="is_deleted" onChange={(e) => this.onChange(e)} required={true}>
                                                                <option value={this.state.notes.is_deleted ? "true" : "false"}>{this.state.notes.is_deleted ? "Yes" : "No"}</option>
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

export default viewNotes;