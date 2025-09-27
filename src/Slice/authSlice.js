// src/Slice/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

/**
 * Redux slice for managing chatrooms and their associated messages.
 * 
 * State Structure:
 *  - chatrooms: Array of chatroom names
 *  - messages:  Object mapping chatroom names to an array of messages
 */
const initialState = {
  chatrooms: [],   // List of chatroom names
  messages: {},    // Messages organized per chatroom
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    /**
     * Adds a new chatroom if it does not already exist.
     * Initializes an empty message array for the new chatroom.
     */
    addChatroom: (state, action) => {
      const roomName = action.payload.trim();
      if (roomName && !state.chatrooms.includes(roomName)) {
        state.chatrooms.push(roomName);
        state.messages[roomName] = state.messages[roomName] || [];
      }
    },

    /**
     * Deletes a chatroom and removes all messages associated with it.
     */
    deleteChatroom: (state, action) => {
      state.chatrooms = state.chatrooms.filter(
        (room) => room !== action.payload
      );
      delete state.messages[action.payload];
    },

    /**
     * Clears all chatrooms and their messages.
     * Useful for logout or application reset.
     */
    clearChatrooms: (state) => {
      state.chatrooms = [];
      state.messages = {};
    },

    /**
     * Appends a new message to the given chatroom.
     */
    addMessage: (state, action) => {
      const { room, message } = action.payload;
      if (!state.messages[room]) {
        state.messages[room] = [];
      }
      state.messages[room].push(message);
    },

    /**
     * Prepends a batch of messages to a chatroom.
     * Typically used for loading older chat history.
     */
    prependMessages: (state, action) => {
      const { room, messages } = action.payload;
      if (!state.messages[room]) {
        state.messages[room] = [];
      }
      state.messages[room] = [...messages, ...state.messages[room]];
    },
  },
});

// Export actions for use in components
export const {
  addChatroom,
  deleteChatroom,
  clearChatrooms,
  addMessage,
  prependMessages,
} = chatSlice.actions;

// Export reducer to be included in the store
export default chatSlice.reducer;
