'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X } from 'lucide-react';

interface ProjectIdea {
  id: number;
  text: string;
  timestamp: string;
}

interface ChatMessage {
  id: number;
  text: string;
  timestamp: string;
}

const ProjectIdeas = () => {
  const [projectIdea, setProjectIdea] = useState('');
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Mock data for initial project ideas
  useEffect(() => {
    setProjectIdeas([
      {
        id: 1,
        text: "A platform for connecting local artists with art galleries",
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        text: "An AI-powered recipe generator based on available ingredients",
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectIdea.trim()) {
      const newIdea: ProjectIdea = {
        id: Date.now(),
        text: projectIdea,
        timestamp: new Date().toISOString()
      };
      setProjectIdeas([newIdea, ...projectIdeas]);
      setProjectIdea('');
    }
  };

  const handleOpenChat = (projectId: number) => {
    setSelectedProjectId(projectId);
    setIsChatOpen(true);
    // Mock chat messages
    setChatMessages([
      {
        id: 1,
        text: "This is a great idea! Have you thought about the tech stack?",
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        text: "I think we could use React for the frontend and Node.js for the backend",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now(),
        text: newMessage,
        timestamp: new Date().toISOString()
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-gray-900 mb-8"
        >
          Share Your Project Ideas Anonymously
        </motion.h1>

        {/* Project Idea Form */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <textarea
            value={projectIdea}
            onChange={(e) => setProjectIdea(e.target.value)}
            maxLength={500}
            placeholder="Share your project idea here..."
            className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">
              {projectIdea.length}/500 characters
            </span>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:scale-105 transform transition-all duration-200 shadow-md"
            >
              Share Idea
            </button>
          </div>
        </motion.form>

        {/* Project Ideas Feed */}
        <div className="space-y-4">
          {projectIdeas.map((idea) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <p className="text-gray-800 mb-4">{idea.text}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(idea.timestamp).toLocaleString()}
                </span>
                <button
                  onClick={() => handleOpenChat(idea.id)}
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Join Anonymous Chat
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chat Modal */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col"
              >
                {/* Chat Header */}
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-lg font-semibold">Anonymous Chat</h3>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className="flex flex-col space-y-1"
                    >
                      <div className="bg-blue-100 rounded-lg p-3 max-w-[80%] self-start">
                        <p className="text-gray-800">{message.text}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectIdeas; 