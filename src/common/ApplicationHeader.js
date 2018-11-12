import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Link from 'react-router-dom/Link'
import React, {Component} from 'react';
import './ApplicationHeader.css'


class ApplicationHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        }
    }
    componentWillReceiveProps(props) {
        console.log("changing props header");
        console.log(props);
    }

    handleMenu = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    render() {
        console.log("current user header");
        console.log(this.props.currentUser);
        const {anchorEl} = this.state;
        const open = anchorEl != null;
        console.log("open " + open);
        return (
            <AppBar position="static">
                <Toolbar>
                    <IconButton color="inherit" aria-label="Menu">
                        <MenuIcon/>
                    </IconButton>
                    <Link to="/" className={'headerLink'}>
                        <Typography variant="title" color="inherit">
                            OverVote
                        </Typography>
                    </Link>
                    {!this.props.currentUser ?
                        (<React.Fragment>
                                <Typography color="inherit" style={{marginLeft: "auto"}}>
                                    <Link to="/register" className={'headerLink'}>Register</Link>
                                </Typography>
                                <Typography color="inherit">
                                    <Link to="/login" className={'headerLink'}>Login</Link>
                                </Typography>
                            </React.Fragment>
                        ) : (

                            <div style={{marginLeft: "auto"}}>
                                <IconButton
                                    aria-owns={open ? 'menu-appbar' : null}
                                    aria-haspopup="true"
                                    onClick={this.handleMenu}
                                    color="inherit"
                                >
                                    <Typography color="inherit"
                                                style={{marginRight: "5px"}}>{this.props.currentUser.username}</Typography>
                                    <AccountCircle/>
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={open}
                                    onClose={this.handleClose}
                                >
                                    <MenuItem >
                                        <Link className="menu-link" to="/user/invitations" >Invitations</Link>
                                    </MenuItem>
                                    <MenuItem >
                                        <Link className="menu-link" to="/items" >Add items</Link>
                                    </MenuItem>
                                    <MenuItem onClick={this.props.logout}>Logout</MenuItem>

                                </Menu>
                            </div>)}
                </Toolbar>
            </AppBar>);

    }
}

export default ApplicationHeader
