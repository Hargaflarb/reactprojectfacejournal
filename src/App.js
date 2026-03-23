import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom/client';
import React, { useState } from 'react';
import WSClient from './Client';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      allPosts:[
        // TemplatePost(), TemplatePost(),TemplatePost(),TemplatePost(),TemplatePost()
      ],
      client: props.client.ReferanceExchange(this)
    }

    this.CreatePostPopup = this.CreatePostPopup.bind(this);
    this.CreateLoginPopup = this.CreateLoginPopup.bind(this);
    this.InteractWithPost = this.InteractWithPost.bind(this);
  }

  CreatePostPopup()
  {
    let postWindow=window.open("","newPostWindow","width=600,height=600 popup=true");
    postWindow.document.body.innerHTML=("<div id='root'></div>");
    postWindow.document.body.style.backgroundColor="gray";
    postWindow.document.getElementById("root").style.height="100%";
    postWindow.document.getElementById("root").style.width="100%";
    const subRoot = ReactDOM.createRoot(postWindow.document.getElementById('root'));
    subRoot.render(
      <React.StrictMode>
        <>
          <h1>New post</h1>
          <hr/>
          <input type="text" id="titleTextbox" placeholder='New Post Title' style={{backgroundColor: 'light-gray'}}></input>
          <br/>
          <textarea id="contentTextbox" placeholder='Write your post here' style={{backgroundColor: 'light-gray', height:'70%',width:'98%', alignSelf:'center'}}></textarea>
          <br/>
          <button id="submitPostBtn" onClick={()=>this.ExtractText(postWindow.document)} style={{height:'8%', width:'20%', float:'right', fontSize:'100%'}}>Post</button>
        </>
      </React.StrictMode>
    );
  }
  
  InteractWithPost(post)
  {
    console.log(post.title+" was clicked!");
  }

  ExtractText(postDocument){
    let title=postDocument.getElementById("titleTextbox").value;
    let text=postDocument.getElementById("contentTextbox").value;
    window.open("","newPostWindow").close();
    console.log("button pressed!");
    this.state.client.SendPost(title, text);
  }


  CreateLoginPopup(){
    let logInWindow=window.open("","LogInWindow","width=600,height=600 popup=true");
    logInWindow.document.body.innerHTML=("<div id='root'></div>");

    const subRoot = ReactDOM.createRoot(logInWindow.document.getElementById('root'));
    subRoot.render(
      <React.StrictMode>
        <>
          <h1>Log in</h1>
          <hr/>
          <input type="text" id="usernameTextbox" placeholder='Username'></input>
          <br/>
          <input type="text" id="passwordTextbox" placeholder='Password'></input>
      
          <button id="submitLoginBtn" onClick={()=>this.ExtractLogInDetails(logInWindow.document)}>Log In</button>
        </>
      </React.StrictMode>
    );
  }

  ExtractLogInDetails(logInDocument){
    let username = logInDocument.getElementById("usernameTextbox").value;
    let password = logInDocument.getElementById("passwordTextbox").value;
    window.open("","LogInWindow").close();
    console.log("button pressed!");
    this.state.client.RequestLogIn(username, password);
  }

  //likes and dislikes
  MakePostInteraction(postID, isLike){
    this.state.client.SendPostLike(postID, isLike);
  }


  SubmitNewPost(user,postID,postTitle,message){
    let newPost={ posterUserName:user, postID:postID, title:postTitle, text:message, likes:0, dislikes:0};
    this.setState({allPosts: (prevPosts=>[newPost,...prevPosts])(this.state.allPosts)});
  }

  // SubmitNewComment(postTitle,user,message){ //not functional
  //   let newPost={ title:postTitle, posterUserName:user, text:message, likes:0, dislikes:0};
  //   this.setState({allPosts: (prevPosts=>[newPost,...prevPosts])(this.state.allPosts)});
  // }

  // SubmitLikePost(postID){ //outdated
  //   let index = this.state.allPosts.findIndex((post)=>post.postID==postID);
  //   let newObj = this.state.allPosts[index];
  //   newObj.likes += 1
  //   this.setState({allPosts: this.state.allPosts.with(index, newObj)});
  // }

  SubmitPostInteraction(postID, isLike){
    if (isLike){
      this.state.allPosts.find((post)=>post.postID==postID).likes += 1;
    }
    else{
      this.state.allPosts.find((post)=>post.postID==postID).dislikes += 1;
    }
    this.setState({allPosts: this.state.allPosts});
  }

  
  


  Post(props){
    return(
    <div className="post">
      <h4>{props.posterUserName}</h4>
      <h3>{props.title}</h3>
      <p>{props.text}</p>
      <button onClick={()=>{this.MakePostInteraction(props.key, true)}}>likes: {props.likes}</button> | <button onClick={()=>{this.MakePostInteraction(props.key, false)}}>dislikes: {props.dislikes}</button>
    </div>);
  }

  render(){
    return (<>
      <div id="sidebar"><h2>Sidebar</h2><button id="LoginBtn" onClick={this.CreateLoginPopup}><b>P</b></button></div>
      <div id="header"><h2>Group/Server name</h2><button id="addPostBtn" onClick={this.CreatePostPopup}><b>+</b></button></div>
      <div id="feed">{
        this.state.allPosts.map((post)=>
          this.Post({
            key:post.postID,
            title:post.title,
            posterUserName:post.posterUserName,
            text:post.text,
            likes:post.likes,
            dislikes:post.dislikes,
          })
        )
      }
      </div>
    </>);
  }
}



