import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, prependMessages } from "../../Slice/authSlice";
import Message from "./Message";

export default function Chatroom({ roomName, onBack }) {
  const dispatch = useDispatch();

  // Memoized selector to avoid rerenders
  const messages = useSelector((state) =>
    state.chat.messages[roomName] ?? []
  );

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const prevMessagesLengthRef = useRef(messages.length);

  // Add 20 default messages if empty
  useEffect(() => {
    if (messages.length === 0) {
      const dummyMessages = Array.from({ length: 20 }, (_, i) => ({
        text: `Dummy message ${i + 1}`,
        sender: i % 2 === 0 ? "ai" : "user",
        timestamp: new Date(Date.now() - (20 - i) * 60000).toISOString(),
      }));
      dispatch(prependMessages({ room: roomName, messages: dummyMessages }));
    }
  }, [roomName, messages.length, dispatch]);

  // Scroll to bottom after initial messages
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  // Auto-scroll on new messages
  useEffect(() => {
    const newMessagesCount = messages.length - prevMessagesLengthRef.current;
    if (newMessagesCount === 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() && !imagePreview) return;

    const userMessage = {
      text: input,
      sender: "user",
      timestamp: new Date().toISOString(),
      image: imagePreview || null,
    };
    dispatch(addMessage({ room: roomName, message: userMessage }));

    setInput("");
    setImageFile(null);
    setImagePreview(null);

    setIsTyping(true);
    setTimeout(() => {
      const aiMessage = {
        text: "This is Gemini's simulated reply 🤖",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      dispatch(addMessage({ room: roomName, message: aiMessage }));
      setIsTyping(false);
    }, 2000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current.scrollTop === 0 && !loadingOlder) {
      setLoadingOlder(true);
      const scrollHeightBefore = scrollContainerRef.current.scrollHeight;

      const olderMessages = Array.from({ length: 10 }, (_, i) => ({
        text: `Older dummy message ${i + 1}`,
        sender: i % 2 === 0 ? "ai" : "user",
        timestamp: new Date(Date.now() - (messages.length + 10 - i) * 60000).toISOString(),
      }));

      dispatch(prependMessages({ room: roomName, messages: olderMessages }));

      setTimeout(() => {
        const scrollHeightAfter = scrollContainerRef.current.scrollHeight;
        scrollContainerRef.current.scrollTop = scrollHeightAfter - scrollHeightBefore;
        setLoadingOlder(false);
      }, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-lg border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{roomName}</h2>
            </div>
            <button onClick={onBack} className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all duration-200 hover:scale-105">
              ← Back
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white dark:bg-gray-800 shadow-lg">
          <div className="h-96 md:h-[500px] lg:h-[600px] overflow-y-auto p-6 space-y-4 scroll-smooth"
               ref={scrollContainerRef} onScroll={handleScroll}
               style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #F7FAFC' }}>
            {loadingOlder && (
              <div className="flex justify-center py-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-2"></div>
                Loading older messages...
              </div>
            )}
            {messages.map((msg, idx) => (
              <Message key={idx + msg.timestamp} {...msg} />
            ))}
            {isTyping && (
              <div className="flex items-start space-x-3 animate-fadeIn">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 max-w-xs">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-lg border-t border-gray-200 dark:border-gray-700 p-6">
          {imagePreview && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-start space-x-3">
              <img src={imagePreview} alt="Preview" className="max-h-24 w-auto rounded-lg border-2 border-gray-200 dark:border-gray-600 shadow-sm object-contain"/>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image Preview</p>
                <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type a message... (Shift+Enter for new line)"
              rows="1"
              className="flex-1 w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <div className="flex items-center gap-2">
              <label className="relative cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl border border-gray-300 dark:border-gray-600 transition-all duration-200 hover:scale-105">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              </label>
              <button onClick={handleSend} disabled={!input.trim() && !imagePreview} className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl shadow-lg disabled:shadow-none transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
