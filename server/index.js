// some code copied from https://ably.com/blog/websockets-react-tutorial#implementing-the-web-socket-server-in-node 16-03
// to start the server, write "node index.js" in the terminal, while in the server directory.
// if you're unsure of how it works hit me up.

const { sqlConfig, testQuery, addPostQuery, addCommentQuery, likePostQuery, likeCommentQuery, loginQuery} = require('./database.js');
const { WebSocketServer } = require("ws");
const http = require("http");
const uuidv4 = require("uuid").v4;
const url = require("url");
const { profile } = require('console');




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

  static async handleMessage(bytes, uuid){
    const message = JSON.parse(bytes.toString()); 
    const user = WSServer.users[uuid];

    const responds = await this.GetServerResponse(message, uuid);


    // user.state = message;
    if (responds != null){
      WSServer.broadcast(responds);
    }
  
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
    const message = JSON.stringify(broadcastObject);
    Object.keys(WSServer.connections).forEach((uuid) => {
      const connection = WSServer.connections[uuid];
      connection.send(message);
    });

    console.log("broadcast:");
    console.log(broadcastObject);
  }

  static MonoSend(sentObject, uuid){
    const connection = WSServer.connections[uuid];
    const message = JSON.stringify(sentObject);
    connection.send(message);
  }
  

  static async GetServerResponse(received, uuid){

    switch (received.message_type){
      case "post":
        let postID = await addPostQuery(received.profileID, received.message.title, received.message.text);
        received.postID = postID;
        received.user = this.users[received.profileID];
        return received;

      case "comment":
        let commentID = addCommentQuery(received.profileID, received.message.text, received.message.postID);
        commentID.then(function(result){received.commentID = result})
        return received;

      case "post-like":
        likePostQuery(received.message.postID, received.message.isLike)
        return received;

      case "comment-like":
        likeCommentQuery(received.message.commentID, received.message.isLike)
        return received;

      case "login":
        loginQuery(received.message.username, received.message.password);
        received.profileID = await loginQuery(received.message.username, received.message.password)
        this.users[received.profileID] = received.message.username;
        this.MonoSend(received, uuid);
        console.log(received.profileID);
        break;

      case "signup":
        received.message.username; // the username
        received.message.password; // the password
        // database stuff here
        received.profileID = 1; // the profileID, set to null if login failed
        this.users[received.profileID] = received.message.username;
        this.MonoSend(received, uuid);
        break;

      case "post-history":
        // database stuff here

        let postHistoryList = [];
        let responds = 
        {
          message_type: "post-history",
          postHistoryList
        }
        this.MonoSend(responds, uuid);
        break;

      case "notice":
        console.log(received.message);
        this.MonoSend(received, uuid);
        break;

      default:
        console.log(`invalid server interaction: ${received}`);
        break;
    }


    return null;
  }
}


WSServer.StartServer();





