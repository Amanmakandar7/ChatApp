import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addChatroom, deleteChatroom } from "../Slice/authSlice";
import toast, { Toaster } from "react-hot-toast";

/**
 * Dashboard Component
 * - Manages the list of chatrooms.
 * - Provides functionality to create, delete, persist, and enter chatrooms.
 * - Syncs chatrooms between Redux state and localStorage.
 */
export default function Dashboard({ onEnterRoom, onLogout }) {
  const [roomInput, setRoomInput] = useState("");
  const dispatch = useDispatch();
  const chatrooms = useSelector((state) => state.chat.chatrooms || []);
  const initializedRef = useRef(false);

  /**
   * On initial mount:
   * - Loads saved chatrooms from localStorage.
   * - Ensures initialization runs only once (using initializedRef).
   */
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      const raw = localStorage.getItem("chatrooms");
      if (!raw) return;

      const savedChatrooms = JSON.parse(raw);
      if (!Array.isArray(savedChatrooms) || savedChatrooms.length === 0) return;

      savedChatrooms.forEach((room) => {
        if (typeof room === "string") {
          const trimmed = room.trim();
          if (trimmed && !chatrooms.includes(trimmed)) {
            dispatch(addChatroom(trimmed));
          }
        }
      });
    } catch (err) {
      console.error("Failed to parse saved chatrooms:", err);
      localStorage.removeItem("chatrooms"); // prevent repeated parse errors
    }
  }, [dispatch]);

  /**
   * Persist chatrooms to localStorage whenever they change.
   * - If list is empty, remove the key to keep storage clean.
   */
  useEffect(() => {
    try {
      if (chatrooms && chatrooms.length > 0) {
        localStorage.setItem("chatrooms", JSON.stringify(chatrooms));
      } else {
        localStorage.removeItem("chatrooms");
      }
    } catch (err) {
      console.error("Failed to save chatrooms to localStorage:", err);
    }
  }, [chatrooms]);

  /**
   * Create a new chatroom.
   * - Validates input for empty strings and duplicates.
   */
  const handleCreate = () => {
    const trimmedName = roomInput.trim();
    if (!trimmedName) return toast.error("Enter chatroom name");
    if (chatrooms.includes(trimmedName))
      return toast.error("Chatroom already exists");

    dispatch(addChatroom(trimmedName));
    toast.success(`Chatroom "${trimmedName}" created`);
    setRoomInput("");
  };

  /**
   * Delete a chatroom by name.
   */
  const handleDelete = (roomName) => {
    dispatch(deleteChatroom(roomName));
    toast.success(`Chatroom "${roomName}" deleted`);
  };

  /**
   * Allow "Enter" key to trigger chatroom creation.
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleCreate();
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header with title and logout button */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <button
          onClick={onLogout}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Input for new chatroom creation */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter chatroom name"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      {/* Display message when no chatrooms exist */}
      {chatrooms.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No chatrooms yet</p>
      )}

      {/* Render chatroom list */}
      <ul className="space-y-2">
        {chatrooms.map((room) => (
          <li
            key={room}
            className="flex justify-between items-center border p-2 rounded flex-wrap gap-2"
          >
            <span
              onClick={() => onEnterRoom(room)}
              className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline"
            >
              {room}
            </span>
            <button
              onClick={() => handleDelete(room)}
              className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
