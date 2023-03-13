import React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button
}
from '@mui/material';
import './userList.css';
import PersonIcon from '@material-ui/icons/Person';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';
import fatchModel from "../../lib/fetchModelData";


/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    // this.setState({users: window.cs142models.userListModel()});
    fatchModel('http://localhost:3000/user/list').then(res => {
      this.setState({users : res.data});
    }).catch(error => {
      console.log(error);
    });
  }
  
  render() {
    return (
      <div style={{maxHeight: '100%', overflow: 'auto'}} >
        <Typography style={{color:"#00adb5"}} variant="body1">
          User List:
        </Typography>
        <List component="nav">
          {this.state.users.map(user => (
            <>
              <ListItem key={user._id}>
                <ListItemIcon>
                  <PersonIcon/>
                </ListItemIcon>
                <Link to = {`/users/${user._id}`}>
                  <ListItemText primary={user.first_name + ' ' + user.last_name} />
                </Link>
              </ListItem>
              <Divider />
            </>
          ))}
        </List>
        <HomeIcon/>
        <Button style={{color:"#00adb5"}} variant="outlined">
          <Link to = "/">HomePage</Link>
        </Button>
      </div>
    );
  }
}

export default UserList;
