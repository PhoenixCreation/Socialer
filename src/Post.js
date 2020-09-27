import React, { useState } from 'react';
import firebase from 'firebase'

import './Post.css'
import Avatar from '@material-ui/core/avatar'
import {Button, Input} from '@material-ui/core';
import { db } from './firebase'


function Post({postId, crntuser, username, userAvatar, caption, imageURL, comments}) {
  const [commentText,setCommentText] = useState('')

  const addComment = (e) =>{
    e.preventDefault()
    if(commentText !== ''){
    db.collection('posts').doc(postId).update({
      comments: firebase.firestore.FieldValue.arrayUnion({
        username: crntuser.displayName,
        commenttext: commentText
      })
    })
    }
    else{
      alert("bhai kaik lakh pachi comment kar")
    }
    setCommentText('')
  }

  return (
    <div className="post">
      <div className="post__header">
        <Avatar src={userAvatar} alt={username} className="post__headerAvatar" />
        <h3>{username}</h3>
      </div>
      <img className="post__image" src={imageURL} alt="Image not found" />
      <div className="post__footer"><strong>{username}:</strong>{caption}</div>
      <div className="post__commentbox">
        {
          comments.map(comment => (
          <div className="post__comment"><strong>{comment.username}</strong> : {comment.commenttext}</div>
          ))
        }
        { crntuser?.displayName ? (
          <form className="post__commentadder">
          <Input
          type="text"
          placeholder="share your thoughts on this post"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          />
          <Button type="submit" onClick={addComment}>Comment</Button>
          </form>
        ) : (
          <p>Login to comment</p>
        )
        }
      </div>
    </div>
  )
}

export default Post
