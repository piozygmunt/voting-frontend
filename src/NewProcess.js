import React from "react";
import {getAllItems, getUsers, createVotingRequest} from './APIUtils';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Button from '@material-ui/core/Button';
import {ValidatorForm} from 'react-form-validator-core';
import TextValidator from './common/TextValidator';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import SelectWrapped from './common/selectElements'
import 'react-select/dist/react-select.css';




import {withStyles} from '@material-ui/core/styles';


import {toast} from 'react-toastify';
import './VoteList.css'



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


class NewProcess extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            selectErrors: null,
            userErrors: null,
            actionString: '',
            items: [],
            user:null
        }
    }

    handleChange = event => {
        console.log("CHANGE");
        console.log(this.state.selected);
        const {name, value} = event.target;

        console.log(name);
        console.log(value);


        this.setState((prevState) => {
            return {
                ...prevState,
                [name]: value,
            }
        });
    };

    handleSubmit = () => {
        if(this.validateFields()) {

            const request = {
                actionString: this.state.actionString,
                items: this.state.items,
                user: this.state.user,
            };
            console.log(request);

            createVotingRequest(request)
                .then(response => {
                    console.log("TAK");
                    console.log(response);
                    toast.info(response.message);
                    this.props.history.push("/");
                }).catch(error => {
                toast.error(error.message);
                this.setState({
                    loading: false
                });

            });
        }
    }




    validateFields = () => {

        if (this.state.actionString && this.state.items.length !== this.state.actionString.length +1) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    selectErrors: "there's need to be exactly (n+1) items, n=action string length",
                }
            });
            return false
        }
        else {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    selectErrors: null,
                }
            });
        }

        if (this.state.user === null) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    userErrors: "you need to pick one user",
                }
            });
            return false
        }
        else {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    userErrors: null,
                }
            });
        }
        return true;
    };

    handleChangeSelect = name => value => {
        console.log(name);
        console.log(value);
        this.setState((prevState) => {
            return {
                ...prevState,
                [name]: value,
            }
        });

    };

    getItems = (input) => {


        return getAllItems(input)
            .then((json) => {
                console.log(json);
                return { options: json };
            });
    };

    getUsers = (input) => {


        return getUsers(input)
            .then((json) => {
                console.log(json);
                let list = json;
                console.log(list);
                console.log(list.filter(user => user.id !== this.props.currentUser.id));
                return { options: list.filter(user => user.id !== this.props.currentUser.id) };
            });
    };


    render() {
        const {classes} = this.props;
        return (
            this.state.loading && (
                <Row>
                    <Col md={6} mdOffset={3}>
                        <Paper style={{display: "flex", flexDirection:"row", justifyContent:"center"}}>
                            <ValidatorForm style={{display: "flex", flexDirection:"column"}} onSubmit={this.handleSubmit}>
                                    <h2>Sign up</h2>

                                <FormControl fullWidth className={classes.formControl}>
                                    <TextValidator
                                        label="action string"
                                        onChange={this.handleChange}
                                        name="actionString"
                                        type="text"
                                        validators={['required', 'matchRegexp:^(D|P)+$', 'minStringLength: 2']}
                                        errorMessages={['this field is required', 'only D or P characters are valid', 'minimum action string size is 2']}
                                        value={this.state.actionString}
                                    />
                                </FormControl>

                                <FormControl fullWidth className={classes.formControl}>

                                    <Input
                                        fullWidth
                                        inputComponent={SelectWrapped}
                                        onChange={this.handleChangeSelect('items')}
                                        placeholder="Search items"
                                        id="react-select-items"
                                        error={!!this.state.selectErrors}
                                        inputProps={{
                                            name: 'react-select-items',
                                            instanceId: 'react-select-items',
                                            value: this.state.items,
                                            valueKey:"id",
                                            labelKey:"name",
                                            loadOptions:this.getItems,
                                            multi:true,
                                        }}
                                    />
                                    <FormHelperText htmlFor="select-multiple-chip" error={!!this.state.selectErrors}>
                                        {this.state.selectErrors}
                                    </FormHelperText>
                                </FormControl>


                                <FormControl fullWidth className={classes.formControl}>

                                <Input
                                    fullWidth
                                    inputComponent={SelectWrapped}
                                    onChange={this.handleChangeSelect('user')}
                                    placeholder="Search user"
                                    id="react-select-single"
                                    error={!!this.state.userErrors}
                                    inputProps={{
                                        name: 'react-select-single',
                                        instanceId: 'react-select-single',
                                        value: this.state.user,
                                        valueKey:"id",
                                        labelKey:"username",
                                        loadOptions:this.getUsers,
                                    }}
                                />
                                    <FormHelperText htmlFor="select-multiple-chip" error={!!this.state.userErrors}>
                                        {this.state.userErrors}
                                    </FormHelperText>
                                </FormControl>

                                <Button type="submit" variant="contained" color="primary"
                                        style={{margin: "1.5rem auto", width: "40%"}}>
                                    Send
                                </Button>
                            </ValidatorForm>

                        </Paper>
                    </Col>
                </Row>
            ));
    }
}


export default withStyles(styles, {withTheme: true})(NewProcess);