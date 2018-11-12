import React, {Component} from 'react';
import './App.css';
import Vote from './Vote'
import ApplicationHeader from './common/ApplicationHeader'
import {ToastContainer} from 'react-toastify';
import {withStyles} from '@material-ui/core/styles';
import 'bootstrap3/dist/css/bootstrap.min.css'
import Grid from 'react-bootstrap/lib/Grid';
import {withRouter} from 'react-router-dom';
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import Login from "./auth/Login";
import VoteList from "./VoteList"
import NotFound from "./common/NotFound"
import NewProcess from './NewProcess'
import SockJsClient from 'react-stomp'
import {ACCESS_TOKEN} from "./constants";
import {getCurrentUser, logout, acceptNotification} from "./APIUtils";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from "./auth/Register";
import Footer from "./Footer"
import InvitationList from "./InvitationList";
import NewItems from "./NewItems";
import PrivateRoute from "./auth/PrivateRoute"


const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    headerLink: {
        color: "white",
        fontSize: "1rem",
        marginLeft: 10
    }
};


class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
            loadingUser: true
        }
    }

    componentDidMount() {
        this.onAuth();
    };

    onInviteClick =() => {
      this.props.history.push("/user/invitations/");
    };

    onMessageReceived = (message) => {
        if(message.type === "INVITE") {
            let votingProc = message.votingInvitation.votingProcess;

            toast.info(<a className="redirect-link" onClick={() => this.onInviteClick()}>{"You have been invited to voting:  " + votingProc.id + " " + votingProc.createdBy.username}</a>);
        }
        else {
            toast.info(message.message);
        }
        if(message.ackRequired) {
            acceptNotification({notificationId: message.id}).then((json) => {
                console.log("confirmed")
            }).catch(error => {
                console.log(error);
            })
        }
    };


    onAuth = () => {
        getCurrentUser().then((json) => {
            console.log(json);
            this.setState({
                currentUser: json,
                loadingUser: false
            })
        }).catch((error) => {
            this.setState({
                currentUser: null,
                loadingUser: false,
            })
        })
    };

    logout = () => {
        logout();
        this.setState({
            currentUser: null,
            loadingUser: false
        });
        this.props.history.push("/");
        toast.info("Succesfully logout.");
    };

    render() {

        return (
            <div className="body">
                <ToastContainer closeOnClick={false}/>
                <ApplicationHeader currentUser={this.state.currentUser} logout={this.logout}/>
                <Grid>
                    <div className="app-content">
                        <Switch>
                            <Route exact path="/vote/:id" render={(props) => <Vote currentUser={this.state.currentUser} loadingUser={this.state.loadingUser} {...props}/>}/>

                            <Route exact path="/login" render={() => <Login onAuth={this.onAuth} />}/>

                            <PrivateRoute currentUser={this.state.currentUser} exact path="/user/invitations" component={InvitationList}/>

                            <Route exact path="/register" component={Register} />

                            <Route exact path={"/"} render={(props) => <VoteList currentUser={this.state.currentUser} {...props}/>} />

                            <PrivateRoute currentUser={this.state.currentUser} authed={this.state.currentUser !== null} exact path="/vote" component={NewProcess} />
                            <PrivateRoute authed={this.state.currentUser != null} exact path="/items" component={NewItems} />

                            <Route component={NotFound}/>


                        </Switch>
                    </div>
                </Grid>

                <SockJsClient key={this.state.currentUser} url='http://localhost:8080/voting-socket' topics={['/queue/notification', '/user/queue/notification']}
                              onMessage={this.onMessageReceived}  debug headers={{Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN)}}/>

                <Footer/>
            </div>

        );
    }
}





export default withStyles(styles)(withRouter(App));


