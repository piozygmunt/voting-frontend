import React, {Component} from 'react';
import {login, notifications} from '../APIUtils';
import {ACCESS_TOKEN} from '../constants';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import './Login.css'
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import TextValidator from './../common/TextValidator'
import {ValidatorForm} from 'react-form-validator-core';
import Paper from '@material-ui/core/Paper';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'react-router-dom/Link'

import {Redirect, withRouter} from "react-router-dom";


class Login extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            username: '',
            password: '',
            loading: false,
            redirectToReferrer: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const loginRequest = Object.assign({}, {
            username: this.state.username,
            password: this.state.password

        });

        this.setState({
            loading: true
        });

        console.log("username: " + this.state.username + " password: " + this.state.password);

        login(loginRequest)
            .then(response => {
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                console.log("TAK");
                this.setState({
                    redirectToReferrer: true
                });

                this.props.onAuth();
                notifications();
            }).catch(error => {
            toast.error(error.message);
            this.setState({
                loading: false
            });

        });
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    render() {
        const {from} = this.props.location.state || {from: {pathname: '/'}};
        console.log("FROM");
        console.log(from);
        const {redirectToReferrer} = this.state;

        if (redirectToReferrer === true ) {
            return <Redirect to={from.pathname}/>
        }

        return (
            <Row>
                <Col md={6} mdOffset={3}>
                    <Paper style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                        {this.state.loading ? (
                            <CircularProgress style={{marginLeft: "10px"}} size={30}/>) : null}
                        <ValidatorForm
                            className="login-form" onSubmit={this.handleSubmit}
                        >
                            <h2>Login</h2>
                            <TextValidator
                                label="username"
                                onChange={this.handleChange}
                                name="username"
                                type="text"
                                validators={['required', 'maxStringLength:8', 'minStringLength: 2']}
                                errorMessages={['this field is required', 'username length has to be between 2 and 5', 'username length has to be between 2 and 5']}
                                value={this.state.username}
                            />
                            <TextValidator
                                label="password"
                                onChange={this.handleChange}
                                name="password"
                                type="password"
                                validators={['required']}
                                errorMessages={['this field is required']}
                                value={this.state.password}
                            />
                            <Button type="submit" variant="contained" color="primary"
                                    style={{margin: "1.5rem auto 0.5rem auto", width: "50%"}}>
                                Sign in
                            </Button>
                            <p style={{textAlign: "center"}}>or {" "}
                                <Link to="/register">Sign up</Link>
                                {" "} here
                            </p>
                        </ValidatorForm>
                    </Paper>
                </Col>
            </Row>
        );
    }
}

export default withRouter(Login);