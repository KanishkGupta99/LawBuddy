import React, { useState } from 'react';
import VideoCall from './components/VideoCall';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (email && roomId) {
      setIsJoined(true);
    }
  };

  if (isJoined) {
    return <VideoCall email={email} roomId={roomId} />;
  }

  return (
    <div className="join-container">
      <h1>Join Video Call</h1>
      <form onSubmit={handleJoinRoom} className="join-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter room ID"
          required
        />
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
}

export default App;
