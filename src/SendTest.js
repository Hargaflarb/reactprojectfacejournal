import React from 'react';
import './index.css';
import AppFunctions from './App.js'

function Sendshit(props){
    console.log("1");
    let appFunc = AppFunctions(props);
    console.log("2");
    if (props.doSend){
        console.log("3");
        appFunc.OnServerPost("notin", props.received.profileID, props.received.message.text);// received.postID);
        console.log("4");
    }
    console.log("5");
    return (
        <></>
    );
}

export default Sendshit;