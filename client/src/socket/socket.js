// socket.js - Socket.io client setup

import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

// Socket.io connection URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Create socket instance
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Custom hook for using socket.io
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  // Connect to socket server
  const connect = (username) => {
    socket.connect();
    if (username) {
      socket.emit('user_join', username);
    }
  };

  // Disconnect from socket server
  const disconnect = () => {
    socket.disconnect();
  };

  // Send a message
  const sendMessage = (message) => {
    socket.emit('send_message', { message });
  };

  // Send a private message
  const sendPrivateMessage = (to, message) => {
    socket.emit('private_message', { to, message });
  };

  // Set typing status
  const setTyping = (isTyping) => {
    socket.emit('typing', isTyping);
  };

  // Socket event listeners
  useEffect(() => {
    // Connection events
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    // Message events
    const onReceiveMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => [...prev, message]);
    };

    const onPrivateMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => [...prev, message]);
    };

    // User events
    const onUserList = (userList) => {
      setUsers(userList);
    };

    const onUserJoined = (user) => {
      // You could add a system message here
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} joined the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const onUserLeft = (user) => {
      // You could add a system message here
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} left the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    // Typing events
    const onTypingUsers = (users) => {
      setTypingUsers(users);
    };

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);
    socket.on('private_message', onPrivateMessage);
    socket.on('user_list', onUserList);
    socket.on('user_joined', onUserJoined);
    socket.on('user_left', onUserLeft);
    socket.on('typing_users', onTypingUsers);

    // Clean up event listeners
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceiveMessage);
      socket.off('private_message', onPrivateMessage);
      socket.off('user_list', onUserList);
      socket.off('user_joined', onUserJoined);
      socket.off('user_left', onUserLeft);
      socket.off('typing_users', onTypingUsers);
    };
  }, []);

  return {
    socket,
    isConnected,
    lastMessage,
    messages,
    users,
    typingUsers,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
  };
};

export default socket; 


/*
This file only covers the Socket.io client setup and a custom React hook for socket events.
Here's what is covered and what is missing for each task:

Task 1: Project Setup
- "Set up a Node.js server with Express": NOT covered here. You need a server file (e.g., server.js or index.js) with Express and Socket.io setup.
- "Configure Socket.io on the server side": NOT covered here. Needs server-side code.
- "Create a React front-end application": PARTIALLY covered (this is a client file, but the full app is not shown).
- "Set up Socket.io client in the React app": COVERED in this file.
- "Establish a basic connection between client and server": PARTIALLY covered (client-side only).

Task 2: Core Chat Functionality
- "Implement user authentication": NOT covered here. Needs authentication logic (could be simple username prompt or JWT).
- "Create a global chat room": PARTIALLY covered (client emits/receives messages, but server logic not shown).
- "Display messages with sender's name and timestamp": PARTIALLY covered (messages are stored, but UI not shown).
- "Show typing indicators": PARTIALLY covered (client handles typing events).
- "Implement online/offline status": PARTIALLY covered (user list is handled, but server logic not shown).

Task 3: Advanced Chat Features
- "Create private messaging": PARTIALLY covered (client emits/receives private messages, but server logic not shown).
- "Implement multiple chat rooms": NOT covered here.
- "Add 'user is typing' indicator": PARTIALLY covered.
- "Enable file or image sharing": NOT covered here.
- "Implement read receipts": NOT covered here.
- "Add message reactions": NOT covered here.

Task 4: Real-Time Notifications
- "Send notifications when a user receives a new message": NOT covered here.
- "Notify when a user joins or leaves a chat room": PARTIALLY covered (system messages on join/leave).
- "Display unread message count": NOT covered here.
- "Implement sound notifications": NOT covered here.
- "Add browser notifications": NOT covered here.

Task 5: Performance and UX Optimization
- "Implement message pagination": NOT covered here.
- "Add reconnection logic": PARTIALLY covered (client reconnection options set).
- "Optimize Socket.io for performance": NOT covered here.
- "Implement message delivery acknowledgment": NOT covered here.
- "Add message search functionality": NOT covered here.
- "Ensure the application works well on both desktop and mobile devices": NOT covered here.

Files needed to complete all tasks:
- Server file (e.g., server.js) with Express and Socket.io setup, handling all events.
- React components for chat UI, authentication, notifications, etc.
- Additional client and server logic for advanced features (file sharing, reactions, read receipts, etc.).

Summary: This file only covers the client-side socket logic. You need to implement the server-side logic and additional React components to fully meet all tasks.