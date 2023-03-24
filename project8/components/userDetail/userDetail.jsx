import React from 'react';
import {
  Typography, Button
} from '@mui/material';
import './userDetail.css';
import { Link } from 'react-router-dom';
import PhotoIcon from '@material-ui/icons/Photo';
// import fetchModel from "../../lib/fetchModelData";
import axios from 'axios';
import {DeleteForever} from "@material-ui/icons";
/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }

  handleDelete=(event)=> {
    console.log(this.props.match.params.userId);
    axios.post(`/deleteUser/${this.props.match.params.userId}`, {})
      .then((value) => {
        this.props.onDelete();
        console.log(value);
      })
      .catch((error) => {
        console.log(error);
      });
    event.preventDefault();
  };

  componentDidMount() {
    // this.setState({user: window.cs142models.userModel(this.props.match.params.userId)});
    // console.log(this.props);
    axios(`/user/${this.props.match.params.userId}`).then(res => {
      this.setState({user : res.data});
      // console.log(this.state.user);
      this.props.handler(res.data.first_name + ' ' + res.data.last_name);
    }).catch(error => {
      console.log(error);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      this.componentDidMount();
    }
  }

  render() {
    return (
      <Typography variant="h4" component="body1">
        User: {this.state.user.first_name + " " + this.state.user.last_name}
        <Typography>
          Location: {this.state.user.location}
        </Typography>
        <Typography>
          Description: {this.state.user.description}
        </Typography>
        <Typography>
          Occupation: {this.state.user.occupation}
        </Typography>
        <Button variant="outlined">
          <PhotoIcon/>
          <Link to={`/photos/${this.state.user._id}`}> View Photos</Link>
        </Button>
        <br/>
        {this.props.curID === this.props.match.params.userId && (
          <Button variant="outlined" onClick={this.handleDelete}>
            <DeleteForever/>
            Delete My Account
          </Button>
        )}
      </Typography>
    );
  }
}

export default UserDetail;
