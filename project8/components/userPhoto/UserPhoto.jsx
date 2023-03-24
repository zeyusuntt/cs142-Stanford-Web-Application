import React from 'react';
import {
Typography, Card, CardHeader, CardMedia, CardContent,IconButton
} from '@material-ui/core';
import { Link } from "react-router-dom";
import axios from 'axios';
import {ThumbUpAlt, ThumbUpOutlined, DeleteForever} from "@material-ui/icons";

class UserPhoto extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            photo:{},
            addedComment : "",
            like: false,
            likeCount: 0,
        };
    }

    handlePost = (event)=>{
        event.preventDefault();
        
        let curPhotoId = this.state.photo._id;
        let passObj = {};
        passObj.comment = this.state.addedComment;
        // passObj.test = "test";
        axios.post(`/commentsOfPhoto/${curPhotoId}`,passObj)
        .then(res =>{
            // console.log(res.data);
            this.setState({addedComment : ""});
        //     axios.get(`/photosOfUser/${this.state.photo.user_id}`)
        //     .then(res1 => {
        //     // console.log(res1.data[this.props.i]);
        //     this.setState({photo : res1.data[this.props.i]});
            
        // }).catch(error => {
        //     console.log(error);
        //     });
            this.props.handlePhotosChange();
            this.setState({photo : this.props.photo});
            // activity feed
            let obj = {};
            obj.name = this.props.curName;
            obj.user_id = this.props.curID;
            obj.date_time = new Date().valueOf();
            obj.commented_photo_file_name = res.data.file_name;
            obj.commented_photo_author = this.props.author;
            obj.type = "commented the photo:";
            axios.post('/newActivity', obj);
        })
        .catch(err=>{
        console.log(err.response);
        });
    };

    handleLike = () =>{
        let passObj = {};
        passObj.like = !this.state.like;
        passObj.photo_id = this.state.photo._id;
        axios.post('/likeOrUnlike', passObj).then(res => {
            // console.log(res);
            this.setState({like: !this.state.like});
            console.log(this.state.photo);
            this.setState({likeCount: res.data.likes.length});
            console.log(this.state.photo);

            let obj = {};
            obj.user_id = this.props.curID;
            obj.name = this.props.curName;
            obj.type = this.state.like? "liked the photo:" : "canceled liking the photo:";
            obj.commented_photo_author = this.props.author;
            obj.commented_photo_file_name = res.data.file_name;
            obj.date_time = new Date().valueOf();
            axios.post('/newActivity', obj);
        }).catch(err => {
            console.log(err);
        });
    };

    handleDeletePhoto = (event) => {
        axios.post(`deletePhoto/${this.state.photo._id}`, {})
            .then(result => {
                console.log(result);
                // axios.get
                // axios.get(`/photosOfUser/${this.state.photo.user_id}`)
                //     .then(res1 => {
                //     // console.log("yes");
                //         this.setState({photo : res1.data[this.props.i]});
                //     })
                //     .catch(error => {
                //         console.log(error.response);
                //     });
                this.props.handlePhotosChange();
                this.setState({photo : this.props.photo});
            })
            .catch(err => {
                console.log(err);
            });
        event.preventDefault();
    };

    handleDeleteComment = (passObj, event) => {
        let body = {};
        console.log(passObj);
        body.commentId = passObj._id;
        axios.post(`deleteComment/${this.state.photo._id}`, body)
        .then(result => {
            console.log(result);
            // axios.get(`/photosOfUser/${this.state.photo.user_id}`)
            //         .then(res1 => {
            //         // console.log("yes");
            //             this.setState({photo : res1.data[this.props.i]});
            //         })
            //         .catch(error => {
            //             console.log(error.response);
            //         });
            this.props.handlePhotosChange();
            this.setState({photo : this.props.photo});
        })
        .catch(err => {
            console.log(err);
        });
        event.preventDefault();
    };

    componentDidMount(){
        // console.log(this.props.photo.file_name);
        this.setState({photo : this.props.photo});
        if (this.props.photo.likes !== null) {
            this.setState({likeCount : this.props.photo.likes.length});
            // console.log(this.props.photo.likes);
            // console.log(this.state.photo.file_name);
            // console.log(this.props.curID);
            if (this.props.photo.likes.includes(this.props.curID)) {
                
                this.setState({like: true});
            }
        }  
    }

    componentDidUpdate() {
        // console.log(Object.keys(prevState.photo).length === 0);
        // console.log(this.state.photo);
        // Check if the comments list has changed
        if (!Object.is(this.props.photo, this.state.photo)) {
          // Update the photo state to trigger a re-render
            // this.setState({ photo: this.state.photo });
            // console.log(this.props.photo.file_name);
            this.setState({photo : this.props.photo});
            if (this.props.photo.likes !== null) {
                this.setState({likeCount : this.props.photo.likes.length});
                // console.log(this.props.photo.likes);
                // console.log(this.state.photo.file_name);
                // console.log(this.props.curID);
                if (this.props.photo.likes.includes(this.props.curID)) {
                    
                    this.setState({like: true});
                }
            }
        }

        // if(Object.keys(prevState.photo).length !== 0 && prevState.photo.comments.length !== this.state.photo.comments.length) {
        //     this.setState({ photo: this.state.photo });
        // }
      }

    render(){
        let curPhoto = this.state.photo;
        // console.log(this.state.photo);
        let curCommentsList = curPhoto.comments;
        let commentsListHTML =[];
        if (curCommentsList !== undefined){
        for(let j = 0; j < curCommentsList.length; j++){
            console.log(curCommentsList[j].user._id);
            console.log(this.props.curID);
        commentsListHTML.push(
            <div key = {j}>
                <Typography variant="h5">
                    <Link to = {`/users/${curCommentsList[j].user._id}`} >
                        {curCommentsList[j].user.first_name + " " + curCommentsList[j].user.last_name}
                    </Link>
                </Typography>
                <Typography variant="body2">
                    {curCommentsList[j].date_time}
                </Typography>
                <Typography variant="body1">
                    {curCommentsList[j].comment}
                </Typography>
                <Typography variant="body2">
                    {curCommentsList[j].user._id === this.props.curID && 
                        (
                        <>
                            <IconButton onClick= {() => this.handleDeleteComment(curCommentsList[j])}><DeleteForever/></IconButton>
                            <span> Delete the comment</span>
                        </>
                        )}
                </Typography>
                
            </div>
        );}
        } 
        return(
            <div >
            <Card >
                <CardHeader subheader = {curPhoto.date_time} className = "photoDate"></CardHeader>
                <CardMedia component = "img" src = {`images/${curPhoto.file_name}`}></CardMedia>
                <div>
                    <IconButton onClick= {this.handleLike}>
                    {this.state.like? <div><ThumbUpAlt> </ThumbUpAlt></div> : <ThumbUpOutlined> </ThumbUpOutlined>}
                    </IconButton>
                    <span>{this.state.likeCount}  people like this photo.</span>
                    {this.state.like? <span>You liked this photo!</span> : null}
                    
                    {this.state.photo.user_id === this.props.curID && (
                        <>
                            <IconButton onClick= {this.handleDeletePhoto}><DeleteForever/></IconButton>
                            Delete the photo
                        </>
                        )}
                    
                </div>
                <CardContent>
                {commentsListHTML}
                <div>
                <form onSubmit = {this.handlePost}>
                <div>Add Comment:</div>
                <textarea value={this.state.addedComment} onChange={(event)=>{this.setState({addedComment : event.target.value});}} />
                <br/>
                <input type="submit" value="POST" />
                </form>
                </div>
                </CardContent>
            </Card>
            <br/>
            </div>
        );
    }
}
export default UserPhoto;