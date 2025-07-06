'use client';

import { useState } from 'react';
import { X, Send } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'recruiter';
  timestamp: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  recruiterName: string;
  jobTitle: string;
  isOnline: boolean;
}

// Mock messages for demonstration
const mockMessages: Message[] = [
  {
    id: 1,
    text: "Hi! I'm interested in this position. Could you tell me more about the role?",
    sender: 'user',
    timestamp: '10:30 AM'
  },
  {
    id: 2,
    text: "Hello! Of course, I'd be happy to discuss the role. What specific aspects would you like to know about?",
    sender: 'recruiter',
    timestamp: '10:32 AM'
  },
  {
    id: 3,
    text: "I'm particularly interested in the tech stack and team structure.",
    sender: 'user',
    timestamp: '10:33 AM'
  }
];

export default function ChatModal({ isOpen, onClose, recruiterName, jobTitle, isOnline }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">{recruiterName}</h2>
            <span className={`text-sm px-2 py-1 rounded-full ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Job Title */}
        <div className="px-4 py-2 bg-gray-50 border-b">
          <p className="text-sm text-gray-600">{jobTitle}</p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-75 mt-1 block">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 