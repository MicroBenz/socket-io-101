import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [isSetName, setIsSetName] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socket = useRef();
  useEffect(() => {
    socket.current = io('192.168.0.29:3001');
    socket.current.on('connect', () => console.log('connected', socket.current.id));
    socket.current.on('everyMessages', msgs => {
      setMessages(msgs);
      setText('');
    });
  }, []);
  function onSend() {
    socket.current.emit('newMessage', { name, text});
  }
  function onSendName() {
    setName(name);
    setIsSetName(true);
  }
  if (!isSetName) {
    return (
      <>
        <input className="textbox" type="text" value={name} onChange={e => setName(e.target.value)} />
        <button onClick={onSendName}>Join</button>
      </>
    )
  }
  return (
    <div className="App">
      <header className="App-header">
        <div className="chat-box">
          {messages.map((message) => {
            return (
              <div className={`box ${message.name === name ? 'self' : ''}`} key={message.created_at}>
                <h4 className="black">{message.message}</h4>
                <p className="black">{message.name}</p>
              </div>
            )
          })}
        </div>
        <input onKeyUp={e => {
          if (e.keyCode === 13) {
            e.preventDefault();
            onSend();
          }
        }} className="textbox" type="text" value={text} onChange={e => setText(e.target.value)} />
        <button onClick={onSend}>Send</button>
      </header>
    </div>
  );
}

export default App;
