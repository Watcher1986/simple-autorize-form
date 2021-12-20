import { useState, useEffect } from 'react';
import axios from 'axios';

const LongPulling = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    subscribe();
  }, []);

  const subscribe = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/get-messages');
      setMessages((prev) => [data, ...prev]);
      await subscribe();
    } catch {
      setTimeout(() => {
        subscribe();
      }, 500);
    }
  };

  const sendMessages = async () => {
    await axios.post('http://localhost:5000/new-messages', {
      message: value,
      id: Date.now(),
    });
    console.log(messages);
  };

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
            <div className="message" key={mess.id}>
              {mess.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LongPulling;
