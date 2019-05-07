import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {BASE_URL} from '../../services/BaseUrl'
import Footer from '../../layouts/Footer'
import Sidebar from '../../layouts/Sidebar'
import Navbar from '../../layouts/Navbar'
import {Link} from 'react-router-dom'
import Loader from '../../assets/img/loading.gif'


class EditPlan extends Component{
    render(){
        return(
            <div className={this.props.modalShow ? "modal fade modelBox show" : "modal fade modelBox hideModal"} role="dialog" aria-labelledby="exampleModalLabel">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Plan</h5>
                            <button type="button" className="close" aria-label="Close">
                                <span aria-hidden="true" onClick={this.props.closeModal}>×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e, id) => this.props.onSubmit(e, this.props.plan.id)}>
                                <div className="row">
                                    <div className="form-group col-lg-12">
                                        <label>Plan Name</label>
                                        <input
                                            type="text"
                                            required={true}
                                            className="form-control form-control-alternative"
                                            id="plan_name"
                                            name="plan_name"
                                            value={this.props.plan.plan_name}
                                            placeholder="Plan Name"
                                            onChange={this.props.onChange}
                                        />
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Alternative Name</label>
                                        <input
                                            type="text"
                                            required={true}
                                            className="form-control form-control-alternative"
                                            id="alternative_name"
                                            name="alternative_name"
                                            value={this.props.plan.alternative_name}
                                            placeholder="Alternative Name"
                                            onChange={this.props.onChange}
                                        />
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Price</label>
                                        <input
                                            type="text"
                                            required={true}
                                            className="form-control form-control-alternative"
                                            id="price"
                                            name="price"
                                            value={this.props.plan.price}
                                            placeholder="Price"
                                            onChange={this.props.onChange}
                                        />
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Validity(In Days)</label>
                                        <input
                                            type="number"
                                            required={true}
                                            className="form-control form-control-alternative"
                                            id="validity"
                                            name="validity"
                                            value={this.props.plan.validity}
                                            placeholder="Validity"
                                            onChange={this.props.onChange}
                                        />
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            required={true}
                                            className="form-control form-control-alternative"
                                            id="description"
                                            name="description"
                                            value={this.props.plan.description}
                                            placeholder="Description"
                                            onChange={this.props.onChange}
                                        />
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Exams(Left Unchanged if need no changes)</label>
                                        <select className="form-control form-control-alternative" name="exams" required={true} multiple={true} onChange={this.props.onChange}>
                                            {
                                                this.props.all_exams.map((exam, index)=>(
                                                    <option value={exam.id} key={index} selected={true}>{exam.exam_name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Is Active?</label>
                                        <select className="form-control form-control-alternative" name="is_active" onChange={this.props.onChange}>
                                            <option value={this.props.plan.is_active ? 'true' : 'false'}>{this.props.plan.is_active ? "Yes" : "No"}</option>
                                            <option value='true'>Yes</option>
                                            <option value='false'>No</option>
                                        </select>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label>Is Deleted?</label>
                                        <select className="form-control form-control-alternative" name="is_deleted" onChange={this.props.onChange}>
                                            <option value={this.props.plan.is_deleted ? 'true' : 'false'}>{this.props.plan.is_deleted ? "Yes" : "No"}</option>
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


class Plans extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
            profile: JSON.parse(sessionStorage.getItem('examsnuDashProfile')),

            all_exams : [
                { id: 0, exam_category: "", subjects: [{ id: 0, subject_name: " ", alternative_name: " ", description:" " },],exam_name:"",alternative_name:"",is_deleted:false },
            ],
            plans:[
                { id: 0, plan_name: "", alternative_name: "",price:"",description:"",exams:[{ id: 0, exam_category: "", subjects: [{ id: 0, subject_name: " ", alternative_name: " ", description:" " },],exam_name:"",alternative_name:"" }],validity:"",is_deleted:false,is_active:false},
            ],

            isLoading:true,
            error:false,
            message:'',
            openModal:false,

            plan_name:'',
            alternative_name:'',
            price:'',
            description:'',
            plan_exams:'',
            validity:'',

            updatePlan:'',
            updatedPlanExams:'',
        };

        this.updateValues = this.updateValues.bind(this);
        this.newPlanExams = this.newPlanExams.bind(this);

        this.addNewPlan = this.addNewPlan.bind(this);
        this.updatePlan = this.updatePlan.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onUpdateChanges = this.onUpdateChanges.bind(this);
    }

    componentDidMount() {
        document.title = "All Available Plans - EXAMSNU.IN";
        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}plans/`, {
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
                        .then((examsJson) => {
                            this.setState({
                                all_exams:examsJson,
                                plans:responseJson,
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

    updateValues = (e) => {
        this.setState({
            [e.target.name]:e.target.value,
        })
    };

    newPlanExams = (e) => {
        this.setState({
            plan_exams: [].slice.call(e.target.selectedOptions).map(o => {
                return o.value;
            })
        });
    };


    addNewPlan = (event) => {
        this.setState({
            isLoading:true,
        });
        event.preventDefault();

        const formData = new FormData(event.target);
        const planDet = {};

        for (let entry of formData.entries()) {
            planDet[entry[0]] = entry[1]
        }
        planDet['exam_list'] = this.state.plan_exams;

        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}plans/`, {
                method: "POST",
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
                },
                body:JSON.stringify(planDet),
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
                        plans:responseJson,
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
        };
        this.setState({
            plan_name:'',
            alternative_name:'',
            price:'',
            description:'',
            plan_exams:'',
            validity:'',
        });

        this.refs.form.reset();
        return false;
    };


