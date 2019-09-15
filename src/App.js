import React, { Component } from 'react';
import NavBar from './components/NavBar';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './components/Theme';
import RoutedApp from './routing/routing';
import './App.css';

/**
 * 'App' serves as a colleciton point of lower components before they
 * are sent off to rendering in index.js
 * This gives us a place to inject routing and theming as well as place
 * components that stay constant throughout the experience, such as the
 * NavBar
*/
export default class App extends Component {
    constructor() {
        super();
        this.state = {
            loggedIn: false,
            user: '',
            clickedUsername: '',
            clickedPost: [],
            currentPageNum: 1,
        };
    }

    componentDidMount() {
        const user = sessionStorage.getItem('email') ? {
            email: sessionStorage.getItem('email'),
            username: sessionStorage.getItem('username'),
            password: sessionStorage.getItem('password'),
            url: sessionStorage.getItem('url')
        } : null;
        this.setState({
            loggedIn: user ? true : false,
            user
        });
    }

    updateCurrentPageNum(currentPageNum) {
        this.setState({
            currentPageNum: currentPageNum,
        });
        sessionStorage.setItem('currentPageNum', currentPageNum);
    }

    updateClickedUsername(username) {
        this.setState({
            clickedUsername: username,
        });
        sessionStorage.setItem('clickedUsername', username);
    }

    updateClickedPost(post) {
        this.setState({
            clickedPost: post,
        });
        sessionStorage.setItem('clickedPost', post);
    }

    onSuccess(userEmail, username, password, url) {
        this.setState({
            loggedIn: true,
            user: {
                email: userEmail,
                username: username,
                password: password,
                url: url,
            }
        });
        sessionStorage.setItem('email', userEmail);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('password', password);
        sessionStorage.setItem('url', url);
    }

    logout() {
        this.setState({
            loggedIn: false,
            user: null
        });
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('password');
        sessionStorage.removeItem('url');
    }

    render() {
        return (
            <div className="background">
                <MuiThemeProvider theme={theme}>
                    <div>
                        <NavBar updateClickedUsername={this.updateClickedUsername.bind(this)} user={this.state.user}/>
                        <RoutedApp
                            loggedIn={this.loggedIn}
                            onSuccess={this.onSuccess.bind(this)}
                            logout={this.logout.bind(this)}
                            user={this.state.user}
                            history={true}
                            clickedUsername={this.state.clickedUsername}
                            updateClickedUsername={this.updateClickedUsername.bind(this)}
                            clickedPost={this.state.clickedPost}
                            updateClickedPost={this.updateClickedPost.bind(this)}
                            currentPageNum={this.state.currentPageNum}
                            updateCurrentPageNum={this.updateCurrentPageNum.bind(this)}
                        />
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}


