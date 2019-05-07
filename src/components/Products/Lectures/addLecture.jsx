import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {BASE_URL} from '../../../services/BaseUrl';
import Footer from '../../../layouts/Footer';
import Sidebar from '../../../layouts/Sidebar';
import Navbar from '../../../layouts/Navbar';
import {Link} from 'react-router-dom';
import Loader from '../../../assets/img/loading.gif';

class addLecture extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            isLoading:true,
            error:false,
            message:'',
            lectureID:'None',

            lecture:[{id:1,exam:"Air Force Common Admission Test",exam_id:1,videos:[{id:1,title:"Maths - 1"}],created_by:"Hitesh Yadav",created_by_id:1,title:"Video - 1",alt_title_video:"V1",is_active:true,active_on:"2019-04-04T00:00:00+05:30",is_deleted:false}],
            lecture_videos:[],

            all_exams : [
                { id: 0, exam_category: "", subjects: [{ id: 0, subject_name: " ", alternative_name: " ", description:" " },],exam_name:"",alternative_name:"",is_deleted:"" },
            ],

        };
        this.onChange = this.onChange.bind(this);
        this.createVideoLec = this.createVideoLec.bind(this);
    }

    componentDidMount() {
        document.title = "Create Video Lecture - examsnu.in";

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
            lecture: {
                ...this.state.lecture, [e.target.name]: e.target.value
            }
        });
    };
    createVideoLec = (e) => {
        this.setState({
            isLoading:true,
        });
        e.preventDefault();

        const formData = new FormData(e.target);
        const lectureDet = {};

        for (let entry of formData.entries()) {
            lectureDet[entry[0]] = entry[1]
        }

        fetch(`${BASE_URL}lectures-video/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
            body:JSON.stringify(lectureDet),
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
                    lectureID:responseJson.id,
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
        if(this.state.lectureID !== 'None'){
            return(<Redirect to={`/product/lecture/edit/${this.state.lectureID}`}  />);
        }
        return(
            <div>
                <Sidebar/>
                <div className="main-content">
                    <Navbar/>


                    <div className="header bg-gradient-primary pb-8 pt-5 pt-md-8">
                        <div className="container-fluid">
                            <div className="header-body">
                                <h2 className="headline">Create New Video Lecture</h2>
                            </div>
                            <Link to={`/collection/videos`} className="btn btn-info btn-lg">Video Collection</Link>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">

                        {/*Content Starts Here*/}

                        <div className="row mt-5">
                            <div className="col">
                                <div className="card shadow">
                                    <div className="card-header bg-transparent">
                                        <h3 className="mb-0">Create New Video Lecture</h3>
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
                                                <form onSubmit={(event) => this.createVideoLec(event)} ref="form">
                                                    <div className="row">
                                                        <div className="form-group col-lg-12">
                                                            <label>Title of the Video Lecture's(E.g. SSC - Aptitude)</label>
                                                            <input
                                                                type="text"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                id="title"
                                                                name="title"
                                                                value={this.state.lecture.title}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Title for Video Lec"
                                                            />
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Alternative Title of the Video Lecture's(E.g. SSC - Aptitude)</label>
                                                            <input
                                                                type="text"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                id="alt_title_video"
                                                                name="alt_title_video"
                                                                value={this.state.lecture.alt_title_video}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Alternative Title for Video Lec"
                                                            />
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <label>Is Active?</label>
                                                            <select className="form-control form-control-alternative" name="is_active" onChange={(e) => this.onChange(e)} required={true}>
                                                                <option value="true">Yes</option>
                                                                <option value="false">No</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <lable>Will Active On(If Unactive)</lable>
                                                            <input
                                                                type="datetime-local"
                                                                required={true}
                                                                className="form-control form-control-alternative"
                                                                name="active_on"
                                                                id="active_on"
                                                                value={this.state.lecture.active_on}
                                                                onChange={(e) => this.onChange(e)}
                                                                placeholder="Will be available on?"
                                                            />
                                                        </div>

                                                        <div className="form-group col-lg-12">
                                                            <label>Exam(To which Lectures related)</label>
                                                            <select className="form-control form-control-alternative" name="exam" onChange={(e) => this.onChange(e)} required={true}>
                                                                {
                                                                    this.state.all_exams.map((exam, index)=>(
                                                                        <option value={exam.id} key={index}>{exam.exam_name}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        <div className="form-group col-lg-12">
                                                            <input type="submit" className="btn btn-primary btn-lg" value="Create Now"/>
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

export default addLecture;