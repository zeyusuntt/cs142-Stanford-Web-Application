import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch, Redirect
} from 'react-router-dom';
import {
  Grid, Paper
} from '@mui/material';
import './styles/main.css';
import axios from 'axios';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import LoginRegister from './components/loginRegister/LoginRegister';
import Activity from './components/activityFeed/ActivityFeed';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: null,
      isLoggedIn : false,
      curID : "",
      curFirst_name : "",
      curName: "",
      photos:[],
    };
  }

  handleUserNameChange = userName => {
    console.log("Receive: ", userName);
    this.setState({ userName: userName });
  };

  handleLogChange = (bool, id, first_name, name) => {
    this.setState({isLoggedIn : bool});
    this.setState({curID : id});
    this.setState({curFirst_name : first_name});
    this.setState({curName : name});
  };

  handleUploadSuccess = () => {
    axios.get(`/photosOfUser/${this.state.curID}`).then(res => {
      this.setState({ photos: res.data });
      console.log(this.state.photos);
    }).catch(error => {
      console.log(error);
    });
  };

  setLogout = () => {
    this.setState({isLoggedIn : false});
    this.setState({curID : ""});
    this.setState({curFirst_name : ""});
    this.setState({curName : ""});
  };


  render() {
    return (
      <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
        <Switch>
          <Route
            path="/users/:userId"
            render={props => (
              <TopBar
                {...props}
                handleLogChange={this.handleLogChange}
                isLoggedIn={this.state.isLoggedIn}
                curID={this.state.curID}
                curName={this.state.curName}
                curFirst_name={this.state.curFirst_name}
                userName={this.state.userName}
                onUploadSuccess={this.handleUploadSuccess}
              />
            )}
          />
          <Route
            path="/photos/:userId"
            render={props => (
              <TopBar
                {...props}
                handleLogChange={this.handleLogChange}
                isLoggedIn={this.state.isLoggedIn}
                curID={this.state.curID}
                curName={this.state.curName}
                curFirst_name={this.state.curFirst_name}
                userName={this.state.userName}
                onUploadSuccess={this.handleUploadSuccess}
              />
            )}
          />
          <Route
            render={props => (
              <TopBar
                {...props}
                handleLogChange={this.handleLogChange}
                isLoggedIn={this.state.isLoggedIn}
                curID={this.state.curID}
                curName={this.state.curName}
                curFirst_name={this.state.curFirst_name}
                userName={this.state.userName}
                onUploadSuccess={this.handleUploadSuccess}
              />
            )}
          />
        </Switch>

        </Grid>
        <div className="cs142-main-topbar-buffer"/>
        
        <Grid item sm={3}>
          <Paper className="cs142-main-grid-item">
            <UserList isLoggedIn = {this.state.isLoggedIn} />
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="cs142-main-grid-item">
            <Switch>
            {this.state.isLoggedIn ? (
              <Route
                path="/users/:userId"
                render={props => (
                  <UserDetail
                    {...props}
                    handler={this.handleUserNameChange}
                    onDelete={this.setLogout}
                    curID={this.state.curID}
                  />
                )}
              />
            ) : (
              <Redirect path="/users/:userId" to="/login-register" />
            )}

            {this.state.isLoggedIn ? (
              <Route
                path="/photos/:userId"
                render={props => (
                  <UserPhotos
                    {...props}
                    handler={this.handleUserNameChange}
                    photos={this.state.photos}
                    curID={this.state.curID}
                    curName={this.state.curName}
                  />
                )}
              />
            ) : (
              <Redirect path="/photos/:userId" to="/login-register" />
            )}

              {
                (!this.state.isLoggedIn) ?
              <Route path="/login-register" render={props => <LoginRegister {...props} handleLogChange = {this.handleLogChange}/>}/>
              :
              <Redirect path="/login-register" to={`/users/${this.state.curID}`}/>
              }
              {
                this.state.isLoggedIn ?
              <Route path="/Activity" render ={ props => <Activity {...props}/>}/>
                :
              <Redirect path="/Activity" to="/login-register" />
              }
              {
                this.state.isLoggedIn ?
                <Redirect path="/" to={`/users/${this.state.curID}`}/>
                :
                <Redirect path="/" to="/login-register" />
              }
              
              <Route path="/users" component={UserList}  />
            </Switch>
          </Paper>
        </Grid>
      </Grid>  
        {/* ////////     */}
          {/* {this.state.isLoggedIn ? (
            <>
            <Grid item sm={3}>
              <Paper className="cs142-main-grid-item">
              <UserList />
              </Paper>
            </Grid>

            <Grid item sm={9}>
            <Paper className="cs142-main-grid-item">
            
            <Switch>
            <Route exact path="/"
                render={() => (
                <Typography variant="h5">
                  Welcome to my photosharing app! 
                </Typography>
                )}
              />
              <Route path="/users/:userId"
                render={ props => <UserDetail {...props} handler={this.handleUserNameChange}/> }
              />
              <Route path="/photos/:userId"
                render ={ props => <UserPhotos {...props} handler={this.handleUserNameChange}/> }
              />
              <Route path="/users" component={UserList}  />
            </Switch>
            </Paper>
            </Grid>
            </>
          ) : 
          (
            <Redirect to='/login-register' />
          )}

          {!this.state.isLoggedIn ? (
            <Grid item sm={12}>
              <Paper className='cs142-main-grid-item'>
                <Route
                  path='/login-register'
                  render={(props) => (
                    <LoginRegister
                    handleLogChange = {this.handleLogChange}
                      {...props}
                    />
                  )}
                />
              </Paper>
            </Grid>
          ) : (
            <Redirect path='/login' to='/' />
          )} */}
            

      {/* </Grid> */}
      </div>
      </HashRouter>
    );
  }
}


ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp'),
);
