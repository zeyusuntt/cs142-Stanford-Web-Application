import React from 'react';
import {
  AppBar, Toolbar, Typography, Grid, Button
} from '@mui/material';
import './TopBar.css';
// import fetchModel from '../../lib/fetchModelData';
import axios from 'axios';
/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this.props);
    this.state = {
      version: "",
      isLoggedIn : false,
      curFirst_name: "",
      message:"",
      curID: "",
    };
  }

  handleLogout = () => {
    axios.post('/admin/logout')
    .then(res => {
      console.log(res.data);
      this.props.handleLogChange(false,"","");
    })
    .catch(err =>{
      console.log(err.response);
      this.props.handleLogChange(false,"","");
    });
  };

  handleUploadButtonClicked = (e) => {
    e.preventDefault();
    if (this.uploadInput.files.length > 0) {

    const domForm = new FormData();
    domForm.append('uploadedphoto', this.uploadInput.files[0]);
    axios.post('/photos/new', domForm)
      .then((res) => {
        this.uploadInput = "";
        this.setState({message : "upload successfully!"});
        console.log(res);
        // axios.get()
        console.log(this.props.curID);
        // axios.get(`/photosOfUser/${this.props.curID}`).then(res => {
        //   console.log(res.data);
        //   // this.setState({users : res.data});
        // }).catch(error => {
        //   console.log(error);
        // });
        this.props.onUploadSuccess();
      })
      .catch(err => console.log(`POST ERR: ${err}`));
  }
};

  componentDidMount() {
    axios('/test/info')
    .then(res => {
      this.setState({version : res.data.__v});
      this.setState({isLoggedIn : this.props.isLoggedIn});
      this.setState({curFirst_name : this.props.curFirst_name});
      this.setState({curID: this.props.curID})
    })
    .catch(err => console.log(err));
  }

  componentDidUpdate(lastProps){
    if (lastProps.isLoggedIn !== this.props.isLoggedIn){
      axios.get('/test/info').then(res => {
        // console.log(res.data);
        this.setState({isLoggedIn : this.props.isLoggedIn});
        this.setState({curFirst_name : this.props.curFirst_name});
        this.setState({message : ""});
      }).catch(error => {
        console.log(error);
      });
    }
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
          <Grid item xs = {4}>
          <Typography variant="body1" color="inherit">
              Zeyu Sun&apos;s app version: {this.state.version}
          </Typography>
          
          </Grid>

          <Grid item xs = {2} >
          {this.state.isLoggedIn ? (
            <Typography variant='h5' color='inherit'>
              Hi {this.state.curFirst_name}
					</Typography>
          )          
        :
        (
          <Typography variant='h5' color='inherit'>
            Please Login
					</Typography>
        )}
          </Grid>
          <Grid item xs = {6}>
            
              <form onSubmit={this.handleUploadButtonClicked}>
              <input type="file" accept="image/*" ref={(domFileRef) => { this.uploadInput = domFileRef; }} />
              <input type="submit" value="Add Photo" />
              <Typography variant="b1" color="inherit" className='left'>
                {this.state.message}
              </Typography>
              </form>
            
            </Grid>
          

          <Grid item xs = {4} >
          <Typography variant="h5">
              {content}
          </Typography>
          </Grid>

          <Grid item xs = {2} >
          <Button onClick = {this.handleLogout} variant="contained">
              Logout
          </Button>
          </Grid>
        </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
