import React from 'react';
import { IconButton, Button, TextField } from '@material-ui/core';
import './component_style/Register.css';
import { navigate } from 'react-mini-router';
import InvalidNewUserView from './InvalidNewUserError';
import RegisterSucceedView from './RegisterSucceed';

import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

/**
 *
 *
 */
export default class Register extends React.Component {
    ChangeView(page) {
        navigate(page);
    }

    constructor(props) {
        super(props);
        this.state = {
            newUserData: {
                userName: '',
                email: '',
                password: '',
                confirmPassword: '',
                erroInfo: ''
            },
            items: [],
            showPassword: false,
        };
        this.addNewAccount = this.addNewAccount.bind(this);
        this.checkUserInfoAndAdd = this.checkUserInfoAndAdd.bind(this);
        this.existUsername = this.existUsername.bind(this);
        this.existEmail = this.existEmail.bind(this);
        this.invalidNewUserErrorChild = React.createRef();
        this.registerSucceedChild = React.createRef();
    }

    handleEventChange = field => event => {
        const oldData = this.state.newUserData;
        oldData[field] = event.target.value;
        this.setState({
            newUserData: oldData,
        });
    }

    handleClickShowPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    componentDidMount() {
    }

    // go to database to check whether the account has been registered and
    // go to check whether the password and reentered password are same
    // if the new account information are all valid, then put the info into DB.
    checkUserInfoAndAdd() {
        let data = {
            userName: this.state.newUserData.userName,
            email: this.state.newUserData.email
        };
        let request = new Request('api/user-info/check-username-email-unique', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data)
        });
        fetch(request)
            .then(response => response.json())
            .then(items => this.setState({items}))
            .then((event) => {
                let data = {
                    userID: Math.random().toString(36).substr(2, 9),
                    userName: this.state.newUserData.userName,
                    password: this.state.newUserData.password,
                    email: this.state.newUserData.email.toLowerCase(),
                };
                let confirmPassword = this.state.newUserData.confirmPassword;
                if (confirmPassword === data.password && !this.existUsername(data.userName)
                    && !this.existEmail(data.email)) {
                    let request = new Request('api/user-info/post', {
                        method: 'POST',
                        headers: new Headers({ 'Content-Type': 'application/json' }),
                        body: JSON.stringify(data)
                    });

                    fetch(request)
                        .then(function(response) {
                            response.json().then(function(data) {
                            })
                    });
                    this.registerSucceedChild.current.handleOpen();
                } else {
                    let erroInfo = '';
                    if (data.userName === '') {
                        erroInfo = 'Username cannot be empty!';
                    }
                    else if (this.existUsername(data.userName)) {
                        erroInfo = 'The username is registered by the other person!';
                    }
                    else if (this.existEmail(data.email)) {
                        erroInfo = 'The email is used by the other person!';
                    }
                    else if (data.password !== data.confirmPassword) {
                        erroInfo = 'The password and the reentered Password are different!';
                    }
                    this.setState({ newUserData: {
                        userName: data.userName,
                        password: data.password,
                        confirmPassword: confirmPassword,
                        email: data.email,
                        erroInfo: erroInfo
                    }});
                    this.invalidNewUserErrorChild.current.handleOpen();
                    this.setState({ newUserData: {
                        userName: '',
                        password: '',
                        confirmPassword: '',
                        email: '',
                        erroInfo: this.state.newUserData.erroInfo
                    }});
                }
            })
            .catch(err => console.log(err))
    }

    existUsername(username) {
        let exist = false;
        for (let itemInd in this.state.items) {
            let each = this.state.items[itemInd];
            if (each.userName === username) {
                exist = true;
            }
        }
        return exist;
    }

    existEmail(email) {
        let exist = false;
        for (let itemInd in this.state.items) {
            let each = this.state.items[itemInd];
            if (each.email === email) {
                exist = true;
            }
        }
        return exist;
    }

    addNewAccount(event) {
        event.preventDefault();
        this.checkUserInfoAndAdd();
    }

    render() {
        return (
            <div className="newUser">
                <br />
                <InvalidNewUserView ref={this.invalidNewUserErrorChild} errInfo={this.state.newUserData.erroInfo}/>
                <RegisterSucceedView ref={this.registerSucceedChild}/>
                <h2 className="title" align="center">New User</h2>
                <br />
                <form className="eventForm" onSubmit={this.addNewAccount}>
                    <TextField
                        required
                        label="User Name"
                        margin="dense"
                        className="registerText"
                        value={this.state.newUserData.userName}
                        onChange={this.handleEventChange('userName')}
                        InputLabelProps={{ shrink: true }}
                    />
                    <br />
                    <TextField
                        required
                        label="Email"
                        margin="dense"
                        className="registerText"
                        type="email"
                        value={this.state.newUserData.email}
                        onChange={this.handleEventChange('email')}
                        InputLabelProps={{ shrink: true }}
                    />
                    <br />
                    <TextField
                        required
                        label="Password"
                        type={this.state.showPassword ? 'text' : 'password'}
                        margin="dense"
                        className="registerText"
                        value={this.state.newUserData.password}
                        onChange={this.handleEventChange('password')}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        aria-label="Toggle password visibility"
                                        onClick={this.handleClickShowPassword}
                                    >
                                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                          ),
                        }}
                    />
                    <br />
                    <TextField
                        required
                        label="Confirm Password"
                        type={this.state.showPassword ? 'text' : 'password'}
                        margin="dense"
                        className="registerText"
                        value={this.state.newUserData.confirmPassword}
                        onChange={this.handleEventChange('confirmPassword')}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        aria-label="Toggle password visibility"
                                        onClick={this.handleClickShowPassword}
                                    >
                                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                          ),
                        }}
                    />
                    <br /> <br />
                    <Button
                        variant="contained"
                        className="buttons"
                        type="button"
                        onClick={() => this.ChangeView('/')}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        className="buttons"
                        type="submit"
                        color="primary"
                    >
                        Register
                    </Button>
                </form>
            </div>
        );
    }

}