import React from 'react';
import {
  AppBar, Toolbar, Typography, Grid
} from '@mui/material';
import './TopBar.css';
import fetchModel from '../../lib/fetchModelData';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this.props);
    this.state = {
      version: ""
    };
  }

  componentDidMount() {
    fetchModel('http://localhost:3000/test/info')
    .then(res => {
      this.setState({version : res.data.__v});
    })
    .catch(err => console.log(err));
  }

  render() {
    // if (this.props !== undefined) {
    //   console.log(this.props);
    // };
    let content = (
      <Typography variant="h5" color="inherit">
        {this.props.match.path.includes("/photos/") && "Photos of "}
        {this.props.match.path.includes("/users/") && "Info of "}
        {this.props.match.params.userId && `${this.props.userName}`}
      </Typography>
    );
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
        <Grid container> 
          <Grid item xs = {8}>
          <Typography variant="h5" color="inherit">
              Zeyu Sun&apos;s app version: {this.state.version}
          </Typography>
          </Grid>
          <Grid item xs = {4} >
          <Typography variant="h5">
              {content}
          </Typography>
          </Grid>
        </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
