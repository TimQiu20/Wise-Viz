import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import OrganizerIcon from '@material-ui/icons/AssignmentInd';
import VoteIcon from '@material-ui/icons/HowToVote';
import { navigate } from 'react-mini-router';
import { Drawer, ListItemIcon, Button, ListItemText, ListItem, Divider } from '@material-ui/core';
import img from './resources/profile_pictures/default_profile_picture.png';

import './component_style/NavBar.css';
import HelpView from './Help';

/**
 * The NavBar contains the top AppBar as well as the navigation Drawer on
 * the left side, activated by the hamburger menu icon
 */
export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };

        this.helpChild = React.createRef();
    }

    ChangeView(page) {
        navigate(page);
    }

    toggleDrawer = () => this.setState({ open: !this.state.open });
    closeDrawer = () => this.setState({open: false});

    render() {

        return (
            <div className="root">
                <AppBar position="static" >
                    <Toolbar>
                        <IconButton className="menuButton" color="inherit" aria-label="Menu" onClick={this.toggleDrawer}>
                            <MenuIcon />
                        </IconButton>
                        <div className="layout">
                            <div className="titleAndHome">
                                <h2 className="title">Wise-Vizs</h2>
                                <Button color="inherit" onClick={() => {
                                    this.ChangeView('/');
                                    this.props.updateClickedUsername('');
                                }}>Home</Button>
                            </div>
                            <div className="accountFormat">
                                { this.props.user !== null && (
                                    <img className="roundedCircleArticleImgNavBar"
                                        src={this.props.user.email ? "https://res.cloudinary.com/cjyjimmy520/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/" + this.props.user.url + "/profile_picture/"
                                            + this.props.user.email + '/' + this.props.user.email + ".jpg" : img}
                                        alt="user" onError={(e)=>{e.target.onerror = null; e.target.src=img}}>
                                    </img>
                                )}
                                <Button color="inherit" className="account" onClick={() => {
                                    if (this.props.user == null) {
                                        this.ChangeView('/login');
                                    } else {
                                        this.ChangeView('/user');
                                    }
                                }}>Account</Button>
                            </div>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer open={this.state.open} onClose={this.closeDrawer}>
                    <div tabIndex={0} role="button" onClick={this.closeDrawer}>
                        <div width="250">
                            <ListItem button key='Home' onClick={() => {
                                this.ChangeView('/');
                                this.props.updateClickedUsername('');
                            }} >
                                <ListItemIcon><HomeIcon /></ListItemIcon>
                                <ListItemText primary='Home' />
                            </ListItem>
                            <ListItem button key='Account' onClick={() => {
                                if (this.props.user == null) {
                                    this.ChangeView('/login');
                                } else {
                                    this.ChangeView('/user');
                                }
                            }} >
                                <ListItemIcon><OrganizerIcon /></ListItemIcon>
                                <ListItemText primary='Account' />
                            </ListItem>
                            <Divider />
                            <ListItem button key='Help' onClick={() => this.helpChild.current.handleOpen()}>
                                <ListItemIcon><HelpOutlineIcon /></ListItemIcon>
                                <ListItemText primary='Help' />
                            </ListItem>
                        </div>
                    </div>
                </Drawer>
                <HelpView ref={this.helpChild} />
            </div>
        );
    }
}
