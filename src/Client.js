import React from 'react';
import './index.css';


class WSClient extends React.Component
{
    constructor(props){
        super(props);
        this.state = {};

    }

    render(){
        return <h1>HI FUCKERS</h1>
    }


    ConnectToServer(){
        console.log("trying to connect to server");
        //const client = client; //192.168.87.152:12000');
        this.client = new WebSocket(`ws://localhost:8000?username=${"Bingus"}`);

        this.client.addEventListener("open", event => {
            this.SendToServer("Connection established");
            console.log("connection opened");
        });
        
        this.client.addEventListener("message", event => {
            console.log("Message from server: ", event.data);
        });

        this.client.addEventListener("close", event =>{
            console.log("server closed or crashed.");
        });
    }

    SendToServer(sentObj){
        let jsonMessage = JSON.stringify(sentObj);
        this.client.send(jsonMessage);
    }
}


export default WSClient;