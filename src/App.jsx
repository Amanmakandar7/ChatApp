import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Components/Login";
import Dashboard from "./pages/Dashboard";
import Chatroom from "./Components/chatRoom/Chatroom";

export default function App() {
  // Load user from sessionStorage on refresh only
  const [user, setUser] = useState(() => {
    // sessionStorage persists only across refresh, not npm run dev
    return sessionStorage.getItem("user") || null;
  });

  const [currentRoom, setCurrentRoom] = useState(() => {
    return sessionStorage.getItem("currentRoom") || null;
  });

  // Save user & currentRoom to sessionStorage
  useEffect(() => {
    if (user) sessionStorage.setItem("user", user);
    else sessionStorage.removeItem("user");

    if (currentRoom) sessionStorage.setItem("currentRoom", currentRoom);
    else sessionStorage.removeItem("currentRoom");
  }, [user, currentRoom]);

  // Login callback
  const handleLoginSuccess = (phone) => {
    setUser(phone);
  };

  // Logout callback
  const handleLogout = () => {
    setUser(null);
    setCurrentRoom(null);
  };

  // Enter chatroom
  const handleEnterRoom = (roomName) => {
    setCurrentRoom(roomName);
  };

  // Back to dashboard
  const handleBack = () => {
    setCurrentRoom(null);
  };

  return (
    <>
      {!user && <Login onLoginSuccess={handleLoginSuccess} />}
      {user && !currentRoom && (
        <Dashboard onEnterRoom={handleEnterRoom} onLogout={handleLogout} />
      )}
      {user && currentRoom && (
        <Chatroom roomName={currentRoom} onBack={handleBack} />
      )}
    </>
  );
}
