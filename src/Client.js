import React from 'react';
import './index.css';


class WSClient extends React.Component
{
    constructor(props){
        super(props);
        this.state = {

        };

        this.SendPost = this.SendPost.bind(this);
        this.render = this.render.bind(this);
        //this.SendConnectionNotice = this.SendConnectionNotice.bind(this);
    }

    render(){
        return <h1>no</h1>
    }
//this.SendPost("ayyy, i'm walking here")

    ConnectToServer(){
        console.log("trying to connect to server");
        //const client = client; //192.168.87.152:12000');
        this.client = new WebSocket(`ws://localhost:8000`);//?username=${"Bingus"}`);

        this.client.addEventListener("open", event => {
            this.SendConnectionNotice();
            console.log("connection opened");
        });
        
        this.client.addEventListener("message", event => {
            console.log("Message from server: ", event.data);
        });

        this.client.addEventListener("close", event =>{
            console.log("server closed or crashed.");
        });
    }

    SendConnectionNotice(){ //should send it's acount name and stuff here, and then return and acount id
        let jsonMessage = JSON.stringify("Connection Established");
        this.client.send(jsonMessage);
    }

    SendLogIn(username, password){
        let jsonMessage = JSON.stringify(
            {
                message_type: "login",
            }
        );
    }

    SendPost(text){
        let user = 1;
        let jsonMessage = JSON.stringify(
            {
                user: `${user}`,
                message_type: "post",
                message:{
                    text: `${text}`
                }
            }
        );

        this.client.send(jsonMessage);
    }

    SendComment(postID, text){
        let user = "bingus";
        let jsonMessage = JSON.stringify(
            {
                user: `${user}`,
                message_type: "comment",
                message:{
                    postID: `${postID}`,
                    text: `${text}`
                }
            }
        );

        this.client.send(jsonMessage);
    }

    SendPostLike(postID, value){
        let user = "bingus";
        let jsonMessage = JSON.stringify(
            {
                user: `${user}`,
                message_type: "post-like",
                message:{
                    postID: `${postID}`,
                    value: `${value}`
                }
            }
        );

        this.client.send(jsonMessage);
    }

    SendCommentLike(commentID, value){
        let user = "bingus";
        let jsonMessage = JSON.stringify(
            {
                user: `${user}`,
                message_type: "comment-like",
                message:{
                    commentID: `${commentID}`,
                    value: `${value}`
                }
            }
        );

        this.client.send(jsonMessage);
    }


}


export default WSClient;