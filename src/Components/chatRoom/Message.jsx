import React, { useState } from "react";

/**
 * Message Component
 *
 * Renders a single chat message with optional text and image.
 * Features:
 *  - Aligns left (for others) or right (for the user) based on sender
 *  - Displays message timestamp in HH:MM format
 *  - Shows a "Copy" button on hover for text messages
 *  - Supports displaying images alongside text
 */
export default function Message({ text, sender, timestamp, image }) {
  // Format timestamp into a readable time string
  const displayTime = new Date(timestamp).toLocaleTimeString([], { 
    hour: "2-digit", 
    minute: "2-digit" 
  });

  const [hover, setHover] = useState(false);

  /**
   * Copies message text to clipboard when user clicks "Copy"
   */
  const handleCopy = () => {
    if (text) navigator.clipboard.writeText(text);
  };

  return (
    <div className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-3 py-2 rounded-lg max-w-xs break-words relative ${
          sender === "user"
            ? "bg-blue-600 text-white" // User messages (right aligned)
            : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white" // Other messages (left aligned)
        }`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Render text message */}
        {text && <p>{text}</p>}

        {/* Render image if provided */}
        {image && (
          <img
            src={image}
            alt="chat"
            className="mt-1 max-h-48 rounded-lg border"
          />
        )}

        {/* Copy-to-clipboard button (visible on hover only) */}
        {hover && text && (
          <button
            onClick={handleCopy}
            className="absolute top-1 right-1 text-xs px-1 py-0.5 bg-gray-400 dark:bg-gray-600 text-white rounded hover:bg-gray-500"
          >
            Copy
          </button>
        )}

        {/* Timestamp shown below message */}
        <div className="text-xs text-gray-500 mt-1 text-right">
          {displayTime}
        </div>
      </div>
    </div>
  );
}
