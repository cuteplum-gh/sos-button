import React, { useState } from 'react';

const SendMessage = ({ sendMessage }) => {
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage('');
  };

  return (
    <div>
      <label htmlFor="messageInput">Enter your message:</label>
      <input
        type="text"
        id="messageInput"
        value={message}
        onChange={handleInputChange}
      />
      <button onClick={handleSendMessage}>Send Message</button>
    </div>
  );
};

export default SendMessage;
