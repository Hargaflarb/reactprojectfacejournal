import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import WSClient from './Client';

let client = new WSClient()


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App client={client}/>
  </React.StrictMode>
);


reportWebVitals();

client.ConnectToServer();