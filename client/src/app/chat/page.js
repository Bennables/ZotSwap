'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchedUserId = searchParams.get('userId');

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [matchedUserProfile, setMatchedUserProfile] = useState(null);

  // In a real app, you would fetch messages and the matched user's profile
  useEffect(() => {
    if (!matchedUserId) {
      // Handle case where no user ID is provided (e.g., redirect or show error)
      console.error('No matched user ID provided.');
      // Optionally redirect back to matches page
      // router.push('/matched');
      return;
    }

    // --- Placeholder: Fetch matched user profile ---
    // In a real app, replace this with an API call to get the matched user's details by ID
    const fetchMatchedUserProfile = async () => {
        try {
            // Example placeholder fetch (replace with your actual API)
            const response = await fetch(`http://localhost:4000/api/users/${matchedUserId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch matched user profile');
            }
            const userData = await response.json();
            setMatchedUserProfile(userData);
        } catch (error) {
            console.error('Error fetching matched user profile:', error);
            // Handle error (e.g., show error message)
        }
    };

    fetchMatchedUserProfile();
    
    // --- Placeholder: Fetch existing messages ---
    // In a real app, replace this with an API call to get messages for this chat
    // Example: fetch('/api/chat/messages?userId=${matchedUserId}')
    setMessages([
      { id: 1, sender: 'matched', text: 'Hi there!' },
      { id: 2, sender: 'currentUser', text: 'Hello!' },
    ]);

    // In a real app, you would set up a WebSocket connection here
    // to receive new messages in real-time.

  }, [matchedUserId]); // Dependency on matchedUserId

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const messageToSend = { id: Date.now(), sender: 'currentUser', text: newMessage };
    
    // --- Placeholder: Send message to backend ---
    // In a real app, replace this with an API call to send the message
    // Example: fetch('/api/chat/send', { method: 'POST', body: JSON.stringify(messageToSend) });
    console.log('Simulating sending message:', messageToSend);

    // --- Placeholder: Add message to local state (optimistic update) ---
    // In a real app, you might wait for backend confirmation before adding
    setMessages(prevMessages => [...prevMessages, messageToSend]);
    setNewMessage('');

    // In a real app with WebSockets, sending a message might trigger the
    // server to broadcast it back to all participants, including the sender,
    // so you'd update state in the WebSocket message handler instead of here.
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center bg-gray-100 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="w-full max-w-md bg-[#BDDDFC] dark:bg-gray-800 p-4 flex items-center justify-center shadow-md z-10 relative">
        {/* Back Button with Arrow Icon */}
        <button
          onClick={() => {
            console.log('Back button clicked!');
            router.back();
          }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#384959] dark:text-white hover:text-[#6A89A7] dark:hover:text-gray-400 transition-colors"
          aria-label="Go back"
        >
          <FaArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-[#384959] dark:text-white font-bold">{matchedUserProfile ? matchedUserProfile.firstName : 'Chat'}</span>
      </div>

      {/* Message Area */}
      <div className="flex-grow w-full max-w-md p-4 overflow-y-auto pt-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`mb-2 p-2 rounded-lg max-w-[75%] ${message.sender === 'currentUser'
              ? 'bg-[#BDDDFC] text-[#384959] ml-auto'
              : 'bg-gray-300 text-[#384959] mr-auto'}`}
          >
            {message.text}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="w-full max-w-md bg-white dark:bg-gray-700 p-4 flex items-center shadow-md">
        <input
          type="text"
          className="flex-grow border border-[#6A89A7] rounded-full px-4 py-2 mr-2 text-[#384959] dark:text-gray-200 dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6A89A7]"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <button
          onClick={handleSendMessage}
          className="bg-[#F7B267] text-[#384959] rounded-full px-4 py-2 font-semibold hover:bg-opacity-90 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
} 