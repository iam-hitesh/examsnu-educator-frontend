import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {BASE_URL} from '../../../services/BaseUrl';
import Footer from '../../../layouts/Footer';
import Sidebar from '../../../layouts/Sidebar';
import Navbar from '../../../layouts/Navbar';
import {Link} from 'react-router-dom';
import Loader from '../../../assets/img/loading.gif';
import {cutString} from '../../../services/cutString';
import Moment from 'moment'

class allNotes extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            isLoading:true,
            error:false,
            message:'',
            page:1,

            notes:[{id:1,exam:"Air Force Common Admission Test",exam_id:1,videos:[{id:1,title:"Maths - 1"}],created_by:"Hitesh Yadav",created_by_id:1,title:"Video - 1",alt_title_video:"V1",is_active:true,active_on:"2019-04-04T00:00:00+05:30",is_deleted:false}],
        };

        this.changePage = this.changePage.bind(this);
        this.searchNotes = this.searchNotes.bind(this);
    }

    componentDidMount() {
        document.title = "Notes Collection - examsnu.in";
        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}notes/?page=`+this.state.page, {
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
                        message: 'Some Error Occurred, Try Again!',
                    })
                });
        };
    };

    searchNotes = (event) =>{
        this.setState({
            isLoading:true,
        });
        fetch(`${BASE_URL}search-notes/?search=`+event.target.value, {
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
        fetch(`${BASE_URL}notes/?page=`+page, {
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
                                <h2 className="headline">Note's Collection</h2>
                            </div>
                            <Link to={`/product/note/add`} className="btn btn-info btn-lg">Create New Notes</Link>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">

                        {/*Content Starts Here*/}

                        <div className="row mt-5">
                            <div className="col">
                                <div className="card bg-default shadow">
                                    <div className="card-header bg-transparent border-0">
                                        <h3 className="text-white mb-0">Create New Notes</h3>
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
                                                onChange={this.searchNotes}
                                            />
                                        </div>
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

                                    {/*Videos Table*/}
                                    <div className="table-responsive">
                                        <table className="table align-items-center table-dark table-flush">
                                            <thead className="thead-dark">
                                            <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col">Title</th>
                                                <th scope="col">Exam</th>
                                                <th scope="col">Is Active</th>
                                                <th scope="col">Active On</th>
                                                <th scope="col">Created At</th>
                                                <th scope="col">Created BY</th>
                                                <th scope="col">Is Deleted?</th>
                                            </tr>
                                            </thead>
                                            <tbody>


                                            {/*Content Repeat and Loop Starts Here*/}
                                            {
                                                this.state.notes.map((note, index) => (
                                                    <tr key={index}>
                                                        <th scope="row">
                                                            <Link to={`/product/note/view/${note.id}`} className="mb-0 text-sm">{note.id}</Link>
                                                        </th>
                                                        <th scope="row">
                                                            <Link to={`/product/note/view/${note.id}`} className="mb-0 text-sm">
                                                                <span className={note.is_deleted ? "mb-0 text-sm text-danger" : "mb-0 text-sm text-success"}>{cutString(note.title, 30)}</span>
                                                            </Link>
                                                        </th>
                                                        <td>
                                                            {note.exam}
                                                        </td>
                                                        <td>
                                                            <span className={note.is_active ? "badge badge-pill badge-success text-white" :"badge badge-pill badge-danger text-white"}>{note.is_active ? "Active" : "Not Active"}</span>
                                                        </td>
                                                        <td>
                                                            {Moment(note.active_on).format('MMMM Do YYYY h:mm:ss a')}
                                                        </td>
                                                        <td>
                                                            {Moment(note.created_at).format('MMMM Do YYYY')}
                                                        </td>
                                                        <td>
                                                            <Link to={`/author/${note.created_by_id}`}>{note.created_by}</Link>
                                                        </td>
                                                        <td>
                                                            <span className={note.is_deleted ? "badge badge-pill badge-danger text-white" : "badge badge-pill badge-success text-white"}>{note.is_deleted ? "Deleted" : "Not Deleted"}</span>
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

export default allNotes;

