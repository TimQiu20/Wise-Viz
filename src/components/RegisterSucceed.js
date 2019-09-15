import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Slide } from '@material-ui/core';
import { navigate } from 'react-mini-router';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

/**
 * Invalid new user password or user name view
 */
export default class RegisterSucceedView extends React.Component {

    ChangeView(page) {
        navigate(page);
    }

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            errInfo: ''
        };
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.ChangeView('/');
    };

    render() {
        return(
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogContent>
                        <br />
                        <b>Congratulation! You have your own account. Please go to login page to login ^_^!</b>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Ok</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}