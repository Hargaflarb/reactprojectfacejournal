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

    const responds = this.GetServerResponse(message, uuid);

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
  

  static GetServerResponse(received, uuid){

    switch (received.message_type){
      case "post":
        received.user; // the user who posted
        received.message.text; // the post itself
        // database stuff here
        
        let postID = 1; // the new posts ID

        received.postID = postID;
        return received;

      case "comment":
        received.user; // the user who commented
        received.message.postID; // the ID of the post that is being commented on
        received.message.text; // the comment itself
        // database stuff here
        
        let commentID = null; // the new comments ID

        received.commentID = commentID;
        return received;

      case "post-like":
        received.user; // the user who liked
        received.message.value; //1 if it's a like, -1 if it's a dislike
        received.message.postID; // the liked posts ID
        // database stuff here
        return received;

      case "comment-like":
        received.user; // the user who liked
        received.message.value; // 1 if it's a like, -1 if it's a dislike
        received.message.commentID; // the liked comments ID
        // database stuff here
        return received;

      case "login":
        received.message.username; // the username
        received.message.password; // the password
        // database stuff here

        received.profileID = null; // the profileID, set to null if login failed
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





