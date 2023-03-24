import React from 'react';
import {
Typography, Card, CardHeader, CardMedia, CardContent
} from '@material-ui/core';
import { Link } from "react-router-dom";
import axios from 'axios';

class UserPhoto extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            photo:{},
            addedComment : ""
        };
    }

    handlePost = (event)=>{
        event.preventDefault();
        
        let curPhotoId = this.state.photo._id;
        let passObj = {};
        passObj.comment = this.state.addedComment;
        axios.post(`/commentsOfPhoto/${curPhotoId}`,passObj)
        .then(res =>{
            // console.log(res.data);
            this.setState({addedComment : ""});
            axios.get(`/photosOfUser/${this.state.photo.user_id}`)
            .then(res1 => {
            console.log("yes");
            this.setState({photo : res1.data[this.props.i]});
            // axios.get()
        }).catch(error => {
            console.log(error.response);
            });
        })
        .catch(err=>{
        console.log(err.response);
        });
    };

    componentDidMount(){
        this.setState({photo : this.props.photo});
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(Object.keys(prevState.photo).length === 0);
        console.log(this.state.photo);
        // Check if the comments list has changed
        if (!Object.is(prevState.photo, this.state.photo)) {
          // Update the photo state to trigger a re-render
          this.setState({ photo: this.state.photo });
        }

        // if(Object.keys(prevState.photo).length !== 0 && prevState.photo.comments.length !== this.state.photo.comments.length) {
        //     this.setState({ photo: this.state.photo });
        // }
      }

    render(){
        let curPhoto = this.state.photo;
        let curCommentsList = curPhoto.comments;
        let commentsListHTML =[];
        if (curCommentsList !== undefined){
        for(let j = 0; j < curCommentsList.length; j++){
        commentsListHTML.push(
            <div key = {j}>
                <Typography variant="h5" className='commentCreater'>
                    <Link to = {`/users/${curCommentsList[j].user._id}`} >
                        {curCommentsList[j].user.first_name + " " + curCommentsList[j].user.last_name}
                    </Link>
                </Typography>
                <Typography variant="body2" className='commentTime'>
                    {curCommentsList[j].date_time}
                </Typography>
                <Typography variant="body1" className='commentContext'>
                    {curCommentsList[j].comment}
                </Typography>
            </div>
        );}
        } 
        return(
            <div >
            <Card >
                <CardHeader subheader = {curPhoto.date_time} className = "photoDate"></CardHeader>
                <CardMedia component = "img" src = {`images/${curPhoto.file_name}`}></CardMedia>
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