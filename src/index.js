import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Sendshit from './SendTest'
import reportWebVitals from './reportWebVitals';
import WSClient from './Client';

let client = new WSClient()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <h1 onClick={()=>client.SendPost("ayyy, i'm post 'ere!!!")}>HI BITCHES</h1>
    <Sendshit doSend = {false}/>
    <App client= {client}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

client.ConnectToServer();