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
        });
        
        this.client.addEventListener("message", event => {
            this.ReceiveMessage(JSON.parse(event.data));
            // console.log("Message from server: ", event.data);
        });

        this.client.addEventListener("close", event =>{
            console.log("server closed or crashed.");
        });
    }

    
    RequestLogIn(username, password){
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
    
    SendPost(text){
        let user = 1;
        let jsonMessage = JSON.stringify(
            {
                profileID: `${user}`,
                message_type: "post",
                message:{
                    text: `${text}`
                }
            }
        );
        
        this.client.send(jsonMessage);
    }
    
    SendComment(postID, text){
        let user = 1;
        let jsonMessage = JSON.stringify(
            {
                profileID: `${user}`,
                message_type: "comment",
                message:{
                    postID: `${postID}`,
                    text: `${text}`
                }
            }
        );
        
        this.client.send(jsonMessage);
    }
    
    SendPostLike(postID, isLike){
        let user = "bingus";
        let jsonMessage = JSON.stringify(
            {
                message_type: "post-like",
                message:{
                    postID: `${postID}`,
                    isLike: `${isLike}`
                }
            }
        );
        
        this.client.send(jsonMessage);
    }
    
    SendCommentLike(commentID, isLike){
        let user = "bingus";
        let jsonMessage = JSON.stringify(
            {
                message_type: "comment-like",
                message:{
                    commentID: `${commentID}`,
                    isLike: `${isLike}`
                }
            }
        );
        
        this.client.send(jsonMessage);
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
                this.app.SubmitNewPost("notin", received.profileID, received.message.text);
                break;

            case "comment":
                //PostComment(received.message.text, received.message.postID, received.profileID, received.commentID);
                break;

            case "post-like":
                if (received.messsge.isLike){
                    //LikePost(received.message.postID);
                }
                else{
                    //DislikePost(received.message.postID);
                }
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
                }
                else {
                    console.log("login failed");
                    //handle login retry
                }
                break;

            case "post-history":
                received.postHistoryList.forEach(post => {
                    //Post(post.message.text, post.profileID, post.postID);
                });
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