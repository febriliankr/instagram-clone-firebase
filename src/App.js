import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './component/Post';
import { storage, db, auth, timestamp } from './config/firebaseConfig';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { Input } from '@material-ui/core';
import ImageUpload from './component/ImageUpload';

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
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  //user is the signed in user

  //useEffect -> runs a piece of code based on a specific condition
  useEffect(() => {
    //this is where the code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
      //everytime the change happens in firebase, it picks the snapshot
      setPosts(snapshot.docs.map((doc) => ({
        id: doc.id,
        post: doc.data()
      })
      ))
    })
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    })

    return () => {
      //perform cleanupactions
      unsubscribe();
    }

  }, [user, username])

  const signUp = e => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
  }

  const signIn = e => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message))

    setOpenSignIn(false);
  }

  
  return (
    <div className="App">
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" onSubmit={signIn}>
            <center>
              <h1>Instagram Logo</h1>

              <Input placeholder="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              <Input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
              <Button onClick={signIn}>Sign In</Button>
            </center>
          </form>
        </div>
      </Modal>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" onSubmit={signUp}>
            <center>
              <h1>Sign Up</h1>
              <Input placeholder="username" type="text" value={username} onChange={e => setUsername(e.target.value)} />
              <Input placeholder="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              <Input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
              <Button onClick={signUp}>Sign Up</Button>
            </center>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
        {
        user ? (
          <Button onClick={() => auth.signOut()}>Log Out</Button>
        ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )
      }
      </div>

      

      <div className="app__posts">
      {
        posts && posts.map(({ id, post }) => {
          return <Post key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} signedInUser={user}/>
        })
      }
      </div>


      {
        user?.displayName ? (<ImageUpload username={user.displayName} />) : (<h3>Login to upload</h3>)
      }

    </div>
  );
}

export default App;
