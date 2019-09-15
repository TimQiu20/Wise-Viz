import React from 'react';
import { Button, TextField } from '@material-ui/core';
import './component_style/PostContent.css';

/**
 *
 *
 */
export default class Comment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            content: '',
            user: this.props.user ? this.props.user.username : null,
        }
        this.post = this.post.bind(this);
    }

    handleEventChange = field => event => {
        const oldData = this.state;
        oldData[field] = event.target.value;
        this.setState({
            newUserData: oldData,
        });
    }

    post() {
        let date = new Date();
        let data = {
            id: this.props.clickedPost.postID,
            commentID: Math.random().toString(36).substr(2, 9),
            content: this.state.content,
            time: date.toISOString().slice(0, 19).replace('T', ' '),
            user: this.state.user,
        };
        let request = new Request('/api/comment-info/post', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data)
        });

        fetch(request)
            .then(function(response) {
                response.json().then(function(data) {
                })
        });
        this.props.reverseState();
    }

    render() {
        return (
            <div className="content">
                <form className="grid">
                    <fieldset>
                    <h2 className="commentHeader">Content:</h2>
                    <textarea
                        name="message"
                        className="textarea"
                        require={true}
                        rows="10"
                        cols="30"
                        wrap="soft"
                        value={this.state.postContent}
                        onChange={this.handleEventChange('content')}
                    >
                    </textarea>
                    <br/><br/>
                    <Button variant="contained" color="secondary" className="postButtons" onClick={() => this.props.reverseState()}>Cancel</Button>
                    <Button variant="contained" color="primary" className="postButtons" onClick={this.post}>Submit Comment</Button>
                    </fieldset>
                </form>
            </div>
        );
    }

}