import React from 'react';
import { Button } from 'react-bootstrap';
import './component_style/PostContent.css';
import ChangePageView from './ChangePage';
import { navigate } from 'react-mini-router';
import Moment from 'react-moment';

export default class Comments extends React.Component {
    ChangeView(page) {
        navigate(page);
    }

    constructor(props) {
        super(props);
        this.state = {
            post: this.props.clickedPost,
            hasTable: this.props.clickedPost.comment,
            comments: [],
            numOfComments: 0,
            currentPage: 1,
            numOfPages: 0,
            currentShownComments: [],
            buttons: [],
        }
        this.getComments = this.getComments.bind(this);
        this.getPageButtons = this.getPageButtons.bind(this);
        this.updateCurrentComments = this.updateCurrentComments.bind(this);
        this.updataComments = this.updataComments.bind(this);
        this.changePageChild = React.createRef();
        this.commentPost = this.commentPost.bind(this);
        this.getRelativeTime = this.getRelativeTime.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }

    componentDidMount() {
        if (this.state.hasTable) {
            this.getComments();
        }
    }

    deleteComment(commentID) {
        let data = {
            commentID: commentID,
            postID: this.state.post.postID
        }
        let request = new Request('/api/comment-info/delete', {
            method: 'DELETE',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data)
        });
        fetch(request)
            .then(response => response.json())
            .then(() => this.getComments())
            .then(() => this.ChangeView('/postContent'));
    }

    getComments() {
        let data = { id:this.state.post.postID };
        let request = new Request('api/comment-info/get', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data)
        });
        fetch(request)
                .then(response => response.json())
                .then(items => this.setState({ comments:items }))
                .then(() => {
                    let numOfComments = this.state.comments.length;
                    let numOfPages = Math.ceil(numOfComments / 6);
                    if (numOfPages === 0) {
                        numOfPages = 1;
                    }
                    let currentShownComments = [];
                    for (let i = 6 * (this.state.currentPage - 1); i < 6 * this.state.currentPage && i < numOfComments; i++) {
                        let comment = this.state.comments[i];
                        currentShownComments[i] = comment;
                    }
                    this.setState({
                        numOfComments: numOfComments,
                        numOfPages: numOfPages,
                        currentShownComments: currentShownComments,
                    });
                    this.getPageButtons();
                });
    }

    updataComments(b) {
        let currentShownComments = [];
        for (let i = 6 * (b - 1); i < 6 * b && i < this.state.numOfComments; i++) {
            let comment = this.state.comments[i];
            currentShownComments[i] = comment;
        }
        this.setState({
            currentShownComments: currentShownComments,
        });
        this.getPageButtons(b);
    }

    updateCurrentComments(b) {
        this.setState({ currentPage:b });
        this.updataComments(b);
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

    commentPost() {
        if (this.props.user) {
            if (!this.state.hasTable) {
                let data = { id:this.state.post.postID };
                let request = new Request('/api/comment-info/create-table', {
                    method: 'POST',
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify(data)
                });
                fetch(request)
                    .then(response => response.json());
            }
            let tempPost = this.state.post;
            tempPost.comment = true;
            this.props.updateClickedPost(tempPost);
            this.props.reverseState();
        } else {
            this.ChangeView('/login');
        }
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
            <div className="content">
                <br />
                <div>
                    <h2 className="commentHeader">Comments:</h2>
                    <Button className="commentBtn" onClick={() => this.commentPost()}>Post Comment</Button>
                    <br /> <br />
                    <form className="grid" method="post" action="">
                        <br/>
                        <ChangePageView ref={this.changePageChild} choosePage={this.updateCurrentComments} totalPages={this.state.numOfPages} />
                        {this.state.currentShownComments.map((comment, index) => (
                            <article className="postArticle" key={index}>
                                <fieldset className="postFieldset">
                                    <div className="commentsLayout">
                                        <div className="postProfile">
                                            <p className="userInfoP">{comment.user} |  <Moment fromNow>{this.getRelativeTime(comment.time)}</Moment></p>
                                            { (this.props.user ? this.props.user.username : '') === comment.user && (
                                                <Button className="deleteBtn" onClick={() => this.deleteComment(comment.commentID)}>Delete</Button>
                                            )}
                                        </div>
                                        <hr className="hr" width="100%" color="#7986cb" size={3} />
                                        <p className="postContent">{comment.content}</p>
                                    </div>
                                </fieldset>
                                <br/>
                            </article>
                        ))}
                    </form>
                    <div className="pageButtons">
                        {this.state.buttons.map((b, index) => {
                            if (b === this.state.currentPage) {
                                return (<Button className="currentPageButton" key={index} num={b} variant="contained" onClick={() => this.updateCurrentComments(b)}>{b}</Button>)
                            }
                            else if (b === '...') {
                                return (<Button className="pageButton" key={index} num={b} variant="contained" onClick={() => this.changePageChild.current.handleOpen()}>{b}</Button>)
                            }
                            else {
                                return (<Button className="pageButton" key={index} num={b} variant="contained" onClick={() => this.updateCurrentComments(b)}>{b}</Button>)
                            }
                        })}
                    </div>
                </div>
            </div>
        );
    }
}