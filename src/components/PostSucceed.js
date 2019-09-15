import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Slide } from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

/**
 * Invalid new user password or user name view
 */
export default class PostSucceedView extends React.Component {

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
        this.props.handleCreatePostClose();
        this.setState({ open: false });
    };

    render() {
        return(
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition}>
                    <DialogContent>
                        <br />
                        <b>Post successfully ^_^!</b>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary" type="Button">Ok</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}