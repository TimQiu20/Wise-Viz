import React from 'react';
import { Button } from 'react-bootstrap';
import './component_style/MainPage.css';
import img from './resources/profile_pictures/default_profile_picture.png';
import { navigate } from 'react-mini-router';
import ChangePageView from './ChangePage';
import Moment from 'react-moment';

export default class Post extends React.Component {

    ChangeView(page) {
        navigate(page);
    }

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            numOfPosts: 0,
            currentPage: this.props.clickedUsername === '' ? this.props.currentPageNum : 1,
            numOfPages: 0,
            currentShownPosts: [],
            buttons: [],
        }
        this.getPosts = this.getPosts.bind(this);
        this.getPageButtons = this.getPageButtons.bind(this);
        this.updateCurrentPosts = this.updateCurrentPosts.bind(this);
        this.updataPosts = this.updataPosts.bind(this);
        this.changePageChild = React.createRef();
        this.getRelativeTime = this.getRelativeTime.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }

    componentDidMount() {
        this.getPosts();
    }

    deletePost(postID, comment) {
        let data = {
            postID: postID,
            comment: comment
        }
        let request = new Request('/api/post-info/delete', {
            method: 'DELETE',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data)
        });
        fetch(request)
            .then(response => response.json())
            .then(() => this.getPosts())
            .then(() => this.ChangeView('/'));
    }

    getPosts() {

        let data = { username:this.props.clickedUsername };
        let request = '';

        if (this.props.clickedUsername === '') {
            request = new Request('api/post-info/get')

        } else {
            request = new Request('api/post-info/get-click-user-post', {
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(data)
            });
        }
        fetch(request)
                .then(response => response.json())
                .then(items => this.setState({ posts:items }))
                .then(() => {
                    let numOfPosts = this.state.posts.length;
                    let numOfPages = Math.ceil(numOfPosts / 3);
                    if (numOfPages === 0) {
                        numOfPages = 1;
                    }
                    let currentShownPosts = [];
                    for (let i = 3 * (this.state.currentPage - 1); i < 3 * this.state.currentPage && i < numOfPosts; i++) {
                        let post = this.state.posts[i];
                        currentShownPosts[i] = post;
                    }
                    this.setState({
                        numOfPosts: numOfPosts,
                        numOfPages: numOfPages,
                        currentShownPosts: currentShownPosts,
                    });
                    let tempPageNum = this.props.clickedUsername === '' ? this.props.currentPageNum : 1;
                    this.getPageButtons(tempPageNum);
                });
    }

    updataPosts(b) {
        let currentShownPosts = [];
        for (let i = 3 * (b - 1); i < 3 * b && i < this.state.numOfPosts; i++) {
            let post = this.state.posts[i];
            currentShownPosts[i] = post;
        }
        this.setState({
            currentShownPosts: currentShownPosts,
        });
        this.getPageButtons(b);
    }

    updateCurrentPosts(b) {
        this.setState({ currentPage:b });
        if (this.props.clickedUsername === '') {
            this.props.updateCurrentPageNum(b);
        }
        this.updataPosts(b);
    }

    getPageButtons(b) {
        if (b == null) {
            b = 1;
        }
        let totalPages = this.state.numOfPages;
        let currentPage = b;
        let buttons = [];
        buttons[0] = 1;
        let index = 1;
        for (let i = currentPage - 2 > 1 ? currentPage - 2 : 2 ; i <= currentPage + 2 && i <= totalPages; i++) {
            if (buttons[index - 1] + 1 !== i) {
                buttons[index] = '...';
                index++;
            }
            buttons[index] = i;
            index++;
        }
        if (buttons[index - 1] !== totalPages) {
            if (buttons[index - 1] !== totalPages - 1) {
                buttons[index] = '...';
                buttons[index + 1] = totalPages;
            } else {
                buttons[index] = totalPages;
            }
        }
        this.setState({ buttons:buttons });
    }

    getRelativeTime(time) {
        if (time) {
            let temp = time.split(' ');
            return temp[0] + "T" + temp[1] + "-0000";
        } else {
            return '';
        }
    }

    render() {
        return (
            <div>
                <form className="grid" method="post" action="">
                    <br/>
                    <ChangePageView ref={this.changePageChild} choosePage={this.updateCurrentPosts} totalPages={this.state.numOfPages} />
                    {this.state.currentShownPosts.map((post, index) => (
                        <article className="postArticle" key={index}>
                            <fieldset className="postFieldset">
                                <div className="userInfoDiv">
                                    <img className="roundedCircleArticleImg"
                                        src={post.url ? "https://res.cloudinary.com/cjyjimmy520/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/" + post.url + "/profile_picture/"
                                            + post.userEmail + '/' + post.userEmail + ".jpg" : img}
                                        alt="user" onError={(e)=>{e.target.onerror = null; e.target.src=img}}>
                                    </img>
                                    <div className="postContentLayout">
                                        <div className="postProfile">
                                            <Button className="userInfoPUsername" onClick={() => {
                                                    this.props.updateClickedUsername(post.username);
                                                }}>{post.username}</Button>
                                            <p className="userInfoP">| <Moment fromNow>{this.getRelativeTime(post.postTime)}</Moment></p>
                                            { (this.props.user ? this.props.user.username : '') === post.username && (
                                                <Button className="deleteBtn" onClick={() => this.deletePost(post.postID, post.comment)}>Delete</Button>
                                            )}
                                        </div>
                                        <hr className="hr" width="100%" color="#7986cb" size={3} />
                                        <h2 className="h2ForPostTitle"><Button className="postTitle" onClick={() => {
                                            this.props.updateClickedPost(post);
                                            this.ChangeView('/postContent');
                                        }}>{post.title.length > 50 ? post.title.substring(0, 30) + '...' : post.title}</Button></h2>
                                        <p className="postContent">{post.content.length > 200 ? post.content.substring(0, 350) + '...' : post.content}</p>
                                    </div>
                                </div>
                            </fieldset>
                            <br/>
                        </article>
                    ))}
                </form>
                <div className="pageButtons">
                    {this.state.buttons.map((b, index) => {
                        if (b === this.state.currentPage) {
                            return (<Button className="currentPageButton" key={index} num={b} variant="contained" onClick={() => this.updateCurrentPosts(b)}>{b}</Button>)
                        }
                        else if (b === '...') {
                            return (<Button className="pageButton" key={index} num={b} variant="contained" onClick={() => this.changePageChild.current.handleOpen()}>{b}</Button>)
                        }
                        else {
                            return (<Button className="pageButton" key={index} num={b} variant="contained" onClick={() => this.updateCurrentPosts(b)}>{b}</Button>)
                        }
                    })}
                </div>
            </div>
        );
    }

}