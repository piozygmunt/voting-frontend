import React from "react";
import {getAllInvitations, acceptVotingInvitation, rejectVotingInvitation} from './APIUtils';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import {toast} from 'react-toastify';
import './InvitationList.css'
import Link from 'react-router-dom/Link'
import {withRouter} from 'react-router-dom'


class VoteInvitationItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invitation: props.invitation
        }
    }

    acceptInvite = (invitation) => {
        acceptVotingInvitation(invitation.votingProcess.id)
            .then(response => {
                let updatedInvitation = invitation;
                updatedInvitation.state = "ACCEPTED";
                this.setState({
                    invitation: updatedInvitation
                });

                toast.success(response.message);
            }).catch(error => {
            toast.error(error.debugMessage);
        });
    };

    rejectInvite = (invitation) => {
        console.log(invitation);
        rejectVotingInvitation(invitation.votingProcess.id)
            .then(response => {
                let updatedInvitation = invitation;
                updatedInvitation.state = "REJECTED";
                this.setState({
                    invitation: updatedInvitation
                });
                toast.success(response.message);
            }).catch(error => {
            toast.error(error.message);
        });
    };

    format_date = (date_string) => {
        let date = new Date(date_string);
        return date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0') + ":" + date.getSeconds().toString().padStart(2, '0') + " " +
            date.getDate().toString().padStart(2, '0') + "." + (date.getMonth() + 1).toString().padStart(2, '0') + "." + date.getFullYear().toString();
    }

    isFinished = (invitation) => {
        return invitation.state === "REJECTED" || (invitation.state === "ACCEPTED" && invitation.votingProcess.state === "FINISHED");
    }

    render() {
        const {invitation} = this.state;
        if (invitation)
            return (
                <Paper className={this.isFinished(invitation) ? "inv-list-item finished" : "inv-list-item"}>
                    <div className="inv-state">
                        <span className="prop-name">State: </span> {invitation.state}<br/>
                        <span className="prop-name">When: </span> {this.format_date(invitation.date)}
                        {invitation.state === "ACCEPTED" && (
                            <div><span className="prop-name">Picking state: </span> {invitation.votingProcess.state}
                            </div>)}

                        {this.props.createdByCurrent ? (
                                <div className="proc-info">
                                    <span className="prop-name">Sent to: {invitation.invitedUser.username}</span>
                                </div>) :
                            (<div className="proc-info">
                                <span
                                    className="prop-name">Sent by: {invitation.votingProcess.createdBy.username}</span>
                            </div>)}
                    </div>

                    {invitation.state === "ACCEPTED" && (
                        <div className="proc-info">
                            <Link to={"/vote/" + invitation.votingProcess.id}>
                                <Button>
                                    {invitation.votingProcess.state === "FINISHED" ? "WATCH RESULTS" : "CONTINUE VOTING"}
                                </Button>

                            </Link>
                        </div>
                    )}

                    {invitation.state === "REJECTED" && (
                        this.props.createdByCurrent ? (
                                <div className="proc-info">
                                    <span
                                        className="prop-name">Invitation has been rejected by {invitation.invitedUser.username}</span>
                                </div>)
                            :
                            (
                                <div className="proc-info">
                                    <span className="prop-name">Invitation has been rejected by you</span>
                                </div>
                            )
                    )}

                    {invitation.state === "PENDING" &&
                    (this.props.createdByCurrent ? (
                        <div className="user-info">
                            <span className="prop-name">Waiting for {invitation.invitedUser.username}</span>
                        </div>
                    ) : (
                        <div className="user-info">
                            <span className="prop-name">Invited by {invitation.votingProcess.createdBy.username}</span>
                            <Button onClick={() => this.acceptInvite(invitation)}
                                    className="accept-button">Accept</Button>
                            <Button onClick={() => this.rejectInvite(invitation)} color="secondary">Reject</Button>
                        </div>
                    ))}

                </Paper>);
        else
            return null;

    }
}

const VoteInvitationItemWithRounter = withRouter(VoteInvitationItem);

export default class InvitationList extends React.Component {
    updateList() {
        getAllInvitations()
            .then(response => {
                console.log("LIST");
                console.log(response);
                this.setState({
                    loading: false,
                    invitationList: response,
                })
            }).catch(error => {
            toast.error(error.message);

        });

    }


    divideInvitations = invitations => {
        let map = new Map();
        console.log(invitations);
        console.log("user");
        console.log(this.props.currentUser);
        invitations.forEach(element => {
            let createdByCurrent = element.votingProcess.createdBy.id === this.props.currentUser.id;
            if (map.get(createdByCurrent) === undefined)
                map.set(createdByCurrent, [element]);
            else
                map.get(createdByCurrent).push(element);

        });
        return Array.from(map);
    };

    componentWillMount() {
        this.setState({
            loading: true
        });
        this.updateList()
        // setInterval(this.updateList.bind(this), 2000);
    }

    render() {
        return (
            !this.state.loading && !!this.props.currentUser && !!this.state.invitationList ? (
                <Row>
                    <Col sm={10} smOffset={1} md={8} mdOffset={2}>
                        {this.divideInvitations(this.state.invitationList).map(entry => {
                            return entry[0] ?
                                <div>
                                    <h2>Created by me</h2>
                                    {entry[1].map((invitation, index) => {
                                        return <VoteInvitationItemWithRounter key={index} invitation={invitation}
                                                                              createdByCurrent={true}
                                                                              currentUser={this.props.currentUser}/>
                                    })}
                                </div>
                                :
                                <div>
                                    <h2>Sent to me</h2>
                                    {entry[1].map((invitation, index) => {
                                        return <VoteInvitationItemWithRounter key={index} invitation={invitation}
                                                                              createdByCurrent={false}
                                                                              currentUser={this.props.currentUser}/>
                                    })}
                                </div>
                        })}
                    </Col>

                </Row>

            ) : <CircularProgress/>
        )
    }
}

