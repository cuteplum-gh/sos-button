import React, { Component } from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ReceiveC.css';

class ReceiveC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };

    this.socket = io('http://localhost:3001'); // 請替換成你的伺服器地址
  }

  componentDidMount() {
    this.socket.on('receive_message', (data) => {
      this.setState((prevState) => {
        // Check if the message already exists in the state
        const existingMessage = prevState.messages.find(
          (message) => message === data
        );

        // If the message doesn't exist, add it to the state
        if (!existingMessage) {
          return {
            messages: [...prevState.messages, data],
          };
        }

        return prevState; // If the message already exists, don't modify the state
      });
    });
  }

  handleRemoveMessage = (index) => {
    this.setState((prevState) => ({
      messages: prevState.messages.filter((_, i) => i !== index),
    }));
  };

  render() {
    return (
      <div className="container-fluid">
        <h1>一鍵SOS 反應中心</h1>
        <div className="message-container">
          {this.state.messages.map((message, index) => (
            <div key={index} className="message-bubble">
              {/* Button to remove the message block */}
              <button
                className="btn btn-danger btn-circle btn-sm float-end"
                onClick={() => this.handleRemoveMessage(index)}
              >
                X
              </button>
              <p>姓名 : {message.uName}</p>
              <p>電話 : {message.uPhone}</p>
              <p>
                地址 : {message.uAdd}{' '}
                {message.uAdd !== '' && (
                  <a target="_blank" href={`https://www.google.com/maps/search/${message.uAdd}`}>
                    Map
                  </a>
                )}
              </p>
              {message.latitude ? (
                <p>
                  位置 : {message.latitude}, {message.longitude}{' '}
                  <a
                    target="_blank"
                    href={`https://www.google.com/maps/search/${message.latitude},${message.longitude}`}
                  >
                    Map
                  </a>
                </p>
              ) : (
                <p>位置 : 不詳</p>
              )}
              <p>急名 : {message.uEName}</p>
              <p>急電 : {message.uEPhone}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ReceiveC;
