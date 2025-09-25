'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  Sparkles, 
  Brain, 
  Code, 
  Palette, 
  BarChart3, 
  Calculator, 
  Search,
  Settings,
  Zap,
  Shield,
  Clock,
  Cpu
} from 'lucide-react';
import { JobFlixLogoHeader } from '../components/JobFlixLogo';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  metadata?: {
    provider?: string;
    model?: string;
    taskType?: string;
    responseTime?: number;
    tokensUsed?: number;
    confidence?: number;
    safetyScore?: number;
  };
}

type TaskType = 'general' | 'code' | 'creative' | 'analysis' | 'math' | 'research';
type LLMProvider = 'openai-gpt4' | 'openai-gpt3.5' | 'anthropic-claude' | 'google-gemini' | 'auto';

const AssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your enhanced AI assistant powered by multiple LLMs. I can help with coding, creative writing, analysis, math, research, and general questions. What would you like to explore today?",
      sender: 'assistant',
      timestamp: new Date(),
      metadata: {
        provider: 'system',
        taskType: 'general',
        confidence: 1.0,
        safetyScore: 1.0
      }
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType>('general');
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider>('auto');
  const [showSettings, setShowSettings] = useState(false);
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch available providers on component mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/enhanced-assistant');
        if (response.ok) {
          const data = await response.json();
          setAvailableProviders(data.availableProviders || []);
        }
      } catch (error) {
        console.warn('Could not fetch available providers:', error);
      }
    };
    fetchProviders();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input.trim();

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Show typing indicator
    setIsTyping(true);

    try {
      // Call the enhanced API endpoint
      const requestBody = {
        message: userInput,
        taskType: selectedTaskType !== 'general' ? selectedTaskType : undefined,
        preferredProvider: selectedProvider !== 'auto' ? selectedProvider : undefined,
        maxTokens: 1000,
        temperature: 0.7
      };

      const response = await fetch('/api/enhanced-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Add assistant response with metadata
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'assistant',
        timestamp: new Date(),
        metadata: data.metadata
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      
      // Try fallback to test assistant
      try {
        const fallbackResponse = await fetch('/api/test-assistant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userInput }),
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: fallbackData.response,
            sender: 'assistant',
            timestamp: new Date(),
            metadata: fallbackData.metadata
          };
          setMessages(prev => [...prev, assistantMessage]);
        } else {
          throw error;
        }
      } catch (fallbackError) {
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: error instanceof Error ? error.message : "I'm sorry, I encountered an error. Please try again.",
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  // Task type icons and labels
  const taskTypeConfig = {
    general: { icon: Brain, label: 'General', color: 'text-blue-600' },
    code: { icon: Code, label: 'Code', color: 'text-green-600' },
    creative: { icon: Palette, label: 'Creative', color: 'text-purple-600' },
    analysis: { icon: BarChart3, label: 'Analysis', color: 'text-orange-600' },
    math: { icon: Calculator, label: 'Math', color: 'text-red-600' },
    research: { icon: Search, label: 'Research', color: 'text-indigo-600' }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai-gpt4':
      case 'openai-gpt3.5':
        return '🤖';
      case 'anthropic-claude':
        return '🧠';
      case 'google-gemini':
        return '💎';
      case 'system':
        return '⚡';
      default:
        return '🔮';
    }
  };

  return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Enhanced AI Assistant</h1>
              </div>
              <p className="text-default-600 max-w-2xl mx-auto">
                Powered by multiple LLMs including GPT-4, Claude, and Gemini. 
                Get intelligent responses for coding, creative writing, analysis, and more.
              </p>
              
              {/* Quick Stats */}
              <div className="flex items-center justify-center gap-6 text-sm text-default-500">
                <div className="flex items-center gap-1">
                  <Cpu size={16} />
                  <span>{availableProviders.length} LLMs Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={16} />
                  <span>Content Safety Enabled</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={16} />
                  <span>Real-time Responses</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Chat Interface */}
          <div className="bg-content1 rounded-2xl shadow-lg border border-default-200 overflow-hidden">
            {/* Chat Header with Controls */}
            <div className="bg-content2 border-b border-default-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-foreground">Chat Session</h2>
                  <div className="flex items-center gap-2">
                    {Object.entries(taskTypeConfig).map(([type, config]) => {
                      const IconComponent = config.icon;
                      return (
                        <button
                          key={type}
                          onClick={() => setSelectedTaskType(type as TaskType)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedTaskType === type
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-content3 text-default-600 hover:bg-content4'
                          }`}
                        >
                          <IconComponent size={14} />
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-lg bg-content3 hover:bg-content4 transition-colors"
                >
                  <Settings size={16} className="text-default-600" />
                </button>
              </div>

              {/* Settings Panel */}
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-content3 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Preferred LLM Provider
                      </label>
                      <select
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value as LLMProvider)}
                        className="w-full p-2 rounded-lg bg-content1 border border-default-200 text-foreground"
                      >
                        <option value="auto">Auto-Select Best</option>
                        <option value="openai-gpt4">GPT-4 (Best Quality)</option>
                        <option value="openai-gpt3.5">GPT-3.5 (Fast)</option>
                        <option value="anthropic-claude">Claude (Analysis)</option>
                        <option value="google-gemini">Gemini (Multimodal)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Available Providers
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {availableProviders.map((provider) => (
                          <span
                            key={provider}
                            className="px-2 py-1 text-xs bg-success/10 text-success rounded-md"
                          >
                            {getProviderIcon(provider)} {provider}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
      </div>

      {/* Messages Container */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                      className={`max-w-[80%] rounded-xl p-4 ${
                  message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-content2 text-foreground border border-default-200'
                      }`}
                    >
                      <div className="space-y-2">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Message metadata */}
                        <div className="flex items-center justify-between text-xs opacity-70">
                          <div className="flex items-center gap-2">
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            {message.metadata?.provider && (
                              <span className="flex items-center gap-1">
                                <span>{getProviderIcon(message.metadata.provider)}</span>
                                <span>{message.metadata.provider}</span>
                              </span>
                            )}
                            {message.metadata?.taskType && (
                              <span className="px-1.5 py-0.5 bg-default-100 rounded text-default-600">
                                {message.metadata.taskType}
                              </span>
                            )}
                          </div>
                          
                          {message.metadata && (
                            <div className="flex items-center gap-2">
                              {message.metadata.responseTime && (
                                <span className="flex items-center gap-1">
                                  <Clock size={10} />
                                  {message.metadata.responseTime}ms
                                </span>
                              )}
                              {message.metadata.confidence && (
                                <span className="flex items-center gap-1">
                                  <Brain size={10} />
                                  {Math.round(message.metadata.confidence * 100)}%
                                </span>
                              )}
                              {message.metadata.safetyScore && (
                                <span className="flex items-center gap-1">
                                  <Shield size={10} />
                                  {Math.round(message.metadata.safetyScore * 100)}%
                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
              </div>
            </motion.div>
          ))}

                {/* Enhanced Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
                    <div className="bg-content2 border border-default-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-primary animate-pulse" />
                          <span className="text-sm text-default-600">AI is thinking...</span>
                        </div>
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                              className="w-2 h-2 bg-primary rounded-full"
                        animate={{
                                y: [0, -6, 0],
                                opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                                duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

            {/* Enhanced Input Form */}
            <div className="border-t border-default-200 p-4">
              <form onSubmit={handleSendMessage} className="space-y-3">
                {/* Quick Actions */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-default-500">Quick actions:</span>
                  <button
                    type="button"
                    onClick={() => setInput("Write a Python function to")}
                    className="px-2 py-1 bg-content3 hover:bg-content4 rounded text-default-600 transition-colors"
                  >
                    Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setInput("Explain the concept of")}
                    className="px-2 py-1 bg-content3 hover:bg-content4 rounded text-default-600 transition-colors"
                  >
                    Explain
                  </button>
                  <button
                    type="button"
                    onClick={() => setInput("Analyze the pros and cons of")}
                    className="px-2 py-1 bg-content3 hover:bg-content4 rounded text-default-600 transition-colors"
                  >
                    Analyze
                  </button>
                  <button
                    type="button"
                    onClick={() => setInput("Write a creative story about")}
                    className="px-2 py-1 bg-content3 hover:bg-content4 rounded text-default-600 transition-colors"
                  >
                    Create
                  </button>
                </div>

                {/* Input Field */}
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything... I can help with coding, creative writing, analysis, math, research, and more!"
                      className="w-full p-3 rounded-xl border border-default-200 bg-content1 text-foreground placeholder-default-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      rows={input.split('\n').length || 1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                  </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
                    className="p-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
                    <Send size={16} />
                    {isTyping ? 'Thinking...' : 'Send'}
          </button>
        </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between text-xs text-default-500">
                  <div className="flex items-center gap-4">
                    <span>Mode: {taskTypeConfig[selectedTaskType].label}</span>
                    <span>Provider: {selectedProvider === 'auto' ? 'Auto-Select' : selectedProvider}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{input.length}/2000</span>
                    <span>•</span>
                    <span>Press Shift+Enter for new line</span>
                  </div>
        </div>
      </form>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AssistantPage; 