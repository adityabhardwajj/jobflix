'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function About() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hi! I'm Aditya, your Jobflix assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      let response = "I'm not sure about that. Could you please rephrase your question?";
      
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('who built') || lowerInput.includes('who created')) {
        response = "I was built by Aditya Bhardwaj, a full-stack developer passionate about creating helpful tools for the tech community.";
      } else if (lowerInput.includes('how can i find jobs') || lowerInput.includes('find work')) {
        response = "Click on the Jobs tab above to browse available positions. You can filter by role, location, and job type. When you find a job you like, just click 'Apply Now'!";
      } else if (lowerInput.includes('project idea') || lowerInput.includes('post project')) {
        response = "Yes! Head to the Project Ideas section where you can anonymously share your ideas and chat with other developers about them.";
      } else if (lowerInput.includes('tech news') || lowerInput.includes('latest news')) {
        response = "Check out the Tech News section for the latest updates in the tech industry, including new technologies, company announcements, and industry trends.";
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Talk to Aditya – Your Jobflix Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Ask me anything about this platform or how to get started!
          </p>
        </motion.div>

        {/* Chat Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Messages */}
          <div 
            className="max-h-[70vh] overflow-y-auto p-6 space-y-4"
            role="log"
            aria-label="Chat messages"
          >
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!message.isUser && (
                      <div 
                        className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2"
                        role="img"
                        aria-label="Aditya's avatar"
                      >
                        <Bot className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        message.isUser
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
                      }`}
                      role="article"
                      aria-label={message.isUser ? "Your message" : "Aditya's message"}
                    >
                      <p className="text-sm sm:text-base">{message.text}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Jobflix..."
                className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Message input"
                role="textbox"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition-colors"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 