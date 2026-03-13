import React from 'react';
import './index.css';


class TCPClient extends React.Component
{
    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        console.log("fuck yall");
        this.ConnectToServer();
        return <h1>HI FUCKERS</h1>
    }


    ConnectToServer(){
        // Source - https://stackoverflow.com/a/48709691
        // Posted by peteb, modified by community. See post 'Timeline' for change history
        // Retrieved 2026-03-13, License - CC BY-SA 3.0

        // const {Socket} = require('net')

        // const client = new WebSocket('http://192.168.87.152:12000')
        // const client = new Socket()

        // client.send("sup fucker, wha's good??")
        // client.connect('192.168.87.152:12000', () => {
        // console.log('connected to server')

        // client.on('data', message => {
        //     if (message === 'disconnect') {
        //     console.log('disconnecting from localhost')
        //     client.end()
        //     } else {
        //     console.log(`Message from the Server: ${message}`)
        //     }
        // })

        // client.write('hello!')
        // })

    }
}


export default TCPClient;