// some code copied from https://ably.com/blog/websockets-react-tutorial#implementing-the-web-socket-server-in-node 16-03
// to start the server, write "node index.js" in the terminal, while in the server directory.
// if you're unsure of how it works hit me up.

const { testQuery, addPostQuery, sqlConfig} = require('./database.js');
const { WebSocketServer } = require("ws");
const http = require("http");
const uuidv4 = require("uuid").v4;
const url = require("url");

class WSServer
{
  constructor(){
  }
  
  static connections = {};
  static users = {};


  static StartServer(){
    const port = 8000;

    const server = http.createServer();
    const wsServer = new WebSocketServer({ server });
    
    wsServer.on("connection", (connection, request) => {
      const { username } = url.parse(request.url, true).query;
      console.log(`${username} connected`);
      const uuid = uuidv4();
      WSServer.connections[uuid] = connection;
      WSServer.users[uuid] = {
        username,
        state: {},
      };
      connection.on("message", (message) => WSServer.handleMessage(message, uuid));
      connection.on("close", () => WSServer.handleClose(uuid));
    });

    server.listen(port, () => {
      console.log(`WebSocket server is running on port ${port}`);
    });

  }

  static handleMessage(bytes, uuid){
    const message = JSON.parse(bytes.toString());
    const user = WSServer.users[uuid];
    user.state = message;
    WSServer.broadcast();
  
    console.log(
      `${user.username} updated their updated state: ${JSON.stringify(
        user.state,
      )}`,
    );
  }
  
  
  static handleClose(uuid){
    console.log(`${users[uuid].username} disconnected`);
    delete WSServer.connections[uuid];
    delete WSServer.users[uuid];
    WSServer.broadcast();
  }
  
  static broadcast(){
    Object.keys(WSServer.connections).forEach((uuid) => {
      const connection = WSServer.connections[uuid];
      const message = JSON.stringify(WSServer.users);
      connection.send(message);
    })
  }

}


//WSServer.StartServer();





