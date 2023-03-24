import React from "react";
import { Typography, Button } from "@mui/material";
import axios from 'axios';

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login_name: "",
            login_password:"",

            register_name:"",
            register_password:"",
            doubleCheck_password:"",
            first_name:"",
            last_name:"",
            location:"",
            occupation:"",
            description:"",

            view: "login",
            message:"",
        };
    }

    componentDidMount(){
        this.setState({view :"login"});      
        // console.log("test");
    }

    handleSwitchButton = () =>{
        this.setState({view : this.state.view === "login"? "register" : "login"});
    };

    handleLogin = (event) =>{
        event.preventDefault();
        let obj = {};
        obj.login_name = this.state.login_name;
        obj.password = this.state.login_password;
        axios.post("/admin/login", obj)
        .then(res =>{
            this.setState({message : "login successfully!"});
            let curID = res.data._id;
            let curFirst_name = res.data.first_name;
            this.props.handleLogChange(true, curID,curFirst_name);
            
        })
        .catch(err =>{
            this.setState({message : err.response.data});
            
        });
    };

    handleRegister = (event) =>{
        if(this.state.register_password !== this.state.doubleCheck_password){
            this.setState({message: "double check the password!"});
            return;
        }
        event.preventDefault();
        let obj = {};
        obj.login_name = this.state.register_name;
        obj.password = this.state.register_password;
        obj.first_name = this.state.first_name;
        obj.last_name = this.state.last_name;
        obj.location = this.state.location;
        obj.description = this.state.description;
        obj.occupation = this.state.occupation;
        axios.post("/user",obj)
        .then(res =>{
            console.log(res.data);
                this.setState({message : "You have registered successfully, please login."});

        })
        .catch(err =>{
            this.setState({message:err.response.data});
        }); 
    };

    render() {
        return(
            <div>
                <Typography variant="h4">
                    {this.state.message}
                </Typography>
                <br/>

                {/* login */}
                {this.state.view === "login" && 
                    (
                        <form onSubmit={this.handleLogin}>
                            <div> Login Name:</div>
                            <input type="text" value={this.state.login_name} onChange={(event) => {this.setState({login_name: event.target.value});}}/>
                            <br/>
                            <div> Password:</div>
                            <input type ="password" value={this.state.login_password} onChange={(event) =>{this.setState({login_password: event.target.value});}} />
                            <br/>
                            <input type="submit" value="login" />
                        </form>
                    )}

                {/* register */}
                {this.state.view !== "login" && 
                    (
                        <form onSubmit={this.handleRegister}>
                            <div> Login Name:</div>
                            <input type="text" value={this.state.register_name} onChange={(event) => {this.setState({register_name: event.target.value});}}/>
                            <br/>
                            <div> Password:</div>
                            <input type ="password" value={this.state.register_password} onChange={(event) =>{this.setState({register_password: event.target.value});}} />
                            <br/>
                            <div> Repeat Password:</div>
                            <input type ="password" value={this.state.doubleCheck_password} onChange={(event) =>{this.setState({doubleCheck_password: event.target.value});}} />
                            <br/>
                            <div> First Name:</div>
                            <input type ="text" value={this.state.first_name} onChange={(event) =>{this.setState({first_name: event.target.value});}} />
                            <br/>
                            <div> Last Name:</div>
                            <input type ="text" value={this.state.last_name} onChange={(event) =>{this.setState({last_name: event.target.value});}} />
                            <br/>
                            <div> Location:</div>
                            <input type ="text" value={this.state.location} onChange={(event) =>{this.setState({location: event.target.value});}} />
                            <br/>
                            <div> Occupation:</div>
                            <input type ="text" value={this.state.occupation} onChange={(event) =>{this.setState({occupation: event.target.value});}} />
                            <br/>
                            <div> Description:</div>
                            <input type ="text" value={this.state.description} onChange={(event) =>{this.setState({description: event.target.value});}} />
                            <br/>
                            <input type="submit" value="Register" />
                        </form>
                    )}
                    <br/>
                    <Button variant="outlined" onClick = {this.handleSwitchButton}>
                        {this.state.view === "login" ? "Register Page" : "Login Page"}
                    </Button>
            </div>
        )
    }
}

export default LoginRegister;