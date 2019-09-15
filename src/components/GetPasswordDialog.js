import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Slide, TextField } from '@material-ui/core';
import { navigate } from 'react-mini-router';
import './component_style/Register.css';
import axios from 'axios';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

/**
 * Invalid new user password or user name view
 */
export default class GetPasswordDialogView extends React.Component {

    ChangeView(page) {
        navigate(page);
    }

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            email: '',
            invalidEmail: false,
            item: [],
            sendEmainEnable: false,
            currentState: "Send Email",
        };
        this.validateEmail = this.validateEmail.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.disableSendEmailBtn = this.disableSendEmailBtn.bind(this);
        this.sixtySec = this.sixtySec.bind(this);
    }

    handleEventChange = () => event => {
        this.setState({
            email: event.target.value,
            invalidEmail: false,
        });
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    validateEmail (email) {
        let re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    disableSendEmailBtn () {
        this.setState({sendEmainEnable: true});
        let countdown = 30;
        this.sixtySec(countdown);
    }

    sixtySec (time) {
        if (time > 0) {
            setTimeout(this.sixtySec, 1000, time - 1);
            this.setState({ currentState:'Resend Email (' + time + ')' });
        } else {
            this.setState({ currentState:'Resend Email' });
            this.setState({sendEmainEnable: false });
        }
    }

    getUserInfo() {
        let data = {
            email: this.state.email.toLowerCase()
        };
        let request = new Request('api/user-info/check-email', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data)
        });
        fetch(request)
            .then(response => response.json())
            .then(item => this.setState({item}))
            .then(() => this.handleSubmit(this.state.email.toLowerCase(), this.state.item))
            .catch(err => console.log(err));
    }

    handleSubmit(email, user){
        const message = 'Hi, ' + user[0].userName + '\n \nYour password: '
            + user[0].password + '\nHave a good day with Wise-Viz. ^_^'
            + '\n \nBest, \n \nWise-Viz';
        this.disableSendEmailBtn();
        axios({
            method: "POST",
            url:"send",
            data: {
                email: email,
                message: message
            }
        }).then((response)=>{
            if (response.data.msg === 'success'){
                alert("Message Sent.");
            }else if(response.data.msg === 'fail'){
                alert("Message failed to send.")
            }
        })
    }

    sendEmail () {
        let email = this.state.email.toLowerCase();
        let result = this.validateEmail(email);
        if (!result) {
            this.setState({ invalidEmail:!result });
        } else {
            this.getUserInfo();
        }
    }

    render() {
        return(
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle>
                        Get Back Password
                    </DialogTitle>
                    <DialogContent>
                        <br />
                        <p>Please enter the user email to get back the password.</p>
                        <form className="sendEmail">
                            <TextField
                                error={this.state.invalidEmail}
                                label={this.state.invalidEmail ? "The email is invalid!" : "User Email"}
                                margin="dense"
                                className="registerText"
                                value={this.state.email}
                                onChange={this.handleEventChange()}
                                InputLabelProps={{ shrink: true }}
                            />
                            <Button
                                onClick={() => this.sendEmail()}
                                color="primary"
                                variant="contained"
                                disabled={this.state.sendEmainEnable}
                                >{this.state.currentState}</Button>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Go Back</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}