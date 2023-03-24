import React from 'react';
import axios from "axios";
import {
    Typography, Button
    } from '@material-ui/core';
class Activity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activityList: [],
        };
    }

    componentDidMount() {
        axios.get('/activity')
        .then((res) => {
                this.setState({activityList: res.data});  
                console.log(res.data);
            })
        .catch((err) => {
                console.log(err);
            });
    }

    handleRefersh = ()=>{
        axios.get('/activity')
        .then((res) => {
                this.setState({activityList: res.data});
            })
        .catch((err) => {
                console.log(err);
            });
    };

    render() {
        let innerHTML = [];

        for (let i = 0; i < this.state.activityList.length; i++) {
            let cur = this.state.activityList[i];
            console.log(cur);
            innerHTML.push(
                <Typography variant="body2" key = {i}>
                    <br/>
                    {new Date(cur.date_time).toLocaleString()}
                    <br/>
                    {cur.name + " " + cur.type + " "}
                    {cur.commented_photo_author !== null && `${cur.commented_photo_author}'s photo`}
                    {cur.uploaded_photo_file_name !== null && <> <br/> <img src ={"/images/" + cur.uploaded_photo_file_name} width = {120} height = {120}/> </> }
                    {cur.commented_photo_file_name !== null && <> <br/> <img src ={"/images/" + cur.commented_photo_file_name} width = {120} height ={120} /> </>}
                    <br/>
                </Typography>
            );
        }
        
        return (
            <div style={{maxHeight: '100%', overflow: 'auto'}}>
                <Typography variant="h5">Activity Board</Typography>
                {innerHTML}
                <br/>
                <Button variant="outlined" onClick={this.handleRefersh}> Refresh </Button>
            </div>
        );
    }

}

export default Activity;