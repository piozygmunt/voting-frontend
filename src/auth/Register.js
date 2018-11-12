import React, {Component} from 'react';
import {checkEmailAvailability, checkUsernameAvailability, signup} from '../APIUtils';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button';
import {ValidatorForm} from 'react-form-validator-core';
import TextValidator from '../common/TextValidator.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from 'react-router-dom/Link'


import Paper from '@material-ui/core/Paper';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {withStyles} from "@material-ui/core/styles/index";

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
        maxWidth: 300,
    }

});

class Register extends Component {
    validateEmail = (value) => {

        this.setState((prevState) => ({
            ...prevState,
            checking: {
                email: true,
                username: prevState.checking.username
            },
        }));

        checkEmailAvailability(value).then(response => {
            this.setState((prevState) => ({
                ...prevState,
                errors: {
                    email: response.success ? '' : 'email already taken',
                    username: prevState.errors.username
                },
                checking: {
                    email: false,
                    username: prevState.checking.username
                },
            }))
        })
            .catch(error => {

            });
    };
    validateUsername = (value) => {

        this.setState((prevState) => ({
            ...prevState,
            checking: {
                email: prevState.checking.email,
                username: true
            },
        }));

        checkUsernameAvailability(value).then(response => {
            this.setState((prevState) => ({
                ...prevState,
                errors:
                    {
                        username: response.success ? '' : 'username already taken',
                        email:
                        prevState.errors.email
                    }
                ,
                checking: {
                    email: prevState.checking.email,
                    username: false
                },
            }))
        })
            .catch(error => {

            });
    };

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            username: '',
            password: '',
            email: '',
            repeatPassword: '',
            errors: {
                username: '',
                email: ''
            },
            checking: {
                username: false,
                email: false
            },
            loading: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.password) {
                return false;
            }
            return true;
        });

    }

    handleSubmit(event) {
        event.preventDefault();

        this.validateEmail(this.state.email);
        this.validateUsername(this.state.username);

        const signupRequest = Object.assign({}, {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email

        });

        this.setState({
            loading: true
        });

        console.log("username: " + this.state.username + " password: " + this.state.password);

        signup(signupRequest)
            .then(response => {
                console.log("TAK");
                this.props.history.push("/");
                toast.info("Signed up succesfully. You can now login.");
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

        if (name === "username") {
            this.validateUsername(value);
        }
        else if (name === "email") {
            this.validateEmail(value);
        }

    }

    render() {
        const {classes} = this.props;

        return (
            <Row>
                <Col md={6} mdOffset={3}>
                    <Paper style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                        <ValidatorForm style={{display: "flex", flexDirection: "column"}} onSubmit={this.handleSubmit}>
                            <h2>Sign up</h2>

                            <FormControl fullWidth className={classes.formControl}>
                                <TextValidator
                                    label="username"
                                    onChange={this.handleChange}
                                    name="username"
                                    type="text"
                                    validators={['required', 'minStringLength: 2']}
                                    errorMessages={['this field is required', 'minimum username size is 2']}
                                    value={this.state.username}
                                    error={!!this.state.errors.username}
                                    helperText={this.state.errors.username}
                                    InputProps={{
                                        endAdornment: !!this.state.checking.username &&
                                        <CircularProgress size={25}/>,
                                    }}
                                />

                            </FormControl>

                            <FormControl fullWidth className={classes.formControl}>
                                <TextValidator
                                    label="email"
                                    onChange={this.handleChange}
                                    name="email"
                                    type="text"
                                    validators={['required', 'isEmail']}
                                    errorMessages={['this field is required', 'email is not vaild']}
                                    value={this.state.email}
                                    error={!!this.state.errors.email}
                                    helperText={this.state.errors.email}
                                    InputProps={{
                                        endAdornment: !!this.state.checking.username &&
                                        <CircularProgress size={25}/>,
                                    }}
                                />
                            </FormControl>


                            <FormControl fullWidth className={classes.formControl}>
                                <TextValidator
                                    label="password"
                                    onChange={this.handleChange}
                                    name="password"
                                    type="password"
                                    validators={['required', 'minStringLength: 2']}
                                    errorMessages={['this field is required', 'only D or P characters are valid', 'minimum password size is 2']}
                                    value={this.state.password}
                                />
                            </FormControl>

                            <FormControl fullWidth className={classes.formControl}>
                                <TextValidator
                                    label="repeatPassword"
                                    onChange={this.handleChange}
                                    name="repeatPassword"
                                    type="password"
                                    validators={['required', 'isPasswordMatch', 'minStringLength: 2']}
                                    errorMessages={['this field is required', 'passwords don\'t match', 'minimum password is 2']}
                                    value={this.state.repeatPassword}
                                />
                            </FormControl>

                            <Button type="submit" variant="contained" color="primary"
                                    style={{margin: "1.5rem auto 0.5rem auto", width: "50%"}}>
                                Sign up
                            </Button>
                            <p style={{textAlign: "center"}}>or {" "}
                                <Link to="/login">Login</Link>
                                {" "} here
                            </p>
                        </ValidatorForm>

                    </Paper>
                </Col>
            </Row>
        );
    }
}

export default withStyles(styles, {withTheme: true})(Register);