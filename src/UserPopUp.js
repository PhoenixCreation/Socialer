import React, {useState, useEffect} from 'react'
import {db} from './firebase'
import './UserPopUp'

function UserPopUp({userinfoID}) {
  const [userinfo,setUserinfo] = useState(null)

  useEffect(() => {
    if (userinfoID){
      db.collection('userinfo').onSnapshot(snapshot => {
        snapshot.forEach((doc) => {
          if(doc.id == userinfoID){
            setUserinfo(doc.data())
          }
        });

      })
    }
  },[userinfoID])

  return (
    <div className="UserPopUp">
      {userinfo?.username ? (
        <>
        <div className="UserPopUp__avatar">{userinfo.photoURL}</div>
        <div className="UserPopUp__username">{userinfo.username}</div>
        <div className="UserPopUp__followers">{userinfo.followers.length}</div>
        <div className="UserPopUp__followings">{userinfo.following.length}</div>
        <div className="UserPopUp__posts">{userinfo.posts.length}</div>
        </>
      ) : (
        <>lochA</>
      )}
    </div>
  )
}

export default UserPopUp
