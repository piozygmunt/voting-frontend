import React from "react";
import {getAllVotingProcess} from './APIUtils';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import {toast} from 'react-toastify';
import './VoteList.css'
import Link from 'react-router-dom/Link'

import LinearProgress from '@material-ui/core/LinearProgress'

class VoteListItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            votingList: null,
        }
    }

    render() {
        const {proc} = this.props;
        let prnt = proc.currentStep / (proc.actionString.length - 1) * 100;
        let currentID = proc.currentStep % 2;
        console.log(prnt);
        return (<Paper className="proc-list-item">
            <div><span className="prop-name">ID: </span> {this.props.proc.id}</div>
            <div><span className="prop-name">Method: </span> {this.props.proc.actionString}</div>
            <div><span className="prop-name">Users: </span> {this.props.proc.users[0].username} <span
                className="prop-name"> vs. </span> {this.props.proc.users[1] ? (this.props.proc.users[1].username) : null}
            </div>
            <div><span className="prop-name">State: </span> {this.props.proc.state}</div>
            {this.props.proc.state === "STARTED" &&
            <div><span className="prop-name">Current picker: </span> {this.props.proc.users[currentID].username}</div>}
            <div className="progress-wrapper">
                <div style={{marginBottom: "6px"}}><span className="prop-name">Progress: </span></div>
                <LinearProgress variant="determinate" value={prnt}/>
            </div>
            {this.props.proc.state === "STARTED" && <CircularProgress size={25} className="circular-prog"/>}
            <div className="buttons">
                <Link to={"/vote/" + this.props.proc.id}>
                    <Button >Watch</Button>
                </Link>
                {!!this.props.currentUser &&this.props.currentUser.id === proc.createdBy.id && <Button color="secondary">Delete</Button>}

            </div>
            {(!!proc.votingInvitation && !!this.props.currentUser && proc.votingInvitation.invitedUser.id === this.props.currentUser.id) &&
            <span>You are invited for this shit</span>
            }
        </Paper>)
    }
}


export default class VoteList extends React.Component {
    updateList() {
        getAllVotingProcess()
            .then(response => {
                console.log("LIST")
                console.log(response)
                this.setState({
                    loading: false,
                    votingList: response,
                })
            }).catch(error => {
            toast.error(error.message);

        });

    }

    componentWillMount() {
        this.setState({
            loading: true
        });
        this.updateList()
        // setInterval(this.updateList.bind(this), 2000);
    }

    render() {
        return (
            !this.state.loading ? (
                <Row>
                    <Col sm={6} smOffset={3} md={6} mdOffset={3}>
                        {this.state.votingList.map((proc, index) => {
                            return <VoteListItem key={index} proc={proc} currentUser={this.props.currentUser}/>
                        })}
                    </Col>
                    <Tooltip title="Create new process voting">
                        <Link to="/vote" className={"add-proc-btn"}>
                            <Button variant="fab" color="secondary">
                                <AddIcon/>
                            </Button>
                        </Link>
                    </Tooltip>
                </Row>

            ) : <CircularProgress/>
        )
    }
}

