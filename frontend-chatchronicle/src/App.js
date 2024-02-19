import React from 'react';
import Login from './Login';
import Register from './Register';
import ChatSessions from './ChatSessions';
import './App.css';

function App() {
  return (
    <div className="App">
      <Login />
      <Register />
      <ChatSessions />
    </div>
  );
}

export default App;

