// React Component
import React, { Component } from 'react';
import io from 'socket.io-client';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      receivedMessage: '',
    };

    this.socket = io('http://localhost:3001'); // 請替換成你的伺服器地址
  }

  componentDidMount() {
    this.socket.on('receive_message', (data) => {
      this.setState({ receivedMessage: data });
    });
  }

  sendMessage = () => {
    this.socket.emit('send_message', this.state.message);
    this.setState({ message: '' });
  };

  render() {
    return (
      <div>
        <h1>Socket.IO Example - React Client</h1>
        <div>
          <label htmlFor="messageInput">Enter your message:</label>
          <input
            type="text"
            id="messageInput"
            value={this.state.message}
            onChange={(e) => this.setState({ message: e.target.value })}
          />
          <button onClick={this.sendMessage}>Send Message</button>
        </div>
        <p>Message from Server: {this.state.receivedMessage}</p>
      </div>
    );
  }
}

export default App;