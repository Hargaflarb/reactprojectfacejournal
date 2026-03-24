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
        TemplatePost(), TemplatePost(),TemplatePost(),TemplatePost(),TemplatePost()
      ],
      client: props.client.ReferanceExchange(this)
    }

    this.CreatePostPopup = this.CreatePostPopup.bind(this);
    this.AddComment=this.AddComment.bind(this);
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
    this.state.client.SendPost(text);
  }

  SubmitNewPost(postTitle,user,message){
    let newPost={ title:postTitle, posterUserName:user, text:message};
    this.setState({allPosts: (prevPosts=>[newPost,...prevPosts])(this.state.allPosts)});
  }

  render(){
    return (<>
      <div id="sidebar"><h2>Sidebar</h2></div>
      <div id="header"><h2>Group/Server name</h2><button id="addPostBtn" onClick={this.CreatePostPopup}><b>+</b></button></div>
      <div id="feed">{
        this.state.allPosts.map((post)=>
          <Post
            key={MakeRandomID(10)}
            title={post.title}
            posterUserName={post.posterUserName}
            text={post.text}
            addComment={()=>this.AddComment(post)}
          />
        )
      }
      </div>
    </>);
  }
}


function Post(props){
  return(<>
  <div className="post" id={props.key}>
    <h3>{props.title}</h3>
    <h4>{props.posterUserName}</h4>
    <p>{props.text}</p>
    <div className='commentOptions'>
      <button className='viewCommentsBtn'>View Comments</button>
      <textarea className='newCommentField' placeholder='Comment...'/>
      <button className='submitCommentBtn' onClick={props.addComment}>Submit</button>
      <div className='comments'></div>
    </div>
  </div>
  </>
  )}

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

function Comment(props){
  return(
    <div className='comment'>
      <h5>{props.posterUserName}</h5>
      <p>{props.text}</p>
    </div>
  )
}



export default App;
