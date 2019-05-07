import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {BASE_URL} from '../../services/BaseUrl'
import Footer from '../../layouts/Footer'
import Sidebar from '../../layouts/Sidebar'
import Navbar from '../../layouts/Navbar'
import {Link} from 'react-router-dom'
import Loader from '../../assets/img/loading.gif'

class EditexamCategory extends Component{
    render(){
        return(
            <div className={this.props.modalShow ? "modal fade modelBox show" : "modal fade modelBox hideModal"} role="dialog" aria-labelledby="exampleModalLabel">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Exam Category</h5>
                            <button type="button" className="close" aria-label="Close">
                                <span aria-hidden="true" onClick={this.props.closeModal}>×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e, id) => this.props.onSubmit(e, this.props.category.id)}>
                                <div className="row">
                                    <div className="form-group col-lg-12">
                                        <label>Exam Category Name</label>
                                        <input type="text" required={true} className="form-control form-control-alternative" id="category_name" name="category_name" value={this.props.category.category_name} placeholder="Category Name" onChange={this.props.onChange}/>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Alternative Name</label>
                                        <input type="text" required={true} className="form-control form-control-alternative" id="alternative_name" name="alternative_name" value={this.props.category.alternative_name} placeholder="Alternative Name"  onChange={this.props.onChange}/>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Is Deleted?</label>
                                        <select className="form-control form-control-alternative" name="is_deleted" onChange={this.props.onChange}>
                                            <option value={this.props.category.is_deleted ? 'true' : 'false'}>{this.props.category.is_deleted ? "Yes" : "No"}</option>
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

class examsCategory extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            categories : [
                { id: 0, category_name: "", alternative_name: "",is_deleted:false },
            ],
            isLoading:true,
            error:false,
            message:'',
            openModal:false,


            newCategory:'',
            alternativeName:'',

            updateCategory:"",
        };

        this.newCategoryName = this.newCategoryName.bind(this);
        this.categoryalternativeName = this.categoryalternativeName.bind(this);
        this.addNewCategory = this.addNewCategory.bind(this);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onUpdateChanges = this.onUpdateChanges.bind();
        this.updateCategory = this.updateCategory.bind(this);
    }

    componentDidMount() {
        document.title = "All Exam Categories - EXAMSNU.IN";
        if (this.state.isAuthenticated) {
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
                .then((responseJson) => {
                    this.setState({
                        categories:responseJson,
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

    newCategoryName = (e) => {
        this.setState({
            newCategory:e.target.value,
        })
    }
    categoryalternativeName = (e) =>{
        this.setState({
            alternativeName:e.target.value,
        })
    }

    addNewCategory = (event) => {
        this.setState({
            isLoading:true,
        })
        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}exams-category/`, {
                method: "POST",
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
                },
                body:JSON.stringify({
                    category_name:this.state.newCategory,
                    alternative_name: this.state.alternativeName,
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
                        categories:responseJson,
                        isLoading:false,
                        newCategory:'',
                        alternativeName:'',
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
            category_name:'',
            alternative_name:'',
        });

        return false;
    };

    openModal = (event, id) => {
        this.setState({
            openModal : !this.state.openModal,
            updateCategory: this.state.categories[id],
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
            updateCategory: {
                ...this.state.updateCategory, [e.target.name]: e.target.value
            }
        });
    };

    updateCategory = (event, id) =>{
        this.setState({
            isLoading:true,
        });
        event.preventDefault();

        const formData = new FormData(event.target);
        const categoryDet = {};

        for (let entry of formData.entries()) {
            categoryDet[entry[0]] = entry[1]
        }

        categoryDet['category_id'] = id;

        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}exams-category/`, {
                method: "PUT",
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
                },
                body:JSON.stringify(categoryDet),
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
                        categories:responseJson,
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
                                <h2 className="headline">All Exam Categories</h2>
                            </div>
                            <Link to={`/tools`} className="btn btn-info btn-lg">Other Tools</Link>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">
                        <div className="row">
                            <div className="col">
                                <div className="card shadow">
                                    <div className="card-header bg-transparent">
                                        <h3 className="mb-0">Exam Categories</h3>
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
                                    <EditexamCategory
                                        modalShow={this.state.openModal}
                                        closeModal={this.closeModal}
                                        category={this.state.updateCategory}
                                        onChange={this.onUpdateChanges}
                                        onSubmit={this.updateCategory}
                                    />

                                    <div  className={this.state.isLoading ? "card-body hideBox" : "card-body"}>
                                        <div className="row icon-examples">
                                        {
                                            this.state.categories.map((category, index) => (

                                                    <div className="col-lg-3 col-md-6" key={index}>
                                                        <div className="btn-icon-clipboard" title={category.category_name}>
                                                            <h2 className={!category.is_deleted ? "text-success text-uppercase" : "text-danger text-uppercase"}>{category.category_name}</h2>
                                                            <h6 className={!category.is_deleted ? "text-success text-uppercase" : "text-danger text-uppercase"}>({category.alternative_name})</h6>
                                                            <br/>
                                                            <button type="button" className="btn btn-danger btn-sm" onClick={(event, id) => this.openModal(event, index)}>Edit</button>
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        }
                                            <div className="col-lg-3 col-md-6">
                                                <div className="btn-icon-clipboard" title="Add New Category">
                                                    <input type="text" required={true} className="form-control form-control-alternative" id="category_name" value={this.state.newCategory} onChange={(e) => this.newCategoryName(e)} placeholder="New Category name" />
                                                    <br/>
                                                    <input type="text" required={true} className="form-control form-control-alternative" id="alternative_name" value={this.state.alternativeName} onChange={(e) => this.categoryalternativeName(e)} placeholder="Alternative Name" />
                                                    <br/>
                                                    <button type="button" className="btn btn-primary btn-sm" onClick={(event) => this.addNewCategory(event)}>Add Now</button>
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

export default examsCategory;

