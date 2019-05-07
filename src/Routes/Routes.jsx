import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';

// Basic Components
import Home from '../components/Home';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';

// All Routes Related to Tools
import Tools from '../components/Tools/index';
import examsCategory from '../components/Tools/examsCategory';
import Subjects from '../components/Tools/Subjects';
import Topics from '../components/Tools/Topics';
import Exams from '../components/Tools/Exams';
import Plans from '../components/Tools/Plans';

// All Routes related to Collection
import Videos from '../components/Collection/Videos/Index';
import addVideo from '../components/Collection/Videos/addVideo';
import Handouts from '../components/Collection/Handouts/Index';
import addHandout from '../components/Collection/Handouts/addHandout';

// All Routes related to Questions and Question Options
import QuestionsOptions from '../components/Collection/Questions/QuestionsOptions';
import Questions from '../components/Collection/Questions/Index';
import addQuestion from '../components/Collection/Questions/addQuestion';
import editQuestion from '../components/Collection/Questions/editQuestion';
import viewQuestion from '../components/Collection/Questions/viewQuestion';


// These all routes related to Products(Video Lecture)
import allLectures from '../components/Products/Lectures/Index';
import addLecture from '../components/Products/Lectures/addLecture';
import editLecture from '../components/Products/Lectures/editLecture';
import viewLecture from '../components/Products/Lectures/viewLecture';

// These all routes related to Products(Notes)
import allNotes from '../components/Products/Notes/Index';
import addNotes from '../components/Products/Notes/addNotes';
import editNotes from '../components/Products/Notes/editNotes';
import viewNotes from '../components/Products/Notes/viewNotes';

//These all routes related to Products(Quizzes)
import addQuiz from '../components/Products/Quizzes/addQuiz';
import editQuiz from '../components/Products/Quizzes/editQuiz';
import viewQuiz from '../components/Products/Quizzes/viewQuiz';
import allQuizzes from '../components/Products/Quizzes/Index';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            sessionStorage.getItem('examsnuDashToken') ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
);

const Logout = () => {
    sessionStorage.removeItem('examsnuDashToken');
    sessionStorage.removeItem('examsnuDashProfile');
    return(<Redirect to="/login"/>);
};

class Routes extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: !!sessionStorage.getItem('examsnuDashToken'),
        }
    }
    render(){
        return(
            <Router>
                <Switch>
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute exact path="/logout" component={Logout} />

                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />

                    {/*All Tools regarding Routes*/}
                    <PrivateRoute exact path="/tools" component={Tools}/>
                    <PrivateRoute exact path="/tool/categories" component={examsCategory}/>
                    <PrivateRoute exact path="/tool/subjects" component={Subjects}/>
                    <PrivateRoute exact path="/tool/topics" component={Topics}/>
                    <PrivateRoute exact path="/tool/exams" component={Exams}/>
                    <PrivateRoute exact path="/tool/plans" component={Plans}/>


                    {/*All Collection regarding Routes*/}
                    <PrivateRoute exact path="/collection/video/add" component={addVideo}/>
                    <PrivateRoute exact path="/collection/videos" component={Videos}/>
                    <PrivateRoute exact path="/collection/handouts" component={Handouts}/>
                    <PrivateRoute exact path="/collection/handout/add" component={addHandout}/>

                    {/*All Routes related to questions and options*/}
                    <PrivateRoute exact path="/collection/question-options" component={QuestionsOptions}/>
                    <PrivateRoute exact path="/collection/questions" component={Questions}/>
                    <PrivateRoute exact path="/collection/question/add" component={addQuestion}/>
                    <PrivateRoute exact path="/collection/question/edit/:question_id" component={editQuestion}/>
                    <PrivateRoute exact path="/collection/questions/:question_id" component={viewQuestion}/>

                    {/*All Routes related to Product(Video Lecture)*/}
                    <PrivateRoute exact path="/product/lectures" component={allLectures}/>
                    <PrivateRoute exact path="/product/lecture/add" component={addLecture}/>
                    <PrivateRoute exact path="/product/lecture/edit/:lecture_id" component={editLecture}/>
                    <PrivateRoute exact path="/product/lecture/view/:lecture_id" component={viewLecture}/>

                    {/*All Routes related to Product(Notes & Handputs)*/}
                    <PrivateRoute exact path="/product/notes" component={allNotes}/>
                    <PrivateRoute exact path="/product/note/add" component={addNotes}/>
                    <PrivateRoute exact path="/product/note/edit/:note_id" component={editNotes}/>
                    <PrivateRoute exact path="/product/note/view/:note_id" component={viewNotes}/>

                    {/*All Routes related to Product(Quizzes)*/}
                    <PrivateRoute exact path="/product/quiz/add" component={addQuiz}/>
                    <PrivateRoute exact path="/product/quiz/edit/:quiz_id" component={editQuiz}/>
                    <PrivateRoute exact path="/product/quiz/view/:quiz_id" component={viewQuiz}/>
                    <PrivateRoute exact path="/product/quizzes" component={allQuizzes}/>
                </Switch>
            </Router>
        )
    }
};

export default Routes;