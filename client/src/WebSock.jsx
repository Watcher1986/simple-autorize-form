import { useState, useRef } from 'react';
import axios from 'axios';

const WebSock = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const socket = useRef();
  const [connected, setConnected] = useState(false);
  const [userName, setUserName] = useState('');

  function connect() {
    socket.current = new WebSocket('ws://localhost:5000');

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: 'connection',
        userName,
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));
    };
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };
    socket.current.onclose = () => {
      console.log('Socket has closed');
    };
    socket.current.onerror = () => {
      console.log('Socket error has been occurred');
    };
  }

  const sendMessages = async () => {
    const message = {
      userName,
      message: value,
      id: Date.now(),
      event: 'message',
    };
    socket.current.send(JSON.stringify(message));
    setValue('');
  };

  if (!connected) {
    return (
      <div className="center">
        <div className="form">
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            type="text"
            placeholder="Enter your name"
          />
          <button onClick={connect}>Enter</button>
        </div>
      </div>
    );
  }

  return (
    <div className="center">
      <div>
        <div className="form">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={sendMessages}>Send</button>
        </div>
        <div className="messages">
          {messages.map((mess) => (
            <div key={mess.id}>
              {mess.event === 'connection' ? (
                <div className="connection_message">
                  User {mess.userName} has connected
                </div>
              ) : (
                <div className="message">
                  {mess.userName}. {mess.message}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebSock;
