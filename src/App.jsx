import React, { useState, useRef } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyD85AznPPZywDiiag5Y4-do4wCG8aWmvHM",
  authDomain: "mamezuki-63cc5.firebaseapp.com",
  projectId: "mamezuki-63cc5",
  storageBucket: "mamezuki-63cc5.appspot.com",
  messagingSenderId: "648126613854",
  appId: "1:648126613854:web:00e1b1053d108ca3e867cf"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header>
        <h1>🦊🐻</h1>
        <SignOut />
        </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
        </section>
    </div>
  );
}

function SignIn() { 
  const signInWithGoogle = () => { 
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <>
      <button className='sign-in' onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  )
}

function SignOut() { 
  return auth.currentUser && (
    
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatMessage(props) { 
  const { text, uid, photoURL} = props.message;
  const messageType = uid === auth.currentUser.uid ? 'sent' : 'received'

  return (
    <div className={`message ${messageType}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

function ChatRoom() { 
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(1000);

  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('')

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy} />
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type='submit'>➤</button>
      </form>
    </>
  )
}

export default App;
