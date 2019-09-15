import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Slide, TextField } from '@material-ui/core';
import './component_style/Register.css';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

/**
 * Invalid new user password or user name view
 */
export default class ChangePageView extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            open: false,
            pageNum: '',
            error: false,
        };
    }

    handleEventChange = field => event => {
        let page = event.target.value;
        this.setState({
            pageNum: page,
        });
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        let page = Number(this.state.pageNum);
        if (page < 1 || page > this.props.totalPages) {
            this.setState({ pageNum: '', error: true });
        } else {
            this.props.choosePage(page);
            this.setState({ open: false, error: false, pageNum: '' });
        }
    };

    handleCloseForCancel = () => {
        this.setState({ open: false, error: false, pageNum: '' });
    }

    render() {
        return(
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogContent className="changePageD">
                        <br />
                        <b>Skip to page </b>
                        <TextField
                            required
                            error={this.state.error}
                            label="(Page Number)"
                            margin="dense"
                            className="pageNumTextField"
                            type="number"
                            value={this.state.pageNum}
                            onChange={this.handleEventChange('pageNum')}
                            InputLabelProps={{ shrink: true }}
                        />
                        { this.state.error && (
                            <p className="error">Error: Please enter a number between 1 and {this.props.totalPages}.</p>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Ok</Button>
                        <Button onClick={this.handleCloseForCancel} color="secondary">Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}