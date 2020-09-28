import React, { useState, useEffect } from 'react';
import firebase from 'firebase'

import './Post.css'
import Avatar from '@material-ui/core/avatar'
import {Button, Input, IconButton} from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { db } from './firebase'


function Post({postId, crntuser, username, userAvatar, caption, imageURL, comments}) {
  const [commentText,setCommentText] = useState('')
  const [liked,setLiked] = useState(false)
  const [likeCount,setLikeCount] = useState(0)

  useEffect(() => {
    db.collection('posts').doc(postId).get().then((doc) => {
      var data = doc.data().likes
      setLikeCount(data.length)
      if(crntuser){

      if(data.includes(crntuser.displayName)){
        setLiked(true)
      }
    }
    })
  },[])

  const toggleLike = (e) => {
    e.preventDefault()
    db.collection('posts').doc(postId).get().then((doc) => {
      var data = doc.data().likes
      if(data.includes(crntuser.displayName)){
        setLiked(false)
        db.collection('posts').doc(postId).update({
          likes: firebase.firestore.FieldValue.arrayRemove(crntuser.displayName)
        })
        setLikeCount(data.length - 1)
      }
      else{
        setLiked(true)
        db.collection('posts').doc(postId).update({
          likes: firebase.firestore.FieldValue.arrayUnion(crntuser.displayName)
        })
        setLikeCount(data.length + 1)

      }
    })
  }

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
      <div className="post__likesection">
      {crntuser?.displayName && liked ? (
        <IconButton onClick={toggleLike}>
          <FavoriteIcon color="secondary"/>
        </IconButton>
      ) : crntuser?.displayName && !liked ? (
        <IconButton onClick={toggleLike}>
          <FavoriteBorderIcon color="secondary"/>
        </IconButton>      ) : (
        <p></p>
      )
      }
      <div className="post__likestotal">{likeCount}</div>
      </div>
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
          placeholder="share your thoughs..."
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
