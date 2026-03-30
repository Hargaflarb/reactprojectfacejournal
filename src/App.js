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
      allComments:[],
      postInteractions:[

      ],
      client: props.client.ReferanceExchange(this)
    }

    this.CreatePostPopup = this.CreatePostPopup.bind(this);
    this.AddComment=this.AddComment.bind(this);
    this.ViewComments=this.ViewComments.bind(this);
    this.CreateLoginPopup = this.CreateLoginPopup.bind(this);
    this.CreateSignUpPopup = this.CreateSignUpPopup.bind(this);
    this.DoBold = this.DoBold.bind(this);
    this.SubmitNewPost = this.SubmitNewPost.bind(this);
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
          <input type="text" id="titleTextbox" placeholder='New Post Title' style={{backgroundColor: 'light-gray'}} minLength={1} maxLength={100}></input>
          <br/>
          <textarea id="contentTextbox" placeholder='Write your post here' style={{backgroundColor: 'light-gray', height:'70%',width:'98%', alignSelf:'center'}} minLength={1} maxLength={2000}></textarea>
          <br/>
          <button id="submitPostBtn" onClick={()=>this.ExtractText(postWindow.document)} style={{height:'8%', width:'20%', float:'right', fontSize:'100%'}}>Post</button>
        </>
      </React.StrictMode>
    );
  }
  ViewComments(post){
    console.log(post.title+" was looked at by (username)");
    let commentWindow=window.open("","commentsWndow","width=700,height=500 popup=true")
    commentWindow.document.body.innerHTML=("<div id='root'></div>");

    commentWindow.document.getElementById("root").style.height="100%";
    commentWindow.document.getElementById("root").style.width="100%";
    commentWindow.document.body.style.backgroundColor="gray";

  const subRoot = ReactDOM.createRoot(commentWindow.document.getElementById('root'));
    subRoot.render(
      <React.StrictMode>
        <>
        <div style={{backgroundColor: 'lightgray', position: 'sticky', padding:'15px', top:'0', wordWrap:'break-word'}}>
          <h4>{post.posterUserName}</h4>
          <h3>{post.title}</h3>
          <p>{post.text}</p>
        </div>
        <br/>
        <textarea id='commentTextbox' placeholder='Comment...' style={{position:'sticky', top:'100', width: "100%"}} minLength={1} maxLength={500}></textarea>
        <button onClick={()=>this.ExtractCommentText(commentWindow.document,post)} style={{position:'sticky', top:'100'}}>Submit</button>
        <div style={{overflow: 'scroll'}}>
        {
          this.state.allComments.filter(comment=>comment.postID==post.postID).map((comment)=>
            this.Comment({
              key:comment.postID,
              posterUserName:post.posterUserName,
              text:comment.text,
              likes:comment.likes,
              dislikes:comment.dislikes,
          }))}
        </div>
          
        </>
      </React.StrictMode>
    );
  }

  AddComment(message,post)
  {
    console.log(post.title+" was commented on by (username)");
    let newComment={ postID:post.key, text:message, likes:0, dislikes:0};
    this.setState({allComments: (prevComments=>[newComment,...prevComments])(this.state.allComments)});
  }

    ExtractCommentText(postDocument,post){
    let text=postDocument.getElementById("commentTextbox").value;
    postDocument.getElementById("commentTextbox").value="";
    console.log("button pressed!");
    if(text.length<1){
      window.open("","commentsWndow").alert("You need to put something in the comment field before you can comment on this post.")
    }
    else this.AddComment(text,post);
  }

  ExtractText(postDocument){
    let title=postDocument.getElementById("titleTextbox").value;
    let text=postDocument.getElementById("contentTextbox").value;
    if(title.length<1){
      window.open("","newPostWindow").alert("Your post must have a title before it can be submitted.")
    }
    else if(text.length<1){
      window.open("","newPostWindow").alert("Your post must have text before it can be submitted.")
    }
    else{
    window.open("","newPostWindow").close();
    console.log("button pressed!");
    this.state.client.SendPost(title, text);
    }
  }

  CreateLoginPopup(){
    let logInWindow=window.open("","LogInWindow","width=400,height=200 popup=true");
    logInWindow.document.body.innerHTML=("<div id='root'></div>");

    logInWindow.document.getElementById("root").style.height="100%";
    logInWindow.document.getElementById("root").style.width="100%";
    logInWindow.document.body.style.backgroundColor="gray";

    const subRoot = ReactDOM.createRoot(logInWindow.document.getElementById('root'));
    subRoot.render(
      <React.StrictMode>
        <>
          <h1>Log in</h1>
          <hr/>
          <input type="text" id="usernameTextbox" placeholder='Username' minLength={1} maxLength={20}></input>
          <br/>
          <input type="text" id="passwordTextbox" placeholder='Password' minLength={1} maxLength={100}></input>
      
          <button id="submitLoginBtn" onClick={()=>this.ExtractLogInDetails(logInWindow.document)}>Log In</button>
        </>
      </React.StrictMode>
    );
  }

  ExtractLogInDetails(logInDocument){
    let username = logInDocument.getElementById("usernameTextbox").value;
    let password = logInDocument.getElementById("passwordTextbox").value;
    if(username.length<1){
      window.open("","LogInWindow").alert("Please enter your username.")
    }
    else if(password.length<1){
      window.open("","LogInWindow").alert("Please enter your password.")
    }
    else{
      window.open("","LogInWindow").close();
      console.log("button pressed!");
      this.state.client.RequestLogIn(username, password);
    }
  }

  CreateSignUpPopup(){
    let signUpWindow=window.open("","SignUpWindow","width=400,height=200 popup=true");
    signUpWindow.document.body.innerHTML=("<div id='root'></div>");

    signUpWindow.document.getElementById("root").style.height="100%";
    signUpWindow.document.getElementById("root").style.width="100%";
    signUpWindow.document.body.style.backgroundColor="gray";

    const subRoot = ReactDOM.createRoot(signUpWindow.document.getElementById('root'));
    subRoot.render(
      <React.StrictMode>
        <>
          <h1>Sign Up</h1>
          <hr/>
          <input type="text" id="usernameTextbox" placeholder='Username' minLength={1} maxLength={20}></input>
          <br/>
          <input type="text" id="passwordTextbox" placeholder='Password' minLength={1} maxLength={100}></input>
      
          <button id="submitSignUpBtn" onClick={()=>this.ExtractSignUpDetails(signUpWindow.document)}>Sign Up</button>
        </>
      </React.StrictMode>
    );
  }

  ExtractSignUpDetails(signUpWindow){
    let username = signUpWindow.getElementById("usernameTextbox").value;
    let password = signUpWindow.getElementById("passwordTextbox").value;
    if(username.length<1)
      {
        window.open("","SignUpWindow").alert("Please enter a new username");
      }
    else if(password.length<1){
      window.open("","SignUpWindow").alert("Please enter a new password");
    }
    else{
    window.open("","SignUpWindow").close();
    console.log("button pressed!");
    this.state.client.SendSignUp(username, password);
    }
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


  SubmitNewPost(user,postID,postTitle,message){
    let newPost={ posterUserName:user, postID:postID, title:postTitle, text:message, likes:0, dislikes:0};
    this.setState({allPosts: (prevPosts=>[newPost,...prevPosts])(this.state.allPosts)});
    //this.setState({postInteractions: (interactions => {interactions[postID] = {liked: false, disliked: false};})(this.state.postInteractions)})
    this.state.postInteractions[postID] = {liked: false, disliked: false};
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

Comment(props){
  return(
    <div className='comment' style={{backgroundColor:'lightgray', padding:'5px', margin:'5px'}}>
      {/* <h5>{props.posterUserName}</h5> */}
      <p style={{wordWrap:"break-word",overflow: "scroll", maxHeight:"150px"}}>{props.text}</p>
    </div>
  )
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






export default App;