    openModal = (event, id) => {
        this.setState({
            openModal : !this.state.openModal,
            updatePlan: this.state.plans[id],
        });
    };

    closeModal = (event) => {
        this.setState({
            openModal : !this.state.openModal,
        });
    };

    onUpdateChanges = (e) => {
        e.preventDefault();

        if(e.target.name === 'exams'){
            this.setState({
                updatedPlanExams: [].slice.call(e.target.selectedOptions).map(o => {
                    return o.value;
                })
            });
        }else{
            this.setState({
                updatePlan: {
                    ...this.state.updatePlan, [e.target.name]: e.target.value
                }
            });
        }
    };

    updatePlan = (e, id) => {
        this.setState({
            isLoading:true,
        });
        e.preventDefault();

        const formData = new FormData(e.target);
        const planDet = {};

        for (let entry of formData.entries()) {
            planDet[entry[0]] = entry[1]
        }

        let exams = [];

        if(!this.state.updatedPlanExams){
            for(let i=0;i<this.state.updatePlan.exams.length;i++){
                exams.push(this.state.updatePlan.exams[i].id)
            }
        }else{
            exams = this.state.updatedPlanExams;
        }

        planDet['plan_id'] = id;
        planDet['exams'] = exams;

        if (this.state.isAuthenticated) {
            fetch(`${BASE_URL}plans/`, {
                method: "PUT",
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('examsnuDashToken')}`
                },
                body:JSON.stringify(planDet),
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
                        plans:responseJson,
                        isLoading:false,
                        openModal:false,
                        updatePlan:'',
                        updatedPlanExams:'',
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
                                <h2 className="headline">All Available Plans</h2>
                            </div>
                            <Link to={`/tools`} className="btn btn-info btn-lg">Other Tools</Link>
                        </div>
                    </div>
                    <div className="container-fluid mt--7">
                        <div className="row">
                            <div className="col">
                                <div className="card shadow">
                                    <div className="card-header bg-transparent">
                                        <h3 className="mb-0">Plans</h3>
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


                                    {/*Modal for Updating Plan Details*/}
                                    <EditPlan
                                        modalShow={this.state.openModal}
                                        closeModal={this.closeModal}
                                        plan={this.state.updatePlan}
                                        onChange={this.onUpdateChanges}
                                        onSubmit={this.updatePlan}
                                        all_exams={this.state.all_exams}
                                    />

                                    <div  className={this.state.isLoading ? "card-body hideBox" : "card-body"}>
                                        <div className="row icon-examples">
                                            {
                                                this.state.plans.map((plan, index) => (

                                                        <div className="col-lg-4 box-shadow" key={index}>
                                                            <div className="card shadow border-0">
                                                                <div className="card-body py-5">

                                                                    <h2 className={plan.is_active ? "text-success text-uppercase" : "text-danger text-uppercase"}>{plan.plan_name}</h2>
                                                                    <h6 className={plan.is_active ? "text-success text-uppercase" : "text-danger text-uppercase"}>({plan.alternative_name})</h6>
                                                                    <hr/>
                                                                    <h2 className="text">&#8377; {plan.price} for {plan.validity} Days</h2>
                                                                    <hr/>
                                                                    <p>{plan.description}</p>
                                                                    <hr/>
                                                                    <div>
                                                                        {
                                                                            this.state.plans[index].exams.map((exam, sub_index)=>(
                                                                                <span className={plan.is_active ? "badge badge-pill badge-success" : "badge badge-pill badge-danger"} key={sub_index}>
                                                                                {exam.exam_name}
                                                                            </span>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                    <hr/>
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
                                                        <form onSubmit={(event) => this.addNewPlan(event)} ref="form">
                                                            <div className="row">
                                                                <div className="form-group col-lg-12">
                                                                    <input
                                                                        type="text"
                                                                        required={true}
                                                                        className="form-control form-control-alternative"
                                                                        id="plan_name"
                                                                        name="plan_name"
                                                                        value={this.state.plan_name}
                                                                        onChange={(e) => this.updateValues(e)}
                                                                        placeholder="Plan Name"
                                                                    />
                                                                </div>
                                                                <div className="form-group col-lg-12">
                                                                    <input
                                                                        type="text"
                                                                        required={true}
                                                                        className="form-control form-control-alternative"
                                                                        id="alternative_name"
                                                                        name="alternative_name"
                                                                        value={this.state.alternative_name}
                                                                        onChange={(e) => this.updateValues(e)}
                                                                        placeholder="Alternative Name"
                                                                    />
                                                                </div>
                                                                <div className="form-group col-lg-12">
                                                                    <input
                                                                        type="text"
                                                                        required={true}
                                                                        className="form-control form-control-alternative"
                                                                        id="price"
                                                                        name="price"
                                                                        value={this.state.price}
                                                                        onChange={(e) => this.updateValues(e)}
                                                                        placeholder="Price"
                                                                    />
                                                                </div>
                                                                <div className="form-group col-lg-12">
                                                                    <input
                                                                        type="number"
                                                                        required={true}
                                                                        className="form-control form-control-alternative"
                                                                        id="validity"
                                                                        name="validity"
                                                                        value={this.state.validity}
                                                                        onChange={(e) => this.updateValues(e)}
                                                                        placeholder="Validity(In Days)"
                                                                    />
                                                                </div>
                                                                <div className="form-group col-lg-12">
                                                                    <input
                                                                        type="text"
                                                                        required={true}
                                                                        className="form-control form-control-alternative"
                                                                        id="description"
                                                                        name="description"
                                                                        value={this.state.description}
                                                                        onChange={(e) => this.updateValues(e)}
                                                                        placeholder="Description"
                                                                    />
                                                                </div>
                                                                <div className="form-group col-lg-12">
                                                                    <select className="form-control form-control-alternative" name="exams" required={true} multiple={true} onChange={(e) => this.newPlanExams(e)}>
                                                                        {
                                                                            this.state.all_exams.map((exam, index)=>(
                                                                                <option value={exam.id} key={index}>{exam.exam_name}</option>
                                                                            ))
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <div className="form-group col-lg-12">
                                                                    <input
                                                                        type="submit"
                                                                        className="btn btn-primary btn-sm"
                                                                        value="Add Now"
                                                                    />
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

export default Plans;

