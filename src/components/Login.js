import React from 'react';
import { IconButton, Button, TextField } from '@material-ui/core';
import './component_style/Register.css';
import { navigate } from 'react-mini-router';
import InvalidNewUserView from './InvalidNewUserError';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import GetPasswordDialogView from './GetPasswordDialog';

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
            userData: {
                email: '',
                password: '',
                erroInfo: ''
            },
            items: [],
            showPassword: false,
        };
        this.login = this.login.bind(this);
        this.existEmailAndPasswordCorrect = this.existEmailAndPasswordCorrect.bind(this);
        this.invalidNewUserErrorChild = React.createRef();
        this.checkUserInfoAndLogin = this.checkUserInfoAndLogin.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.GetPasswordChild = React.createRef();
    }

    handleEventChange = field => event => {
        const oldData = this.state.userData;
        oldData[field] = event.target.value;
        this.setState({
            newUserData: oldData,
        });
    }

    onSuccess(email, username, password, url) {
        this.props.onSuccess(email, username, password, url);
        this.ChangeView('/');
    }

    componentDidMount() {
    }

    handleClickShowPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    checkUserInfoAndLogin() {
        let data = {
            email: this.state.userData.email.toLowerCase(),
        };
        let request = new Request('api/user-info/check-email', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data)
        });
        fetch(request)
            .then(response => response.json())
            .then(items => this.setState({items}))
            .then((event) => {
                let data = {
                    email: this.state.userData.email.toLowerCase(),
                    password: this.state.userData.password
                };
                if (this.existEmailAndPasswordCorrect(data.email, data.password)) {
                    this.onSuccess(data.email, this.state.items[0].userName, this.state.items[0].password, this.state.items[0].url);
                } else {
                    let erroInfo = '';
                    if (data.userName === '') {
                        erroInfo = 'Email cannot be empty!';
                    }
                    else {
                        erroInfo = 'The email is not exist or the password is incorrect!';
                    }
                    this.setState({ userData: {
                        email: data.email,
                        password: data.password,
                        erroInfo: erroInfo
                    }});
                    this.invalidNewUserErrorChild.current.handleOpen();
                    this.setState({ userData: {
                        email: '',
                        password: '',
                        erroInfo: this.state.userData.erroInfo
                    }});
                }
            })
            .catch(err => console.log(err));
    }

    existEmailAndPasswordCorrect(email, password) {
        let exist = false;
        for (let itemInd in this.state.items) {
            let each = this.state.items[itemInd];
            if (each.email === email && each.password === password) {
                exist = true;
            }
        }
        return exist;
    }

    login(event) {
        event.preventDefault();
        this.checkUserInfoAndLogin();
    }

    render() {
        return (
            <div className="newUser">
                <InvalidNewUserView ref={this.invalidNewUserErrorChild} errInfo={this.state.userData.erroInfo}/>
                <GetPasswordDialogView ref={this.GetPasswordChild}/>
                <br />
                <h2 className="title" align="center">Log In</h2>
                <br />
                <form className="eventForm" onSubmit={this.login}>
                    <TextField
                        required
                        label="User Email"
                        margin="dense"
                        type="email"
                        className="registerText"
                        value={this.state.userData.email}
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
                        value={this.state.userData.password}
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
                        Login
                    </Button>
                    <br />
                    <p className="forgetPassword" onClick={() => this.GetPasswordChild.current.handleOpen()}>Forget password?</p>
                    <p className="forgetPassword" onClick={() => this.ChangeView('/register')}>Sign Up</p>
                </form>
            </div>
        );
    }

}