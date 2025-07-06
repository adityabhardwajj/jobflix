'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const botResponses = {
  greeting: "Hi, I'm Aditya — your AI assistant. How can I help you today?",
  help: "I can help you find jobs, explore tech news, or answer any questions about Jobflix!",
  features: "Jobflix offers AI-powered job matching, real-time tech news, and a modern interface. What would you like to know more about?",
  contact: "You can reach out through the Contact page or chat with me right here!",
  default: "That's an interesting question! Let me help you with that..."
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: botResponses.greeting,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) return botResponses.greeting;
    if (lowerMessage.includes('help')) return botResponses.help;
    if (lowerMessage.includes('feature') || lowerMessage.includes('offer')) return botResponses.features;
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) return botResponses.contact;
    return botResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 perspective-[1000px]">
      <div className="max-w-4xl mx-auto h-screen py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
        {/* 3D Avatar */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
          className="flex justify-center mb-8"
        >
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg transform rotate-x-6 rotate-y-6 group-hover:rotate-x-0 group-hover:rotate-y-0 transition-transform duration-500 ease-in-out relative">
              <Bot className="w-12 h-12 text-white" />
              <div className="absolute inset-0 rounded-full shadow-[0_0_25px_#60a5fa] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <motion.div
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            />
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* 3D Chat Container */}
        <div className="flex-1 bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl shadow-xl overflow-hidden flex flex-col transform hover:scale-[1.01] hover:-rotate-1 transition-all duration-300">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-[80%] px-4 py-2 shadow-lg ${
                      message.sender === 'user'
                        ? 'bg-pink-600 text-white rounded-r-3xl rounded-l-xl'
                        : 'bg-indigo-600 text-white rounded-l-3xl rounded-r-xl'
                    }`}
                  >
                    <p className="text-sm sm:text-base">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-700/50 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                    <div className="flex space-x-2">
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="w-2 h-2 bg-indigo-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-indigo-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-indigo-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-700 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-gray-900 text-white p-4 rounded-xl shadow-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white p-4 rounded-xl shadow-lg hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-300"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 