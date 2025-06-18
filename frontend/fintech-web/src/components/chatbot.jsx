import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import chatbotAnimation from "../assets/chatbot_animation.json";
import userAvatar from "../assets/userchatbot.png";
import botAvatar from "../assets/chatbotavatar.png";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoverPrompt, setHoverPrompt] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setHoverPrompt(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen) {
        setHoverPrompt(true);
        setTimeout(() => setHoverPrompt(false), 4000);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (userMessage.trim() === "") return;

    const newMessages = [...messages, { sender: "user", text: userMessage }];
    setMessages(newMessages);
    setUserMessage("");
    setLoading(true);

    try {
      const response = await fetch("https://chatbot-1etk.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_input: userMessage,
          top_k: 5,
        }),
      });

      const data = await response.json();

      if (response.ok && data.response) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text:
              data?.error ||
              "Hmm, I didn’t quite get that. Try rephrasing it 😊",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Oops! Couldn’t reach the server. Try again later.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div>
      {/* Floating Chat Button */}
      <div
        onClick={toggleChatbot}
        className={`fixed bottom-10 right-10 shadow-xl cursor-pointer transform transition-all hover:scale-105 ${
          hoverPrompt ? "animate-bounce" : ""
        }`}
        style={{
          background: "transparent",
          padding: 0,
          margin: 0,
        }}
      >
        <Lottie
          animationData={chatbotAnimation}
          loop
          autoplay
          style={{
            height: "85px",
            width: "85px",
            display: "block",
            background: "transparent",
          }}
        />
        {hoverPrompt && (
          <div className="absolute right-16 bottom-1/2 translate-y-1/2 bg-white text-gray-800 text-sm shadow-md px-4 py-2 rounded-xl border border-gray-200 animate-fade-in-out">
            How can I help you?
          </div>
        )}
      </div>

      {/* Chatbot Panel */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 w-80 h-[500px] flex flex-col shadow-2xl rounded-xl border border-gray-300 overflow-hidden z-50 bg-gradient-to-br from-[#e6f7f2] to-[#c8f0e4]">
          {/* Header */}
          <div className="flex justify-between items-center bg-gradient-to-br from-[#0a3c4c] to-[#0c5346] text-white p-4">
            <h3 className="font-semibold">FinGURU Assistant</h3>
            <button
              onClick={toggleChatbot}
              className="text-lg leading-tight h-7 w-8 text-white transition-colors"
            >
              X
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2 custom-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <img
                    src={botAvatar}
                    alt="bot"
                    className="w-6 h-6 rounded-full mr-2"
                  />
                )}
                <div
                  className={`px-4 py-2 rounded-lg max-w-[70%] text-sm ${
                    msg.sender === "user"
                      ? "bg-[#0a3c4c] text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <img
                    src={userAvatar}
                    alt="user"
                    className="w-6 h-6 rounded-full ml-2"
                  />
                )}
              </div>
            ))}

            {/* Typing Animation */}
            {loading && (
              <div className="flex items-center space-x-2 mt-2">
                <img
                  src={botAvatar}
                  alt="bot"
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 p-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-[#0a3c4c] bg-gray-100 text-black"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="bg-[#0a3c4c] hover:bg-[#0c5346] text-white px-3 py-2 rounded-lg text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
