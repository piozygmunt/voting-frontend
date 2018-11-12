import React from 'react';
import {getVotingProcess, vote} from "./APIUtils";
import CircularProgress from '@material-ui/core/CircularProgress';
import VoteItem from "./VoteItem"
import Paper from '@material-ui/core/Paper';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SockJsClient from 'react-stomp';
import SimpleChat from "./SimpleChat"
import "./Vote.css"
import VotingLogHistory from "./VotingLogHistory"
import Button from '@material-ui/core/Button';


class Vote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match ? props.match.params.id : null,
            data: null,
            isLoading: true
        };
        this.loadVoteProcess = this.loadVoteProcess.bind(this);
        this.onChildClick = this.onChildClick.bind(this);
        this.onMessageReceived = this.onMessageReceived.bind(this);
    }

    onChildClick(item) {
        let promise = vote(this.state.id, item.id);


        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });


        promise
            .then(response => {
                /*const pick = response.pickMade
                const user = response.pickMade.user*/
                toast.success("Pick made");

            }).catch(error => {
            this.setState({
                isLoading: false
            });

            toast.error(error.message)

        });

    }


    loadVoteProcess() {
        if (this.state.id === null) return;

        let promise = getVotingProcess(this.state.id);


        if (!promise) {
            return;
        }


        promise
            .then(response => {
                response.messages.forEach(message => message.content = message.content.replace(/ /g, "\xa0",));
                this.setState((prevState, props) => ({
                    data: {
                        procId: response.id,
                        users: response.users,
                        user1_actions: response.picks.filter(pick => pick.user.id === response.users[0].id && pick.action === "PICK").map(pick => pick.pickingItem),
                        user2_actions: response.picks.filter(pick => pick.user.id === response.users[1].id && pick.action === "PICK").map(pick => pick.pickingItem),
                        picks: response.picks,
                        possibilities: response.possibilities.filter(function (element) {
                            return !response.picks.some(pick => pick.pickingItem.id === element.id && pick.action === "PICK");
                        }).map(function (element) {
                            if (response.picks.some(pick => pick.pickingItem.id === element.id && pick.action === "DROP")) {
                                return {
                                    item: element,
                                    dropped: true
                                }
                            }
                            else return {
                                item: element,
                                dropped: false
                            }
                        }),
                        // possibilities: response.possibilities,
                        currentStep: response.currentStep,
                        currentUser: response.users[response.currentStep % 2],
                        messages: response.messages,
                        state: response.state,
                    },
                    isLoading: false
                }));
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });


    }

    onMessageReceived(message) {
        const pick = message.pickMade;
        let newPossibilities = this.state.data.possibilities;
        let index = newPossibilities.findIndex(element => element.item.id === pick.pickingItem.id);

        if (pick.action === "PICK") {
            this.updateLists(pick);
            newPossibilities.splice(index, 1);
        }
        else if (pick.action === "DROP") {
            newPossibilities[index].dropped = true;
        }


        this.setState(prevState => ({

            data: {
                ...prevState.data,
                possibilities: newPossibilities,
                currentStep: prevState.data.currentStep + 1,
                currentUser: message.nextUser,
                state: message.newState,
                picks: prevState.data.picks.concat(pick)
            },
            isLoading: false
        }));
        console.log("brefore toast");
        if (message.newState === "FINISHED") {
            console.log("GG");
            toast.success("Voting is over.");
        }
        else if (message.newState === "STARTED" && this.props.currentUse != null && message.pickMade.user.id !== this.props.currentUser.id) {
            toast.success("User " + pick.user.username + " choose to " + pick.action + " " + pick.pickingItem.name + ". Now your turn.");
        }


    }

    updateLists(pickMade) {
        let userVoteId = pickMade.user.id;
        if (userVoteId === this.state.data.users[0].id) {
            this.setState((prevState) => ({
                data: {
                    ...prevState.data,
                    user1_actions: prevState.data.user1_actions.concat(pickMade.pickingItem),
                }
            }))
        }
        else {
            this.setState((prevState) => ({
                data: {
                    ...prevState.data,
                    user2_actions: prevState.data.user2_actions.concat(pickMade.pickingItem),
                }
            }))
        }
    }


    componentDidMount() {
        this.loadVoteProcess();
    }

    componentWillUnmount() {
        this.timer = null;
    }

    renderItemList() {
        let canVote = false;
        let isUserVoting = false;
        if (this.props.currentUser && this.state.data.state === "STARTED" && this.props.currentUser.id === this.state.data.currentUser.id) canVote = true;
        if (this.props.currentUser && this.state.data.users.filter(user => user.id === this.props.currentUser.id).length > 0) isUserVoting = true;
        return (<Col md={8}>
            <SimpleChat users={this.state.data.users} currentUser={this.props.currentUser} procId={this.state.id}
                        messages={this.state.data.messages}/>
            <h1>Maps</h1>
            {this.state.data.state === "FINISHED" ?
                (
                    <div>
                        <h2>Voting is over.</h2>
                        <VotingLogHistory picks={this.state.data.picks}/>
                    </div>
                ) :
                (
                    isUserVoting ? (canVote ? (<h2>Your turn to vote. </h2>) : (<h2>Opponent picking.</h2>)) :
                        <h2>Currently voting: {this.state.data.currentUser.username}</h2>
                )
            }
            <Paper className="voteList">
                {this.state.data.possibilities.map((item, i) => {

                    return (<VoteItem name="vote-item" onClick={this.onChildClick}
                                      canVote={canVote} dropped={item.dropped}
                                      procId={this.state.procId} key={i}
                                      item={item.item}/>)
                })}
            </Paper>
        </Col>)
    }

    render() {
        const {classes} = this.props;

        return (
            <div className="vote-container">
                {
                    !this.props.loadingUser && this.state.data !== null ? (
                        <Row className="show-grid">
                            <Col md={2}>
                                <h2>{this.state.data.users[0].username}'s picks</h2>
                                <Paper>
                                    {this.state.data.user1_actions.map((item, i) => {
                                        return (<img key={i} src={item.imgUrl} alt={item.name}
                                                     className="imgitem"/>)
                                    })}
                                </Paper>
                            </Col>
                            {this.renderItemList()}
                            <Col md={2}>
                                {this.state.data.users[1] ? (
                                        <div>
                                            <h2>{this.state.data.users[1].username}'s picks</h2>
                                            <Paper>
                                                {this.state.data.user2_actions.map((item, i) => {
                                                    return (<img key={i} src={item.imgUrl} alt={item.name}
                                                                 className="imgitem"/>)
                                                })}

                                            </Paper></div>) :
                                    <div>
                                        <h2>
                                            User hasnt joined yet.
                                        </h2>
                                        <Button>Join</Button>

                                    </div>}
                            </Col>
                        </Row>) : null

                }
                {
                    !this.props.loadingUser && !this.state.isLoading && this.state.data === null ? (
                        <Row>
                            <Col mdOffset={4} md={4}>
                                <div className={classes.noVoteFound}>
                                    <span>Voting process not found.</span>
                                </div>
                            </Col>
                        </Row>
                    ) : null
                }
                {
                    this.state.isLoading || this.props.loadingUser ?
                        (<Row>
                            <Col md={4} mdOffset={4} style={{display: "flex"}}>
                                <CircularProgress style={{margin: "10px auto"}}/>
                            </Col>
                        </Row>) : null
                }
                <SockJsClient url='http://localhost:8080/voting-socket' topics={['/topic/proc/' + this.state.id]}
                              onMessage={this.onMessageReceived}/>
            </div>

        );
    }
}

export default Vote;
