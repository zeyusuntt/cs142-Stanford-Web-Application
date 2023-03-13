import React from 'react';
import {
  Typography, Button
} from '@mui/material';
import './userDetail.css';
import { Link } from 'react-router-dom';
import PhotoIcon from '@material-ui/icons/Photo';
// import fetchModel from "../../lib/fetchModelData";
import axios from 'axios';
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

  componentDidMount() {
    // this.setState({user: window.cs142models.userModel(this.props.match.params.userId)});
    // console.log(this.props);
    axios(`/user/${this.props.match.params.userId}`).then(res => {
      this.setState({user : res.data});
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
      </Typography>
    );
  }
}

export default UserDetail;
