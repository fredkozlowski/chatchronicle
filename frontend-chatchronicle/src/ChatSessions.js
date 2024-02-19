import React, { useState, useEffect } from 'react';

const ChatSessions = () => {
  const [chatSessions, setChatSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatSessions = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
        const response = await fetch(`${process.env.REACT_APP_API_URL}/chat-sessions`, {
//        const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Assuming Bearer token for simplicity
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setChatSessions(data);
      } catch (error) {
        console.error('Fetch chat sessions error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatSessions();
  }, []);

  if (isLoading) return <div>Loading chat sessions...</div>;
  if (error) return <div>Error fetching chat sessions: {error}</div>;

  return (
    <div className="chat-sessions-container">
      <h2>Chat Sessions</h2>
      {chatSessions.length > 0 ? (
        <ul>
          {chatSessions.map(session => (
            <li key={session.id}>
              Session with {session.user_id}: Last message at {session.last_message_at}
              {/* Adjust the fields based on your actual chat session data structure */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No chat sessions available.</p>
      )}
    </div>
  );
};

export default ChatSessions;

