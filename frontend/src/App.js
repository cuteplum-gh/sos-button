// React Component
import React, { Component } from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import SendC from './SendC'; // Import the SendC component
import ReceiveC from './ReceiveC'; // Import the ReceiveC component

class App extends Component {
  render() {
    return (
      <Router>
          <Routes>
            {/* Route to the SendC component */}
            <Route path="/send" element={<SendC />} />
            {/* Route to the ReceiveC component */}
            <Route path="/receive" element={<ReceiveC />} />
          </Routes>
      </Router>
    );
  }
}

export default App;
