// some code copied from https://ably.com/blog/websockets-react-tutorial#implementing-the-web-socket-server-in-node 16-03
// to start the server, write "node index.js" in the terminal, while in the server directory.
// if you're unsure of how it works hit me up.

const { sqlConfig, testQuery, addPostQuery, addCommentQuery, likePostQuery, likeCommentQuery} = require('./database.js');
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
      // const { username } = url.parse(request.url, true).query;
      const { username } = { username: "bingues" };
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

    const responds = this.GetServerResponse(message);

    // user.state = message;
    WSServer.broadcast(responds);
  
    // console.log(`${user.username} updated their state: ${JSON.stringify(responds,)}`,);
  }
  
  
  static handleClose(uuid){
    let text = `${WSServer.users[uuid].username} disconnected`;
    delete WSServer.connections[uuid];
    delete WSServer.users[uuid];
    console.log(text);
    WSServer.broadcast(text);
  }
  
  static broadcast(broadcastObject){
    Object.keys(WSServer.connections).forEach((uuid) => {
      const connection = WSServer.connections[uuid];
      const message = JSON.stringify(broadcastObject);
      connection.send(message);
      console.log(message);
    });
  }

  

  static GetServerResponse(received){

    switch (received.message_type){
        case "post":
          //testQuery();
          let postID = addPostQuery(received.user, received.message.text);
          postID.then(function(result){received.postID = result});
          break;
        case "comment":
          let commentID = addCommentQuery(received.user, received.message.text, received.message.postID);
          commentID.then(function(result){received.commentID = result})
          received.commentID = commentID;
          break;
        case "post-like":
          likePostQuery(received.message.postID, received.message.value)
          break;
        case "comment-like":
          likeCommentQuery(received.message.commentID, received.message.value)
          break;
        default:
        console.log("invalid server interaction");
          break;
      }
      
      return received;
  }
}


WSServer.StartServer();





