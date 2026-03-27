import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom/client';
import React, { useState, useEffect} from 'react';
import WSClient from './Client';


class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      allPosts:[
        // TemplatePost(), TemplatePost(),TemplatePost(),TemplatePost(),TemplatePost()
      ], 
      allComments:[

      ],
      postInteractions:[

      ],
      commentInteractions:[

      ],
      client: props.client.ReferanceExchange(this),
      darkmode: false
    }

    this.CreatePostPopup = this.CreatePostPopup.bind(this);
    this.AddComment=this.AddComment.bind(this);
    this.ViewComments=this.ViewComments.bind(this);
    this.CreateLoginPopup = this.CreateLoginPopup.bind(this);
    this.CreateSignUpPopup = this.CreateSignUpPopup.bind(this);
    this.DoBold = this.DoBold.bind(this);
    this.SubmitNewPost = this.SubmitNewPost.bind(this);
    this.ToggleDarkMode = this.ToggleDarkMode.bind(this);
  }




  async ViewComments(post){
  console.log(post.title+" was looked at by (username)");
  let commentWindow=window.open("","commentsWndow","width=400,height=200 popup=true")
  commentWindow.document.body.innerHTML=("<div id='root'></div>");
  const subRoot = ReactDOM.createRoot(commentWindow.document.getElementById('root'));
    subRoot.render(
      <React.StrictMode>
        <>
        <div>
        <h4>{post.posterUserName}</h4>
      <h3>{post.title}</h3>
      <p>{post.text}</p>
      </div>
        <textarea id='commentTextbox' placeholder='Comment...'></textarea>
        <button onClick={()=>this.ExtractCommentText(commentWindow.document,post)}>Submit</button>
        <div>{
          this.state.allComments.filter(comment=>comment.postID==post.postID).map((comment)=>
          Comment({
            key:comment.commentID,
            postID:comment.postID,
            posterUserName:comment.posterUserName,
            text:comment.text,
            likes:comment.likes,
            dislikes:comment.dislikes,
          }))}
        </div>
          
        </>
      </React.StrictMode>
    );
  }

  ExtractCommentText(postDocument,post){
    let text=postDocument.getElementById("commentTextbox").value;
    console.log("button pressed!");
    this.state.client.SendComment(post.postID, text);
    // this.AddComment(post.postID, text);
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
    let interactions = this.state.postInteractions[postID]
    if (!(isLike ? interactions.liked : interactions.disliked)){
      this.state.client.SendPostLike(postID, isLike);
      
      if (isLike){
        this.state.postInteractions[postID].liked = true;
      }
      else{
        this.state.postInteractions[postID].disliked = true;
      }
    }
  }

  //likes and dislikes
  MakeCommentInteraction(commentID, isLike){
    let interactions = this.state.commentInteractions[commentID]
    if (!(isLike ? interactions.liked : interactions.disliked)){
      this.state.client.SendCommentLike(commentID, isLike);
      
      if (isLike){
        this.state.commentInteractions[commentID].liked = true;
      }
      else{
        this.state.commentInteractions[commentID].disliked = true;
      }
    }
  }


  SubmitNewPost(user,postID,postTitle,text, likes=0, dislikes=0){
    let newPost={ posterUserName:user, postID:postID, title:postTitle, text:text, likes:likes, dislikes:dislikes};
    this.setState({allPosts: (prevPosts=>[newPost,...prevPosts])(this.state.allPosts)});
    //this.setState({postInteractions: (interactions => {interactions[postID] = {liked: false, disliked: false};})(this.state.postInteractions)})
    this.state.postInteractions[postID] = {liked: false, disliked: false};
  }

  SubmitNewPosts(posts){
    this.setState({allPosts: (prevPosts=>prevPosts.concat(posts))(this.state.allPosts)});
    posts.forEach(post => {
      this.state.postInteractions[post.postID] = {liked: false, disliked: false};
    });

  }

  AddComment(user, commentID, postID, text, likes=0, dislikes=0)
  {
    console.log("post ID: " + postID + ", was commented on by " + user);
    let newComment={ posterUserName:user, commentID: commentID, postID:postID, text:text, likes:likes, dislikes:dislikes};
    this.setState({allComments: (prevComments=>[newComment,...prevComments])(this.state.allComments)});
    
    this.state.commentInteractions[commentID] = {liked: false, disliked: false};
  }

  AddComments(comments){
    
  }

  SubmitCommentInteraction(commentID, isLike){
    if (isLike){
      this.state.allPosts.find((comment)=>comment.commentID==commentID).likes += 1;
    }
    else{
      this.state.allPosts.find((comment)=>comment.commentID==commentID).dislikes += 1;
    }
  }

  SubmitPostInteraction(postID, isLike){
    if (isLike){
      this.state.allPosts.find((post)=>post.postID==postID).likes += 1;
    }
    else{
      this.state.allPosts.find((post)=>post.postID==postID).dislikes += 1;
    }
    this.setState({allPosts: this.state.allPosts});
  }

  
  

  ToggleDarkMode(){
    this.setState({darkmode: !this.state.darkmode});

    if (this.state.darkmode){
      changeBGColor(window.document.getElementsByClassName("App-header"), "hsl(220, 13%, 82%)");
      changeColor(window.document.getElementsByClassName("App-link"), "hsl(193, 95%, 32%)");
      window.document.getElementById("header").style.backgroundColor = "hsl(0, 0%, 34%)";
      window.document.getElementById("sidebar").style.backgroundColor = "hsl(0, 0%, 17%)";
      window.document.getElementById("feed").style.backgroundColor = "hsl(0, 0%, 50%)";
      changeBGColor(window.document.getElementsByClassName("post"), "hsl(0, 0%, 34%)");
      // changeBGColor(window.document.getElementsByClassName("post:hover"), "hsl(0, 0%, 17%)");
      window.document.getElementById("addPostBtn").style.backgroundColor = "hsl(0, 0%, 17%)";
      changeBGColor(window.document.getElementsByClassName("newCommentField"), "hsl(0, 0%, 17%)");
      // window.document.getElementsByClassName("newCommentField:hover").style.backgroundColor = "hsl(0, 0%, 0%)";
    }
    else{
      changeBGColor(window.document.getElementsByClassName("App-header"), "#282c34");
      changeColor(window.document.getElementsByClassName("App-link"), "#61dafb");
      window.document.getElementById("header").style.backgroundColor = "#a9a9a9";
      window.document.getElementById("sidebar").style.backgroundColor = "#d3d3d3";
      window.document.getElementById("feed").style.backgroundColor = "#808080";
      changeBGColor(window.document.getElementsByClassName("post"), "#a9a9a9");
      // changeBGColor(window.document.getElementsByClassName("post:hover"), "#d3d3d3");
      window.document.getElementById("addPostBtn").style.backgroundColor = "#d3d3d3";
      changeBGColor(window.document.getElementsByClassName("newCommentField"), "#d3d3d3");
      // window.document.getElementsByClassName("newCommentField:hover").style.backgroundColor = "#ffffff";
    }
  }



  Post(props){
    return(
    <div className="post">
      <h4>{props.posterUserName}</h4>
      <h3>{props.title}</h3>
      <p>{props.text}</p>
       <button onClick={()=>{this.MakePostInteraction(props.key, true)}}>{this.DoBold(`Likes: ${props.likes}`, props.key, true)}</button> | <button onClick={()=>{this.MakePostInteraction(props.key, false)}}>{this.DoBold(`dislikes: ${props.dislikes}`, props.key, false)}</button>
      <div className='commentOptions'>
      <button className='viewCommentsBtn' onClick={()=>this.ViewComments(props)}>View Comments</button>
      </div>
    </div>);
  }

  DoBold(text, postID, intrctn){
    let intrctns = this.state.postInteractions[postID]; 
    return (intrctn ? intrctns.liked : intrctns.disliked) ? <b>{text}</b> : <div>{text}</div>;
  }

  render(){
    return (<>
      <div id="sidebar"><h2>Sidebar</h2>
        <button id="LoginBtn" onClick={this.CreateLoginPopup}><b>Log In</b></button>
        <button id="SignUpBtn" onClick={this.CreateSignUpPopup}><b>Sign Up</b></button>
        <button id="DarkModeBtn" onClick={this.ToggleDarkMode}><b>D</b></button>
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
      {/* <h5>{props.posterUserName}</h5> */}
      <p>{props.text}</p>
    </div>
  )
}

function changeBGColor(coll, color){

    for(var i=0, len=coll.length; i<len; i++)
    {
        coll[i].style["background-color"] = color;
    }
}

function changeColor(coll, color){

    for(var i=0, len=coll.length; i<len; i++)
    {
        coll[i].style["color"] = color;
    }
}

export default App;
