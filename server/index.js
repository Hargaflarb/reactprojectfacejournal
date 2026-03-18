// some code copied from https://ably.com/blog/websockets-react-tutorial#implementing-the-web-socket-server-in-node 16-03
// to start the server, write "node index.js" in the terminal, while in the server directory.
// if you're unsure of how it works hit me up.


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
    Object.keys(WSServer.connections).forEach((uuid) => {
      const connection = WSServer.connections[uuid];
      const message = JSON.stringify(broadcastObject);
      connection.send(message);
      console.log(message);
    });
  }

  static MonoSend(sentObject, uuid){
      const connection = WSServer.connections[uuid];
      const message = JSON.stringify(sentObject);
      connection.send(message);
      console.log(message);
  }
  

  static GetServerResponse(resived, uuid){

    switch (resived.message_type){
      case "post":
        resived.message.user; // the user who posted
        resived.message.text; // the post itself
        // database stuff here
        
        let postID = null; // the new posts ID

        resived.postID = postID;
        return resived;

      case "comment":
        resived.message.user; // the user who commented
        resived.message.postID; // the ID of the post that is being commented on
        resived.message.text; // the comment itself
        // database stuff here
        
        let commentID = null; // the new comments ID

        resived.commentID = commentID;
        return resived;

      case "post-like":
        resived.message.user; // the user who liked
        resived.message.value; //1 if it's a like, -1 if it's a dislike
        resived.message.postID; // the liked posts ID
        // database stuff here
        return resived;

      case "comment-like":
        resived.message.user; // the user who liked
        resived.message.value; // 1 if it's a like, -1 if it's a dislike
        resived.message.commentID; // the liked comments ID
        // database stuff here
        return resived;

      case "login":
        resived.message.username; // the username
        resived.message.password; // the password
        // database stuff here

        let validLogin = false; // bool descriping wether the login was a success

        resived.validLogin = validLogin;
        this.MonoSend(resived, uuid);
        break;

      case "post-history":
        // database stuff here

        let postHistoryList = [];

        this.MonoSend(postHistoryList, uuid);
        break;

      case "notice":
        console.log(resived.message);
        break;

      default:
        console.log("invalid server interaction");
        break;
    }


    return null;
  }
}


WSServer.StartServer();





