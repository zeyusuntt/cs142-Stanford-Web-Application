import React from 'react';
import {
  Typography, Card, CardHeader, CardMedia, CardContent
} from '@mui/material';
import './userPhotos.css';
import { Link } from 'react-router-dom';
// import fetchModel from "../../lib/fetchModelData";
import axios from 'axios';
import UserPhoto from '../userPhoto/UserPhoto'
/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      userName: {}
    };
  }

  componentDidMount() {
    // this.setState({photos : window.cs142models.photoOfUserModel(this.props.match.params.userId)});
    // console.log(this.props);
    axios.get(`/photosOfUser/${this.props.match.params.userId}`).then(res => {
      // console.log(res.data.length);
      this.setState({users : res.data});
      // console.log(this.state.users.length);
    }).catch(error => {
      console.log(error);
    });

    axios(`/user/${this.props.match.params.userId}`).then(res => {
      let user = res.data;
      this.props.handler(user.first_name + ' ' + user.last_name);
      this.setState({userName : user.first_name + ' ' + user.last_name});
    }).catch(error => {
      console.log(error);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      this.componentDidMount();
      return;
    }
    if (this.props.photos.length !== prevProps.photos.length) {
      this.componentDidMount();
      return;
    }
  }

  render(){
    let innerHTML = [];
    for(let i = 0;i < this.state.users.length;i++){
        innerHTML.push(
          <div key = {i}>
          <UserPhoto photo = {this.state.users[i]} i = {i}></UserPhoto>
          </div>
        );
    }
    return(
      <div>
        {innerHTML}
      </div>
    );
    }

  // render() {
  //   // console.log(this.state.userName);
  //   if (this.state.users === []) {
  //     return null;
  //   }
  //   return (
  //     <>
  //       <Typography variant="h4">
  //         Photo Gallery of {this.state.userName.toString()} 
  //       </Typography>
  //       <Typography variant="body1">
  //       {this.state.users!== undefined && this.state.users.map(item => (
  //         <div key= {item._id}>
  //           <Card >
  //             <CardHeader subheader = {item.date_time}></CardHeader>
  //             <CardMedia component = "img" src = {`images/${item.file_name}`}></CardMedia>
  //             <CardContent>
  //               {item.comments !== undefined ? item.comments.map(comment => (
  //                 <div key = {comment._id}>
  //                     <Typography variant="h5">
  //                     <Link to = {`/users/${comment.user._id}`} >
  //                       {comment.user.first_name + " " + comment.user.last_name}
  //                     </Link>
  //                     </Typography>
  //                     <Typography variant="body2" >
  //                     {comment.date_time}
  //                     </Typography>
  //                     <Typography variant="body1">
  //                     {comment.comment}
  //                     </Typography>
  //                 </div>
  //               )) : function(){}}
  //             </CardContent>
  //           </Card>
  //         </div>
  //       ))}
  //       </Typography>
        
  //     </>
      

  //   );
  // }
}

export default UserPhotos;
