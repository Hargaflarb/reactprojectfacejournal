import React from 'react';
import './index.css';

class TCPServer extends React.Component
{
    render(){
        console.log("fuck yall");
        return <h1>HI FUCKERS</h1>
    }


    static ConnectToServer(){
        // console.log("trying to connect to server")
        // const client = new WebSocket('http://localhost:3000'); //192.168.87.152:12000');

        // client.addEventListener("open", event => {
        //     console.log("connection open, sending name");
        //     client.send("~username~ webstuff");
        // });

        // client.addEventListener("message", event => {
        //     console.log("Message from server: ", event.data)
        // })
    }
}


export default TCPServer;