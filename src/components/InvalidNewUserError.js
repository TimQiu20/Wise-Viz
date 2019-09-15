import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide } from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

/**
 * Invalid new user password or user name view
 */
export default class InvalidNewUserErrorView extends React.Component {

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
        this.setState({ open: false });
    };

    render() {
        return(
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle>
                        Error information:
                    </DialogTitle>
                    <DialogContent>
                        <br />
                        <b>{this.props.errInfo}</b>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Ok</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}