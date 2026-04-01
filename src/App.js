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
      darkmode: true
    }

    this.CreatePostPopup = this.CreatePostPopup.bind(this);
    this.AddComment=this.AddComment.bind(this);
    this.ViewComments=this.ViewComments.bind(this);
    this.CreateLoginPopup = this.CreateLoginPopup.bind(this);
    this.CreateSignUpPopup = this.CreateSignUpPopup.bind(this);
    this.DoBold = this.DoBold.bind(this);
    this.CommentDoBold = this.CommentDoBold.bind(this);
    this.SubmitNewPost = this.SubmitNewPost.bind(this);
    this.ToggleDarkMode = this.ToggleDarkMode.bind(this);
    this.MakeCommentInteraction = this.MakeCommentInteraction.bind(this);
  }

  ViewComments(post){
    let hasComments = this.state.allComments[post.postID] == undefined;
    if (hasComments){
      this.state.client.RequestCommentHistory(post.postID);
    }

    let commentWindow=window.open("","commentsWndow","width=800,height=700 popup=true");
    commentWindow.document.body.innerHTML=("<div id='root'></div>");

    commentWindow.document.body.style.backgroundColor="gray";
    commentWindow.document.getElementById("root").style.height="100%";
    commentWindow.document.getElementById("root").style.width="100%";

    const subRoot = ReactDOM.createRoot(commentWindow.document.getElementById('root'));
    subRoot.render(
      <React.StrictMode>
        <>
        <div style={{backgroundColor: 'lightgrey', padding: '5'}}>
        <h4>{post.posterUserName}</h4>
      <h3 style={{maxHeight: '50px', overflow: 'auto', overflowWrap: 'break-word'}}>{post.title}</h3>
      <p style={{maxHeight: '700px', overflow: 'auto', overflowWrap: 'break-word'}}>{post.text}</p>
      </div>
        <CommentLengthHook maxChar={200}/>
        <button onClick={()=>this.ExtractCommentText(commentWindow.document,post.postID)}>Submit</button>
        <div>{
          // this.state.allComments.filter(comment=>comment.postID == post.postID).map((comment)=>
          (this.state.allComments[post.postID] != undefined) ? this.state.allComments[post.postID].map((comment)=>
          this.Comment({
            commentID:comment.commentID,
            postID:comment.postID,
            posterUserName:comment.posterUserName,
            text:comment.text,
            likes:comment.likes,
            dislikes:comment.dislikes,
          })) : "This post has no comments."}
        </div>
          
        </>
      </React.StrictMode>
    );


    function CommentLengthHook(props){
      const [commentLength, setCommentLength] = useState("");

      function handleChange(event){
        setCommentLength(event.target.value.length);
      }

      return (
        <>
          <textarea id='commentTextbox' placeholder='Comment...' maxLength={props.maxChar} onChange={handleChange} style={{width:'100%'}}></textarea>
          <p>{commentLength}/{props.maxChar}</p>
        </>
      )
    }
  }

  ExtractCommentText(postDocument,postID){
    let text=postDocument.getElementById("commentTextbox").value;
    if(text.length<1){
      window.open("","commentsWndow").alert("You must write a comment before you can submit it.")
    }
    else{
      postDocument.getElementById("commentTextbox").value="";
      this.state.client.SendComment(postID, text);
    }
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
          <input type="text" id="titleTextbox" placeholder='New Post Title' maxLength={200} style={{backgroundColor: 'light-gray'}}></input>
          <br/>
          <PostLengthHook maxChar={2000}/>
          <br/>
          <button id="submitPostBtn" onClick={()=>this.ExtractText(postWindow.document)} style={{height:'8%', width:'20%', float:'right', fontSize:'100%'}}>Post</button>
        </>
      </React.StrictMode>
    );

    function PostLengthHook(props){
      const [postLength, setPostLength] = useState("");

      function handleChange(event){
        setPostLength(event.target.value.length);
      }

      return (
        <>
          <textarea id="contentTextbox" placeholder='Write your post here' maxLength={props.maxChar} onChange={handleChange} style={{backgroundColor: 'light-gray', height:'70%',width:'98%', alignSelf:'center'}}></textarea>
          <p>{postLength}/{props.maxChar}</p>
        </>
      )
    }

  }

  ExtractText(postDocument){
    let title=postDocument.getElementById("titleTextbox").value;
    let text=postDocument.getElementById("contentTextbox").value;
    if(title.length<1){
      window.open("","newPostWindow").alert("You need a title before you can post.");
    }
    else if(text.length<1){
      window.open("","newPostWindow").alert("You need text content before you can post.");
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

    logInWindow.document.body.style.backgroundColor="gray";
    logInWindow.document.getElementById("root").style.height="100%";
    logInWindow.document.getElementById("root").style.width="100%";

    const subRoot = ReactDOM.createRoot(logInWindow.document.getElementById('root'));
    subRoot.render(
      <React.StrictMode>
        <>
          <h1>Log in</h1>
          <hr/>
          <input type="text" id="usernameTextbox" placeholder='Username' maxLength={20}></input>
          <br/>
          <input type="text" id="passwordTextbox" placeholder='Password' maxLength={100}></input>
      
          <button id="submitLoginBtn" onClick={()=>this.ExtractLogInDetails(logInWindow.document)}>Log In</button>
        </>
      </React.StrictMode>
    );
  }

  ExtractLogInDetails(logInDocument){
    let username = logInDocument.getElementById("usernameTextbox").value;
    let password = logInDocument.getElementById("passwordTextbox").value;

     if(username.length<1){
      window.open("","LogInWindow").alert("Please write a username.")
    }
    else if(password.length<1){
      window.open("","LogInWindow").alert("Please write a password.")
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

    signUpWindow.document.body.style.backgroundColor="gray";
    signUpWindow.document.getElementById("root").style.height="100%";
    signUpWindow.document.getElementById("root").style.width="100%";

    const subRoot = ReactDOM.createRoot(signUpWindow.document.getElementById('root'));
    subRoot.render(
      <React.StrictMode>
        <>
          <h1>Sign Up</h1>
          <button id="submitSignUpBtn" onClick={()=>this.ExtractSignUpDetails(signUpWindow.document)}>Sign Up</button>
          <hr/>
          <input type="text" id="usernameTextbox" placeholder='Username' maxLength={20}></input>
          <br/>
          <PasswordWithHooks/>
        </>
      </React.StrictMode>
    );



    function PasswordWithHooks(props){
      const [value, setValue] = useState("");

      function handleChange(event){
        setValue(passwordRequirments(event.target.value));
      }

      function passwordRequirments(password){
        let has3numbers = /.*\d.*\d.*\d.*/.test(password);

        if (has3numbers){
          return "Password meet requirements";
        }
        else{
          return "Needs atleast 3 numbers";
        }
      }

      return (
        <>
          <input type="text" id="passwordTextbox" placeholder='Password' maxLength={100} onChange={handleChange}></input>
          <br/>
          <p>{value}</p>
        </>
      )
    }
  }

  ExtractSignUpDetails(signUpWindow){
    let username = signUpWindow.getElementById("usernameTextbox").value;
    let password = signUpWindow.getElementById("passwordTextbox").value;

    if(username.length<1){
      window.open("","SignUpWindow").alert("Please write a username.")
    }
    else if(password.length<1){
      window.open("","SignUpWindow").alert("Please write a password.")
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

  //likes and dislikes
  MakeCommentInteraction(postID, commentID, isLike){
    let interactions = this.state.commentInteractions[commentID]
    if (!(isLike ? interactions.liked : interactions.disliked)){
      this.state.client.SendCommentLike(postID, commentID, isLike);
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
    // console.log("post ID: " + postID + ", was commented on by " + user);
    let newComment={ posterUserName:user, commentID: commentID, postID:postID, text:text, likes:likes, dislikes:dislikes};
    this.setState({allComments: (prevComments=>{
      if (prevComments[postID] == undefined){
        prevComments[postID] = [];
      }
      prevComments[postID].push(newComment);
      return prevComments;
    })(this.state.allComments)});
    this.state.commentInteractions[commentID] = {liked: false, disliked: false};

    //updates rendere
    this.ViewComments(this.state.allPosts.find(post=>post.postID === postID));
  }

  AddComments(postID, comments){
    this.setState({allComments: (prevComments=>{
      prevComments[postID] = comments;
      return prevComments;
    })(this.state.allComments)});
    comments.forEach(comment => {
      this.state.commentInteractions[comment.commentID] = {liked: false, disliked: false};
    });

    //updates rendere
    this.ViewComments(this.state.allPosts.find(post=>post.postID === postID));
  }

  SubmitCommentInteraction(postID, commentID, isLike){
    if (isLike){
      this.state.allComments[postID].find((comment)=>comment.commentID==commentID).likes += 1;
    }
    else{
      this.state.allComments[postID].find((comment)=>comment.commentID==commentID).dislikes += 1;
    }

    //updates rendere
    this.ViewComments(this.state.allPosts.find(post=>post.postID === postID));
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

  Comment(props){
    return(
      <div className='comment' key={props.commentID} style={{backgroundColor: 'lightgray', width: '95%', maxHight: '30%', margin:'2px', padding: '3px'}}>
        <h5 style={{margin: '2px'}}>{props.posterUserName}</h5>
        <p style={{overflow: 'auto', overflowWrap: 'break-word', maxHeight: '90%'}}>{props.text}</p>
        <button onClick={() => this.MakeCommentInteraction(props.postID, props.commentID, true)}>{this.CommentDoBold(`Likes: ${props.likes}`, props.commentID, true)}</button> | <button onClick={() => this.MakeCommentInteraction(props.postID, props.commentID, false)}>{this.CommentDoBold(`dislikes: ${props.dislikes}`, props.commentID, false)}</button>
      </div>
    )
  }

  Post(props){
    return(
    <div className="post" key={props.postID}>
      <h4>{props.posterUserName}</h4>
      <h3>{props.title}</h3>
      <p>{props.text}</p>
       <button onClick={()=>{this.MakePostInteraction(props.postID, true)}}>{this.DoBold(`Likes: ${props.likes}`, props.postID, true)}</button> | <button onClick={()=>{this.MakePostInteraction(props.postID, false)}}>{this.DoBold(`dislikes: ${props.dislikes}`, props.postID, false)}</button>
      <div className='commentOptions'>
      <button className='viewCommentsBtn' onClick={()=>this.ViewComments(props)}>View Comments</button>
      </div>
    </div>);
  }

  DoBold(text, postID, intrctn){
    let intrctns = this.state.postInteractions[postID]; 
    return (intrctn ? intrctns.liked : intrctns.disliked) ? <b>{text}</b> : <div>{text}</div>;
  }

  CommentDoBold(text, commentID, intrctn){
    let intrctns = this.state.commentInteractions[commentID]; 
    return (intrctn ? intrctns.liked : intrctns.disliked) ? <b>{text}</b> : <div>{text}</div>;
  }

  render(){
    return (<>
      <div id="sidebar"><h2>Sidebar</h2>
        <button id="LoginBtn" onClick={this.CreateLoginPopup}><b>Log In</b></button>
        <button id="SignUpBtn" onClick={this.CreateSignUpPopup}><b>Sign Up</b></button>
        <br/>
        <br/>
        <p>Dark mode</p>
        <label className="switch">
        <input type="checkbox" id="DarkModeBtn" onClick={this.ToggleDarkMode}/>
        <span className="slider round" ></span>
        </label>
      </div>
      <div id="header"><h2>Group/Server name</h2><button id="addPostBtn" onClick={this.CreatePostPopup}><b>+</b></button></div>
      <div id="feed">{
        this.state.allPosts.map((post)=>
          this.Post({
            postID:post.postID,
            posterUserName:post.posterUserName,
            title:post.title,
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