//   function CreatePostPopup()
//   {
//     let postWindow=window.open("","newPostWindow","width=600,height=600 popup=true");
//     postWindow.document.body.innerHTML=("<div id='root'></div>");

//     const subRoot = ReactDOM.createRoot(postWindow.document.getElementById('root'));
//     subRoot.render(
//       <React.StrictMode>
//         <>
//         <h1>New post</h1>
//         <hr/>
//         <input type="text" id="titleTextbox" placeholder='New Post Title'></input>
//         <br/>
//         <input type="text" id="contentTextbox" placeholder='Write your post here'></input>
    
//         <button id="submitPostBtn" onClick={()=>ExtractText(postWindow.document)}>Post</button>
//       </>
//     </React.StrictMode>
//     );
//   }
//   function ExtractText(postDocument){
//     let title=postDocument.getElementById("titleTextbox").value;
//     let text=postDocument.getElementById("contentTextbox").value;
//     window.open("","newPostWindow").close();
//     SubmitNewPost(title,"username",text);
//   }

//   function SubmitNewPost(postTitle,user,message)
//   {
//   let newPost={ title:postTitle, posterUserName:user, text:message}
//   console.log("button pressed!");
//   setPosts(prevPosts=>[newPost,...prevPosts]);
//   }

//   return (
//     <>
//     <div id="sidebar"><h2>Sidebar</h2></div>
//     <div id="header"><h2>Group/Server name</h2><button id="addPostBtn" onClick={CreatePostPopup}><b>+</b></button></div>
//     <div id="feed">
//       {
//         allPosts.map((post)=>
//           <Post
//             key={MakeRandomID(10)}
//             title={post.title}
//             posterUserName={post.posterUserName}
//             text={post.text}
//           />
//         )
//       }
//     </div>
//     </>
//   );
// }

function Post(props){
  return(
  <div className="post" onClick={props.onClick}>
    <h3>{props.title}</h3>
    <h4>{props.posterUserName}</h4>
    <p>{props.text}</p>
    <button className='likeBtn'><image/></button>
    <button className='dislikeBtn'><image/></button>
  </div>)}

  function TemplatePost(){
  return { title:"Temp Title", 
    posterUserName:"Temp user", 
    text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
}

//temp id maker, feel free to remove, doesn't make unique ids
function MakeRandomID(length){
let result='';
let characters='QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwertyuiopasdfghjklzxcvbnm';
for (let i=0;i<length;i++){
  result += characters.charAt(Math.floor(Math.random()*characters.length));
}
return result;
}






export default App;
