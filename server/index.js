// some code copied from https://ably.com/blog/websockets-react-tutorial#implementing-the-web-socket-server-in-node 16-03


import React from 'react';
// import './index.css';

const { WebSocketServer } = require("ws")
const http = require("http")
const uuidv4 = require("uuid").v4
const url = require("url")


class TCPServer// extends React.Component
{
  constructor(){
  }
  
  static port = 8000
  static connections = {}
  static users = {}

  static StartServer(){
    const server = http.createServer()
    const wsServer = new WebSocketServer({ server })
    
    wsServer.on("connection", (connection, request) => {
      const { username } = url.parse(request.url, true).query
      console.log(`${username} connected`)
      const uuid = uuidv4()
      connections[uuid] = connection
      users[uuid] = {
        username,
        state: {},
      }
      connection.on("message", (message) => handleMessage(message, uuid))
      connection.on("close", () => handleClose(uuid))
    })

    server.listen(port, () => {
      console.log(`WebSocket server is running on port ${port}`)
    })

  }

  static handleMessage = (bytes, uuid) => {
    const message = JSON.parse(bytes.toString())
    const user = users[uuid]
    user.state = message
    broadcast()
  
    console.log(
      `${user.username} updated their updated state: ${JSON.stringify(
        user.state,
      )}`,
    )
  }
  
  static handleClose = (uuid) => {
    console.log(`${users[uuid].username} disconnected`)
    delete connections[uuid]
    delete users[uuid]
    broadcast()
  }
  
  static broadcast = () => {
    Object.keys(connections).forEach((uuid) => {
      const connection = connections[uuid]
      const message = JSON.stringify(users)
      connection.send(message)
    })
  }

}


export default TCPServer;





