import React from 'react';
import './index.css';
import App from './App';

class WSClient extends React.Component
{
    constructor(props){
        super(props);
        this.state = {

        };
        this.app = null;
        this.isLoggedIn = false;
        this.profile = {
            username: "",
            profileID: null
        };
        this.SendPost = this.SendPost.bind(this);
        this.render = this.render.bind(this);
        //this.SendConnectionNotice = this.SendConnectionNotice.bind(this);
    }

    render(){
        return <h1>no</h1>
    }

    ReferanceExchange(app){
        this.app = app;
        return this;
    }

    ConnectToServer(){
        console.log("trying to connect to server");
        //const client = client; //192.168.87.152:12000');
        this.client = new WebSocket(`ws://localhost:8000`);//?username=${"Bingus"}`);

        this.client.addEventListener("open", event => {
            this.SendNotice("Connection Established");
            // console.log("connection opened");
            this.RequestPostHistory();
        });
        
        this.client.addEventListener("message", event => {
            this.ReceiveMessage(JSON.parse(event.data.toString()));
            // console.log("Message from server: ", event.data);
        });

        this.client.addEventListener("close", event =>{
            console.log("server closed or crashed.");
        });

    }


    SendSignUp(username, password){
        this.profile.username = username; //not logged in yet

        let jsonMessage = JSON.stringify(
            {
                message_type: "signup",
                message:{
                    username: username,
                    password: password
                }
            }
        );
        
        this.client.send(jsonMessage);
    }
    
    RequestLogIn(username, password){
        this.profile.username = username; //not logged in yet

        let jsonMessage = JSON.stringify(
            {
                message_type: "login",
                message:{
                    username: username,
                    password: password
                }
            }
        );
        
        this.client.send(jsonMessage);
    }
    
    RequestPostHistory(){
        let jsonMessage = JSON.stringify(
            {
                message_type: "post-history"
            }
        )
        
        this.client.send(jsonMessage);
    }
    
    SendPost(title, text){
        if (this.profile.profileID != null){
            let jsonMessage = JSON.stringify(
                {
                    profileID: this.profile.profileID,
                    
                    message_type: "post",
                    message:{
                        title: `${title}`,
                        text: `${text}`
                    }
                }
            );
            
            this.client.send(jsonMessage);
            return true;
        }
        console.log("must be logged in.");
        return false;
    }
    
    SendComment(postID, text){
        if (this.profile.profileID != null){
            let jsonMessage = JSON.stringify(
                {
                    profileID: this.profile.profileID,
                    message_type: "comment",
                    message:{
                        postID: postID,
                        text: text
                    }
                }
            );
            
            this.client.send(jsonMessage);
            return true;
        }
        console.log("must be logged in.");
        return false;
    }
    
    SendPostLike(postID, isLike){
        if (this.profile.profileID != null){
            let jsonMessage = JSON.stringify(
                {
                    message_type: "post-like",
                    message:{
                        postID: postID,
                        isLike: isLike
                    }
                }
            );
            
            this.client.send(jsonMessage);
            return true;
        }
        console.log("must be logged in.");
        return false;
    }
    
    SendCommentLike(commentID, isLike){
        if (this.profile.profileID != null){
            let jsonMessage = JSON.stringify(
                {
                    message_type: "comment-like",
                    message:{
                        commentID: commentID,
                        isLike: isLike
                    }
                }
            );
            
            this.client.send(jsonMessage);
            return true;
        }
        console.log("must be logged in.");
        return false;
    }
    
    SendNotice(notice){
        let jsonMessage = JSON.stringify(
            {
                message_type: "notice",
                message:{
                    notice: notice
                }
            }
        );
        
        this.client.send(jsonMessage);
    }

    ReceiveMessage(received){
        switch (received.message_type){
            case "post":
                //Post(received.message.text, received.profileID, received.postID);
                this.app.SubmitNewPost(received.user, received.postID, received.message.title,  received.message.text);
                // profileID might just end up being the name.
                break;

            case "comment":
                //PostComment(received.message.text, received.message.postID, received.profileID, received.commentID);
                break;

            case "post-like":
                this.app.SubmitPostInteraction(received.message.postID, received.message.isLike);
                break;

            case "comment-like":
                if (received.messsge.isLike){
                    //LikeComment(received.message.commentID);
                }
                else{
                    //DislikeComment(received.message.commentID);
                }
                break;

            case "login":
                if (received.profileID != null){
                    //SetUserID(received.profileID);
                    this.profile.profileID = received.profileID;
                    console.log(`logged in as ${this.profile.username}.`);
                }
                else {
                    console.log("login failed");
                    //handle login retry
                }
                break;

            case "signup":
                if (received.profileID != null){
                    //SetUserID(received.profileID);
                    this.profile.profileID = received.profileID;
                    console.log(`logged in as ${this.profile.username}.`);
                }
                else {
                    console.log("login failed");
                    //handle login retry
                }
                break;

            case "post-history":
                // console.log(received.postHistoryList);
                this.app.SubmitNewPost(received.postHistoryList);
                break;

            case "notice":
                console.log(received.message);
                return;

            default:
                console.log(`invalid server interaction: ${received}`);
                return;
        }

        console.log(received);
    }
}



export default WSClient;