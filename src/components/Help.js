import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide } from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

/**
 * Help view
 */
export default class HelpView extends React.Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        return(
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle>
                        Help/About
                    </DialogTitle>
                    <DialogContent>
                        <b>Help: </b>
                        <br /> <br />
                        <b>Each user needs to log in before posting his idea. New users need to sign up first and then go to log in.</b>
                        <br /> <br />
                        <b>After updating your profile picture, you can see your new profile picture by relogining the account.</b>
                        <br /> <br />
                        <b>About: </b>
                        <br /> <br />
                        <b>Wise-Vizs uses forums, as a place for users to socially interact.</b>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Ok</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}