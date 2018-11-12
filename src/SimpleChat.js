import React from "react";
import {sendMessage} from "./APIUtils.js";
import SockJsClient from 'react-stomp';
import Button from '@material-ui/core/Button';
import {ValidatorForm} from 'react-form-validator-core';
import './SimpleChat.css'
import ChatBubbleOutlinedIcon from '@material-ui/icons/ChatBubble'
import TextValidator from './common/TextValidator';
import FormControl from '@material-ui/core/FormControl'
import withWidth, {isWidthUp} from '@material-ui/core/withWidth';


class SimpleChat extends React.Component {
    constructor(props) {
        super();
        this.state = {
            text: '',
            messages: props.messages,
            procId: props.procId,
            toggled: false
        };
        this.chatBoxRef = React.createRef();
        this.onMessageReceived = this.onMessageReceived.bind(this);
    }

    componentDidMount() {

        if (this.state.toggled) {
            const node = this.chatBoxRef.current;
            node.scrollTop = node.scrollHeight;

        }
    }

    onMessageReceived(message) {
        console.log(message);
        message.content = message.content.replace(/ /g, "\xa0",);
        let updated_messages = this.state.messages.concat(message).slice(-5);
        this.setState((prevState) => {
            return {
                ...prevState,
                messages: updated_messages
            }
        });
        if (this.state.toggled) {
            const node = this.chatBoxRef.current;
            node.scrollTop = node.scrollHeight;
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();
        sendMessage({content: this.state.text}, this.state.procId).then(response => {
            console.log(response);
            this.setState(prevState => {
                return {
                    ...prevState,
                    text: ''
                }
            });
        });
    };

    handleChange = event => {
        const {name, value} = event.target;
        this.setState((prevState) => {
            return {
                ...prevState,
                [name]: value,
            }
        });
        this.mapToList(this.state.messages);
    };

    handleChatHeaderClick = event => {
        this.setState(prevState => {
            return {
                ...prevState,
                toggled: !prevState.toggled
            }
        });
    };


    mapToList = (array) => {
        let map = new Map();
        array.forEach(element => {
            let date = new Date(element.timestamp);
            let date_str = date.getDate().toString().padStart(2, '0') + "." + (date.getMonth() + 1).toString().padStart(2, '0') + "." + date.getFullYear();
            if (map.get(date_str) === undefined)
                map.set(date_str, [element]);
            else
                map.get(date_str).push(element);

        });
        return Array.from(map);
    };

    format_date = (date_string) => {
        let date = new Date(date_string);
        return date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0') + ":" + date.getSeconds().toString().padStart(2, '0');
    };

    render() {
        return (
            <div className={isWidthUp('md', this.props.width) ? "chat fixed-chat" : "chat"}>
                <div className="chat-header" onClick={this.handleChatHeaderClick}>
                    <h3>Chat</h3>
                    <ChatBubbleOutlinedIcon/>
                </div>
                {this.state.toggled && (
                    <div className="chat-text">
                        <div className="chat-box" ref={this.chatBoxRef}>
                            {!!this.state.messages && (
                                this.mapToList(this.state.messages).map(entry => {
                                    return (
                                        <div key={entry[0]} className="date-messages">
                                            <div className="date-divider">
                                                <div className="divider"></div>
                                                <div className="date">{entry[0]}</div>
                                            </div>
                                            <ul className='message-list'>
                                                {entry[1].map(message => {
                                                    return (
                                                        <li key={message.id}
                                                            className={!!this.props.currentUser && message.username === this.props.currentUser.username ? 'right' : undefined}>
                                                            <div
                                                                className="msg-author-avatar">{message.username.toUpperCase()[0]}</div>
                                                            <div className="msg-wrapper">
                                                                <div className="msg-author">{message.username}</div>
                                                                <div className="msg-content">{message.content}</div>
                                                                <div
                                                                    className="msg-timestamp">{this.format_date(message.timestamp)}</div>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>

                                        </div>)
                                }))
                            }
                        </div>


                        {!!this.props.users && !!this.props.currentUser && this.props.users.map(user => user.id).includes(this.props.currentUser.id) && (
                            <ValidatorForm style={{display: "flex", flexDirection: "row", borderTop: "1px solid grey"}}
                                           onSubmit={this.handleSubmit}>

                                <FormControl fullWidth style={{width: "70%"}}>
                                    <TextValidator
                                        id="text-multiline"
                                        label="text"
                                        name="text"
                                        value={this.state.text}
                                        onChange={this.handleChange}
                                        margin="normal"
                                        style={{margin: "1.5rem 1rem", width: "100%"}}
                                        variant="outlined"
                                        validators={['required']}
                                        errorMessages={['connot send empty message']}
                                    />
                                </FormControl>

                                <Button variant="contained" type="submit" color="primary" size="small"
                                        style={{margin: "1.5rem auto"}}>
                                    Send
                                </Button>

                            </ValidatorForm>)}
                    </div>)}
                <SockJsClient url='http://localhost:8080/voting-socket' topics={['/topic/chat/' + this.props.procId]}
                              onMessage={this.onMessageReceived}/>
            </div>)
    }
}

export default withWidth()(SimpleChat);