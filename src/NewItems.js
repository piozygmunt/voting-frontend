import React, {Component} from 'react';
import {addNewItems, checkImUrlAvailability, checkItemNameAvailability} from './APIUtils';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button';
import {ValidatorForm} from 'react-form-validator-core';
import TextValidator from './common/TextValidator.js';
import CircularProgress from '@material-ui/core/CircularProgress';
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

class NewItems extends Component {
    validateNames = (value) => {

        console.log(value);

        const itemRequest = Object.assign({}, {
            field: value,
        });

        this.setState((prevState) => ({
            ...prevState,
            checking: {
                names: true,
                urls: prevState.checking.urls
            },
        }));

        checkItemNameAvailability(itemRequest).then(response => {
            console.log(response);
            this.setState((prevState) => ({
                ...prevState,
                errors: {
                    names: response.success ? '' : 'some names already taken',
                    urls: prevState.errors.urls
                },
                checking: {
                    names: false,
                    urls: prevState.checking.urls
                },
            }))
        })
            .catch(error => {
                console.log("names error");
                console.log(error);
            });
    };
    validateImgUrls = (value) => {

        console.log(value);

        const itemRequest = Object.assign({}, {
            field: value,
        });

        this.setState((prevState) => ({
            ...prevState,
            checking: {
                names: prevState.checking.names,
                urls: true
            },
        }));

        checkImUrlAvailability(itemRequest).then(response => {
            this.setState((prevState) => ({
                ...prevState,
                errors:
                    {
                        urls: response.success ? '' : 'urls already taken or not valid',
                        names: prevState.errors.names
                    }
                ,
                checking: {
                    names: prevState.checking.names,
                    urls: false
                },
            }))
        })
            .catch(error => {
                console.log("urls error");
                console.log(error);
            });
    };

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            names: '',
            urls: '',
            errors: {
                names: '',
                urls: ''
            },
            checking: {
                names: false,
                urls: false
            },
            loading: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        this.validateNames(this.state.names);
        this.validateImgUrls(this.state.urls);

        const newItemsRequest = Object.assign({}, {
            names: this.state.names,
            urls: this.state.urls,

        });

        this.setState({
            loading: true
        });

        console.log(newItemsRequest);

        addNewItems(newItemsRequest)
            .then(response => {
                console.log("TAK");
                this.props.history.push("/");
                toast.info("Successfully added new items.");
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

        if (name === "names") {
            this.validateNames(value);
        }
        else if (name === "urls") {
            this.validateImgUrls(value);
        }

    }

    render() {
        const {classes} = this.props;

        return (
            <Row>
                <Col md={6} mdOffset={3}>
                    <Paper style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                        <ValidatorForm style={{display: "flex", flexDirection: "column"}} onSubmit={this.handleSubmit}>
                            <h2>Add new items</h2>

                            <FormControl fullWidth className={classes.formControl}>
                                <TextValidator
                                    label="names"
                                    onChange={this.handleChange}
                                    name="names"
                                    type="text"
                                    multiline={true}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    value={this.state.names}
                                    error={!!this.state.errors.names}
                                    helperText={this.state.errors.names}
                                    InputProps={{
                                        endAdornment: !!this.state.checking.names &&
                                        <CircularProgress size={25}/>,
                                    }}
                                />

                            </FormControl>

                            <FormControl fullWidth className={classes.formControl}>
                                <TextValidator
                                    label="urls"
                                    onChange={this.handleChange}
                                    name="urls"
                                    type="text"
                                    multiline={true}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    value={this.state.urls}
                                    error={!!this.state.errors.urls}
                                    helperText={this.state.errors.urls}
                                    InputProps={{
                                        endAdornment: !!this.state.checking.urls &&
                                        <CircularProgress size={25}/>,
                                    }}
                                />
                            </FormControl>


                            <Button type="submit" variant="contained" color="primary"
                                    style={{margin: "1.5rem auto 0.5rem auto", width: "50%"}}>
                                Add items
                            </Button>
                        </ValidatorForm>

                    </Paper>
                </Col>
            </Row>
        );
    }
}

export default withStyles(styles, {withTheme: true})(NewItems);