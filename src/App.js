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
    this.AddComment=this.AddComment.bind(this);
    this.CreateLoginPopup = this.CreateLoginPopup.bind(this);
    this.CreateSignUpPopup = this.CreateSignUpPopup.bind(this);
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
  

  AddComment(post,text)
  {
    console.log(post.title+" was commented on by (username)");
    //this.document.getElementById(post.key).querySelectorAll('comments').appendChild(<Comment posterUserName='username' text={text}/>)
    
  }

  ExtractText(postDocument){
    let title=postDocument.getElementById("titleTextbox").value;
    let text=postDocument.getElementById("contentTextbox").value;
    window.open("","newPostWindow").close();
    console.log("button pressed!");
    this.state.client.SendPost(title, text);
  }

  CreateLoginPopup(){
    let logInWindow=window.open("","LogInWindow","width=400,height=200 popup=true");
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

  CreateSignUpPopup(){
    let signUpWindow=window.open("","SignUpWindow","width=400,height=200 popup=true");
    signUpWindow.document.body.innerHTML=("<div id='root'></div>");

    const subRoot = ReactDOM.createRoot(signUpWindow.document.getElementById('root'));
    subRoot.render(
      <React.StrictMode>
        <>
          <h1>Sign Up</h1>
          <hr/>
          <input type="text" id="usernameTextbox" placeholder='Username'></input>
          <br/>
          <input type="text" id="passwordTextbox" placeholder='Password'></input>
      
          <button id="submitSignUpBtn" onClick={()=>this.ExtractSignUpDetails(signUpWindow.document)}>Sign Up</button>
        </>
      </React.StrictMode>
    );
  }

  ExtractSignUpDetails(signUpWindow){
    let username = signUpWindow.getElementById("usernameTextbox").value;
    let password = signUpWindow.getElementById("passwordTextbox").value;
    window.open("","SignUpWindow").close();
    console.log("button pressed!");
    this.state.client.SendSignUp(username, password);
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

  SubmitCommentInteraction(commentID, isLike){
    if (isLike){
      this.state.allPosts.find((comment)=>comment.commentID==commentID).likes += 1;
    }
    else{
      this.state.allPosts.find((comment)=>comment.commentID==commentID).dislikes += 1;
    }
    //this.setState({allPosts: this.state.allPosts});
  }


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
      <div id="sidebar"><h2>Sidebar</h2>
        <button id="LoginBtn" onClick={this.CreateLoginPopup}><b>P</b></button>
        <button id="SignUpBtn" onClick={this.CreateSignUpPopup}><b>N</b></button>
      </div>
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



function Comment(props){
  return(
    <div className='comment'>
      <h5>{props.posterUserName}</h5>
      <p>{props.text}</p>
    </div>
  )
}



export default App;
