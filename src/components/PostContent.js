import React from 'react';
import { Button } from 'react-bootstrap';
import './component_style/PostContent.css';
import img from './resources/profile_pictures/default_profile_picture.png';
import Comments from './Comments';
import Comment from './Comment';
import { navigate } from 'react-mini-router';
import Moment from 'react-moment';

export default class PostContent extends React.Component {
    ChangeView(page) {
        navigate(page);
    }

    constructor(props) {
        super(props);
        this.state = {
            post: this.props.clickedPost,
            commentState: false,
            commentsState: true,
        }
        this.reverseState = this.reverseState.bind(this);
        this.getRelativeTime = this.getRelativeTime.bind(this);
    }

    componentDidMount() {
    }

    reverseState() {
        this.setState({
            commentState: !this.state.commentState,
            commentsState: !this.state.commentsState,
        });
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
                <h2 className="title" align="center">{this.state.post.title}</h2>
                <p className="nameAndTime">{this.state.post.username} | <Moment fromNow>{this.getRelativeTime(this.state.post.postTime)}</Moment></p>
                <Button className="commentBtn" onClick={() => this.ChangeView('/')}>Go Back</Button>
                <br /> <br />
                <form className="postContentForm">
                    <p className="detail">{this.state.post.content}</p>
                </form>
                { this.state.commentState && (
                    <Comment clickedPost={this.props.clickedPost} user={this.props.user} reverseState={() => this.reverseState()} />
                )}
                { this.state.commentsState && (
                    <Comments clickedPost={this.props.clickedPost} updateClickedPost={this.props.updateClickedPost} user={this.props.user} reverseState={() => this.reverseState()} />
                )}
            </div>
        );
    }

}