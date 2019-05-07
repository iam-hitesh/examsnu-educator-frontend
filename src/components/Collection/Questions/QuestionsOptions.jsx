import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {BASE_URL} from '../../../services/BaseUrl';
import Footer from '../../../layouts/Footer';
import Sidebar from '../../../layouts/Sidebar';
import Navbar from '../../../layouts/Navbar';
import {Link} from 'react-router-dom';
import Loader from '../../../assets/img/loading.gif';
import Moment from 'moment';

class AddQuestionOption extends Component{
    render(){
        return(
            <div className={this.props.modalShow ? "modal fade modelBox show" : "modal fade modelBox hideModal"} role="dialog" aria-labelledby="exampleModalLabel">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create Option</h5>
                            <button type="button" className="close" aria-label="Close">
                                <span aria-hidden="true" onClick={this.props.closeAddModal}>×</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <form onSubmit={(event) => this.props.onSubmit(event)} ref="form">
                                <div className="row">
                                    <div className="form-group col-lg-12">
                                        <label>English Version of Option(if any image then put like this "<img src="link_of_image_here" alt="add_image"/>")</label>
                                        <textarea
                                            className="form-control form-control-alternative"
                                            name="option_title"
                                            onChange={(e) => this.props.onChange(e)}
                                            value={this.props.option}>

                                                            </textarea>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Hindi Version of Option(if any image then put like this "<img src="link_of_image_here" alt="add_image"/>")</label>
                                        <textarea
                                            className="form-control form-control-alternative"
                                            name="hindi_option_title"
                                            onChange={(e) => this.props.onChange(e)}
                                            value={this.props.hindi_option_title}>

                                                            </textarea>
                                    </div>

                                    <div className="form-group col-lg-12">
                                        <input type="submit" className="btn btn-primary btn-lg" value="Add Now"/>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

class UpdateQuestionOption extends Component{
    render(){
        return(
            <div className={this.props.modalShow ? "modal fade modelBox show" : "modal fade modelBox hideModal"} role="dialog" aria-labelledby="exampleModalLabel">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Option</h5>
                            <button type="button" className="close" aria-label="Close">
                                <span aria-hidden="true" onClick={this.props.closeUpdateModal}>×</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <form onSubmit={(event, id) => this.props.onSubmit(event, this.props.option.id)} ref="form">
                                <div className="row">
                                    <div className="form-group col-lg-12">
                                        <label>English version of Option(if any image then put like this "<img src="link_of_image_here" alt="update_image"/>")</label>
                                        <textarea
                                            className="form-control form-control-alternative"
                                            name="option_title"
                                            onChange={(e) => this.props.onChange(e)}
                                            value={this.props.option.option_title}>

                                                            </textarea>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Hindi version of Option(if any image then put like this "<img src="link_of_image_here" alt="update_image"/>")</label>
                                        <textarea
                                            className="form-control form-control-alternative"
                                            name="hindi_option_title"
                                            onChange={(e) => this.props.onChange(e)}
                                            value={this.props.option.hindi_option_title}>

                                                            </textarea>
                                    </div>


                                    <div className="form-group col-lg-12">
                                        <label>Is Deleted?</label>
                                        <select className="form-control form-control-alternative" name="is_deleted" onChange={this.props.onChange}>
                                            <option value={this.props.option.is_deleted ? 'true' : 'false'}>{this.props.option.is_deleted ? "Yes" : "No"}</option>
                                            <option value='true'>Yes</option>
                                            <option value='false'>No</option>
                                        </select>
                                    </div>

                                    <div className="form-group col-lg-12">
                                        <input type="submit" className="btn btn-primary btn-lg" value="Update Now"/>
                                    </div>
                                </div>
                            </form>

                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

class QuestionsOptions extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            isLoading:true,
            error:false,
            message:'',
            page:1,
            openAddModal:false,
            openUpdateModal: false,

            options:[{option_title:'',hindi_option_title:'',is_deleted:'',created_by:'',created_at:'',updated_at:''}],
            addOption:'',
            hindi_option_title:'',
            updatedOption:[{option_title:'',hindi_option_title:'',is_deleted:'',created_by:'',created_at:'',updated_at:''}],
        };

        this.changePage = this.changePage.bind(this);
        this.searchOptions = this.searchOptions.bind(this);

        this.openAddModal = this.openAddModal.bind(this);
        this.closeAddModal = this.closeAddModal.bind(this);
        this.openUpdateModal = this.openUpdateModal.bind(this);
        this.closeUpdateModal = this.closeUpdateModal.bind(this);

        this.onUpdateAddChanges = this.onUpdateAddChanges.bind(this);
        this.addOption = this.addOption.bind(this);

        this.onUpdateChanges = this.onUpdateChanges.bind(this);
        this.updateOption = this.updateOption.bind(this);
    }

    componentDidMount() {
        document.title = "Question Options - examsnu.in";
        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}question-options/?page=`+this.state.page, {
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
                        options:responseJson,
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

    searchOptions = (event) =>{
        this.setState({
            isLoading:true,
        });
        fetch(`${BASE_URL}search-question-option/?search=`+event.target.value, {
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
                    options:responseJson,
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
        fetch(`${BASE_URL}question-options/?page=`+page, {
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
                    options:responseJson,
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

    openAddModal = (event, id) =>{
        this.setState({
            openAddModal : !this.state.openAddModal,
            addOption: this.state.options[id],
        });
    };
    closeAddModal = () => {
        this.setState({
            openAddModal : !this.state.openAddModal,
        });
    };

    onUpdateAddChanges = (e) =>{
        e.preventDefault();

        this.setState({
            addOption: e.target.value
        });
    };
    addOption = (e, id) =>{
        this.setState({
            isLoading:true,
        });
        e.preventDefault();

        const formData = new FormData(e.target);
        const optionDet = {};

        for (let entry of formData.entries()) {
            optionDet[entry[0]] = entry[1]
        }

        fetch(`${BASE_URL}question-options/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
            body:JSON.stringify(optionDet),
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
                    options: responseJson,
                    isLoading:false,
                    openUpdateModal:false,
                    addOption:'',
                    page:1,
                    error:false,
                    message:'Added Successfully',
                });
            })
            .catch((error) => {
                this.setState({
                    error:true,
                    isLoading:false,
                    message:'Some Error Occurred',
                })
            });
        return false;
    };

    openUpdateModal = (event, id) =>{
        this.setState({
            openUpdateModal : !this.state.openUpdateModal,
            updatedOption: this.state.options[id],
        });
    };
    closeUpdateModal = () => {
        this.setState({
            openUpdateModal : !this.state.openUpdateModal,
        });
    };
    onUpdateChanges = (e) => {
        this.setState({
            updatedOption: {
                ...this.state.updatedOption, [e.target.name]: e.target.value
            }
        });
    };
    updateOption = (e, id) => {
        this.setState({
            isLoading:true,
        });
        e.preventDefault();

        const formData = new FormData(e.target);
        const optionDet = {};

        for (let entry of formData.entries()) {
            optionDet[entry[0]] = entry[1]
        }
        optionDet['option_id'] = id;

        fetch(`${BASE_URL}question-options/`, {
            method: "PUT",
            headers: {
                Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
            },
            body:JSON.stringify(optionDet),
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
                    options: responseJson,
                    isLoading:false,
                    openAddModal:false,
                    openUpdateModal:false,
                    addOption:'',
                    page:1,
                    error:false,
                    message:'Updated Successfully',
                });
            })
            .catch((error) => {
                this.setState({
                    error:true,
                    isLoading:false,
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
                                <h2 className="headline">Videos Collection</h2>
                            </div>
                            <button className="btn btn-danger btn-lg" onClick={this.openAddModal}>Add New Option</button>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">

                        {/*Content Starts Here*/}

                        <div className="row mt-5">
                            <div className="col">
                                <div className="card bg-default shadow">
                                    <div className="card-header bg-transparent border-0">
                                        <h3 className="text-white mb-0">Questions Options Collection</h3>
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
                                                onChange={this.searchOptions}
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

                                    {/*AddOp*/}
                                    <AddQuestionOption
                                        modalShow={this.state.openAddModal}
                                        closeAddModal={this.closeAddModal}
                                        option={this.state.addOption}
                                        hindi_option_title={this.state.hindi_option_title}
                                        onChange={this.onUpdateAddChanges}
                                        onSubmit={this.addOption}
                                    />


                                    {/*UpdateQuestionOption Modal*/}
                                    <UpdateQuestionOption
                                        modalShow={this.state.openUpdateModal}
                                        closeUpdateModal={this.closeUpdateModal}
                                        option={this.state.updatedOption}
                                        onChange={this.onUpdateChanges}
                                        onSubmit={this.updateOption}
                                    />


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
                                                <th scope="col">Hindi Title</th>
                                                <th scope="col">Created By</th>
                                                <th scope="col">Created At</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>


                                            {/*Content Repeat and Loop Starts Here*/}
                                            {
                                                this.state.options.map((option, index) => (
                                                    <tr key={index}>
                                                        <th scope="row">
                                                            <span className="mb-0 text-sm">{option.id}</span>
                                                        </th>
                                                        <th scope="row">
                                                            <span className={option.is_deleted ? "mb-0 text-sm text-danger" : "mb-0 text-sm text-success"} dangerouslySetInnerHTML={{__html: option.option_title}}></span>
                                                        </th>
                                                        <th scope="row">
                                                            <span className={option.is_deleted ? "mb-0 text-sm text-danger" : "mb-0 text-sm text-success"} dangerouslySetInnerHTML={{__html: option.hindi_option_title}}></span>
                                                        </th>
                                                        <td>
                                                            <Link to={`/author/${option.created_by_id}`}>{option.created_by}</Link>
                                                        </td>
                                                        <td>
                                                            {Moment(option.created_at).format('MMMM Do YYYY')}
                                                        </td>
                                                        <td>
                                                            <button type="button" className="btn btn-info btn-sm delete-btn" onClick={(event, id) =>this.openUpdateModal(event, index)}>Edit</button>
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

export default QuestionsOptions;

