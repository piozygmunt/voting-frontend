import React from "react";
import './VoteList.css'

export default class VotingLogHistory extends React.Component {
    render() {
        return (
            !!this.props.picks && (
                <ul className="voting-history">
                    {this.props.picks.map(pick => {
                        return (
                            <li key={pick.id}>
                                <b>{pick.user.username}</b> {" chose to " + pick.action + " "}
                                <b>{pick.pickingItem.name}</b>
                            </li>
                        )
                    })}
                </ul>
            )
        )
    }
}