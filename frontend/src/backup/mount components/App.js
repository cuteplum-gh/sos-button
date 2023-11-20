import React, { Component } from 'react';
import io from 'socket.io-client';
import SendMessage from './SendMessage';
import ReceiveMessage from './ReceiveMessage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receivedMessage: '',
      isSendMessageMounted: true,
      isReceiveMessageMounted: true,
    };

    this.socket = io('http://localhost:3001'); // Replace with your server address
  }

  componentDidMount() {
    this.socket.on('receive_message', (data) => {
      this.setState({ receivedMessage: data });
    });
  }

  sendMessage = (message) => {
    this.socket.emit('send_message', message);
  };

  toggleSendMessage = () => {
    this.setState((prevState) => ({
      isSendMessageMounted: !prevState.isSendMessageMounted,
    }));
  };

  toggleReceiveMessage = () => {
    this.setState((prevState) => ({
      isReceiveMessageMounted: !prevState.isReceiveMessageMounted,
    }));
  };

  render() {
    return (
      <div>
        <h1>Socket.IO Example - React Client</h1>

        {/* Toggle buttons */}
        <div>
          <button onClick={this.toggleSendMessage}>
            {this.state.isSendMessageMounted ? 'Unmount' : 'Mount'} Send Message
          </button>
          <button onClick={this.toggleReceiveMessage}>
            {this.state.isReceiveMessageMounted ? 'Unmount' : 'Mount'} Receive Message
          </button>
        </div>

        {/* Send Message Component */}
        {this.state.isSendMessageMounted && <SendMessage sendMessage={this.sendMessage} />}

        {/* Receive Message Component */}
        {this.state.isReceiveMessageMounted && <ReceiveMessage receivedMessage={this.state.receivedMessage} />}
      </div>
    );
  }
}

export default App;
