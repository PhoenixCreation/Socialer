import React, { useState, useEffect } from 'react';
import './App.css';
import Avatar from '@material-ui/core/avatar'
import Post from './Post'
import ImageUpload from './ImageUpload'
import UserPopUp from './UserPopUp'
import { db, auth, storage } from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button, Input} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #aa4488',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [posts,setPosts] = useState([]);
  const [open,setOpen] = useState(false)
  const [openSignIn,setOpenSignIn] = useState(false)
  const [openPost,setOpenPost] = useState(false)
  const [openUser,setOpenUser] = useState(false)
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [email,setEmail] = useState('')
  const [userImage,setUserImage] = useState(null)
  const [user,setUser] = useState(null)
  const [avatarURL,setAvatarURL] = useState(null)

  const [modalStyle] = React.useState(getModalStyle);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //USer has logged in
        //console.log(authUser)
        setUser(authUser)
        if(authUser.photoURL != null){
          setAvatarURL(authUser.photoURL)
        }
        if(authUser.displayName){

        }else{
          return authUser.updateProfile({
            displayName: username
          })
        }
      }
      else{
        //logged out
        setUser(null)
      }

    })

    return () => {
      unsubscribe()
    }
  },[user,username])

  useEffect(() =>{
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  },[])

  const handleChange = (e) => {
    if(e.target.files[0]){
      setUserImage(e.target.files[0])
    }
  }

  const signUp = (event) => {
    event.preventDefault()

    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      authUser.user.updateProfile({
        displayName: username
      })
      const uploadTask = storage.ref(`ProfileImages/${username}`).put(userImage)
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot.bytesTransferred / snapshot.totalBytes )
        },
        (error) => {alert(error.message)},
        () => {
          storage
            .ref('ProfileImages')
            .child(username)
            .getDownloadURL()
            .then((url => {
              setAvatarURL(url)
              authUser.user.updateProfile({
                photoURL: url
              })

          db.collection('userinfo').add({
            email: email,
            username: username,
            photoURL: url,
            followers: [],
            following: [],
            posts: []
          })

          alert("user created successfully")
            }))
        }
      )

    })
    .catch((error) => alert(error.message))

    setOpen(false)
  }

  const signIn = (event) => {
    event.preventDefault()

    auth.signInWithEmailAndPassword(email,password)
    .then((authUser) => {
      setUser(authUser)
      setAvatarURL(authUser.user.photoURL)
      console.log(authUser)
    })
    .catch((error) => alert(error.message))

    setOpenSignIn(false)
  }

  return (
    <div className="app">
      {user?.displayName ? (
        <div className="app__postButton">
          <Button type="button" name="button" onClick={() => setOpenPost(true)} endIcon={<CloudUploadIcon />}>  Add</Button>
        </div>
        ) : (
          <h3>Log in or SignUp to start adding your movements too..</h3>
        )}
      <Modal
        open={openPost}
        onClose={() => setOpenPost(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        { user?.displayName ? (
          <ImageUpload username={user.displayName} userAvatar={avatarURL}/>

          ) : (
          <h3>You need to login... How am I supposed to allow you to post without login..</h3>

          )}
      </div>
      </Modal>
      <Modal //Sgn UP model
        open={open}
        onClose={() => setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <div id="simple-modal-description">
          <center>
            <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo" />
          </center>
          <form className="app_signUp">
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input type="file" name="image" onChange={handleChange} />

            <Button  type="submit" onClick={signUp}>SIgn Up</Button>
          </form>
        </div>

      </div>
      </Modal>

      <Modal //Sign in model
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <div id="simple-modal-description">
          <center>
            <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo" />
          </center>
          <form className="app_signUp">

            <Input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button  type="submit" onClick={signIn}>SIgn In</Button>
          </form>
        </div>

      </div>
      </Modal>
      <Modal
        open={openUser}
        onClose={() => setOpenUser(false)}
      >
      <div style={modalStyle} className={classes.paper}>
      <UserPopUp />
      </div>
      </Modal>

      {/* main app */}
      <div className="app__header">
        <div className="app__headerImage">
          Socialer
        </div>
        <div className="app__headerLogin">
        {user ? (
          <div className="app__headerRight">
          <Avatar src={avatarURL} alt={username} onClick={() => setOpenUser(true)}/>
          <Button onClick={() => auth.signOut()} id="signup-btn">Log Out</Button>
          </div>
        ): (
        <div>
          <Button onClick={() => setOpenSignIn(true)} >Sign In</Button>
          <Button onClick={() => setOpen(true)} >SignUp</Button>
        </div>
        )}
        </div>
      </div>
      {
        posts.map(({id,post}) => (
          <Post key={id} postId={id} crntuser={user} username={post.username} userAvatar={post.userAvatar} caption={post.caption} imageURL={post.imageURL} comments={post.comments}/>
        ))
      }
    </div>
  );
}

export default App;
