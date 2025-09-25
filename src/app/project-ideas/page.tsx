'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  X, 
  Lightbulb, 
  MessageCircle, 
  Users, 
  Sparkles, 
  Code, 
  Rocket, 
  Heart,
  Share2,
  Clock,
  TrendingUp,
  Zap
} from 'lucide-react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Chip,
  Avatar,
  Badge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider
} from '@heroui/react';
import { SparklesCore } from '@/components/ui/sparkles';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import { useToastHelpers } from '../components/Toast';

interface ProjectIdea {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  techStack: string[];
  likes: number;
  comments: number;
  timestamp: string;
  author: string;
}

interface ChatMessage {
  id: number;
  text: string;
  timestamp: string;
  author: string;
}

const ProjectIdeas = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  const [projectDifficulty, setProjectDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [projectTechStack, setProjectTechStack] = useState<string[]>([]);
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newTech, setNewTech] = useState('');
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isChatOpen, onOpen: onChatOpen, onClose: onChatClose } = useDisclosure();
  const toast = useToastHelpers();

  // Categories and tech stacks
  const categories = ['All', 'Web Development', 'Mobile App', 'AI/ML', 'Blockchain', 'IoT', 'Game Development', 'DevOps', 'Data Science'];
  const popularTechStacks = ['React', 'Node.js', 'Python', 'TypeScript', 'Next.js', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Firebase'];

  // Mock data for initial project ideas
  useEffect(() => {
    setProjectIdeas([
      {
        id: 1,
        title: "AI-Powered Code Review Assistant",
        description: "A platform that uses machine learning to automatically review code, suggest improvements, and detect potential bugs. It integrates with popular version control systems and provides detailed feedback to developers.",
        category: "AI/ML",
        difficulty: "Advanced",
        techStack: ["Python", "TensorFlow", "React", "Node.js", "PostgreSQL"],
        likes: 42,
        comments: 8,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        author: "Anonymous Developer"
      },
      {
        id: 2,
        title: "Local Artist Gallery Marketplace",
        description: "A platform connecting local artists with galleries and art enthusiasts. Features include virtual gallery tours, artist portfolios, commission tracking, and integrated payment processing.",
        category: "Web Development",
        difficulty: "Intermediate",
        techStack: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
        likes: 28,
        comments: 12,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        author: "Creative Coder"
      },
      {
        id: 3,
        title: "Smart Recipe Generator",
        description: "An AI-powered mobile app that generates personalized recipes based on available ingredients, dietary restrictions, and nutritional goals. Includes meal planning and grocery list features.",
        category: "Mobile App",
        difficulty: "Intermediate",
        techStack: ["React Native", "Python", "Firebase", "TensorFlow"],
        likes: 35,
        comments: 6,
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        author: "Food Tech Enthusiast"
      },
      {
        id: 4,
        title: "Decentralized Learning Platform",
        description: "A blockchain-based educational platform where learners earn tokens for completing courses and can use them to access premium content. Instructors are rewarded based on student success rates.",
        category: "Blockchain",
        difficulty: "Advanced",
        techStack: ["Solidity", "React", "Web3.js", "IPFS", "Node.js"],
        likes: 19,
        comments: 15,
        timestamp: new Date(Date.now() - 345600000).toISOString(),
        author: "Blockchain Builder"
      },
      {
        id: 5,
        title: "IoT Home Garden Monitor",
        description: "A smart gardening system that monitors soil moisture, light levels, and plant health using IoT sensors. Includes automated watering and a mobile app for remote monitoring.",
        category: "IoT",
        difficulty: "Beginner",
        techStack: ["Arduino", "React Native", "Firebase", "Python"],
        likes: 31,
        comments: 4,
        timestamp: new Date(Date.now() - 432000000).toISOString(),
        author: "Green Tech Maker"
      }
    ]);
  }, []);

  // Helper functions
  const addTechStack = () => {
    if (newTech.trim() && !projectTechStack.includes(newTech.trim())) {
      setProjectTechStack([...projectTechStack, newTech.trim()]);
      setNewTech('');
    }
  };

  const removeTechStack = (tech: string) => {
    setProjectTechStack(projectTechStack.filter(t => t !== tech));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectTitle.trim() && projectDescription.trim()) {
      const newIdea: ProjectIdea = {
        id: Date.now(),
        title: projectTitle,
        description: projectDescription,
        category: projectCategory || 'Web Development',
        difficulty: projectDifficulty,
        techStack: projectTechStack,
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
        author: 'Anonymous'
      };
      setProjectIdeas([newIdea, ...projectIdeas]);
      toast.success(`🎉 "${projectTitle}" has been shared successfully!`);
      
      // Reset form
      setProjectTitle('');
      setProjectDescription('');
      setProjectCategory('');
      setProjectDifficulty('Beginner');
      setProjectTechStack([]);
      onClose();
    } else {
      toast.warning('⚠️ Please fill in all required fields');
    }
  };

  const handleOpenChat = (projectId: number) => {
    setSelectedProjectId(projectId);
    onChatOpen();
    // Mock chat messages
    setChatMessages([
      {
        id: 1,
        text: "This is a great idea! Have you thought about the implementation details?",
        timestamp: new Date().toISOString(),
        author: "Developer_42"
      },
      {
        id: 2,
        text: "I'd love to collaborate on this. What's the timeline?",
        timestamp: new Date().toISOString(),
        author: "CodeNinja"
      }
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now(),
        text: newMessage,
        timestamp: new Date().toISOString(),
        author: 'You'
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const handleLike = (id: number) => {
    setProjectIdeas(projectIdeas.map(idea => 
      idea.id === id ? { ...idea, likes: idea.likes + 1 } : idea
    ));
    
    // Show success feedback
    const idea = projectIdeas.find(p => p.id === id);
    if (idea) {
      toast.success(`❤️ Liked "${idea.title}"`);
    }
  };

  const handleShare = async (id: number) => {
    const idea = projectIdeas.find(p => p.id === id);
    if (!idea) return;

    const shareData = {
      title: `Check out this project idea: ${idea.title}`,
      text: idea.description,
      url: `${window.location.origin}/project-ideas?id=${id}`
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('🚀 Project idea shared successfully!');
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(
          `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
        );
        toast.success('📋 Project idea copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('❌ Failed to share project idea');
    }
  };

  const handleCollaborate = (id: number) => {
    const idea = projectIdeas.find(p => p.id === id);
    if (!idea) return;

    // Update comments count to show engagement
    setProjectIdeas(projectIdeas.map(p => 
      p.id === id ? { ...p, comments: p.comments + 1 } : p
    ));

    // Open chat for collaboration
    handleOpenChat(id);
    toast.success(`🤝 Joined collaboration for "${idea.title}"`);
    
    // Add a collaboration message
    setTimeout(() => {
      const collaborationMessage: ChatMessage = {
        id: Date.now(),
        text: `I'm interested in collaborating on "${idea.title}". Let's discuss how we can work together!`,
        timestamp: new Date().toISOString(),
        author: 'You'
      };
      setChatMessages(prev => [...prev, collaborationMessage]);
    }, 500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'danger';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Web Development': return <Code className="w-4 h-4" />;
      case 'Mobile App': return <Rocket className="w-4 h-4" />;
      case 'AI/ML': return <Zap className="w-4 h-4" />;
      case 'Blockchain': return <TrendingUp className="w-4 h-4" />;
      case 'IoT': return <Sparkles className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const filteredIdeas = selectedCategory === 'All' 
    ? projectIdeas 
    : projectIdeas.filter(idea => idea.category === selectedCategory);

  // Typewriter effect words
  const typewriterWords = [
    { text: "Share" },
    { text: "Your" },
    { text: "Next" },
    { text: "Big", className: "text-primary" },
    { text: "Idea" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden py-20">
        {/* Sparkles Background */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-background via-content1/30 to-background">
          <SparklesCore
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={80}
            className="w-full h-full"
            particleColor="hsl(var(--heroui-primary))"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <TypewriterEffectSmooth words={typewriterWords} />
            <p className="text-xl text-default-600 max-w-2xl mx-auto">
              Connect with fellow developers, share innovative project concepts, and collaborate on the next big thing in tech.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Button
                color="primary"
                size="lg"
                startContent={<Lightbulb className="w-5 h-5" />}
                onPress={onOpen}
                className="font-semibold px-8"
              >
                Share Your Idea
              </Button>
              <Button
                variant="bordered"
                size="lg"
                startContent={<Users className="w-5 h-5" />}
                className="font-semibold px-8"
                onPress={() => {
                  // Smooth scroll to ideas section
                  const ideasSection = document.querySelector('.grid');
                  if (ideasSection) {
                    ideasSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Browse Ideas
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{projectIdeas.length}</div>
                <div className="text-sm text-default-500">Active Ideas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {projectIdeas.reduce((sum, idea) => sum + idea.likes, 0)}
                </div>
                <div className="text-sm text-default-500">Total Likes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {projectIdeas.reduce((sum, idea) => sum + idea.comments, 0)}
                </div>
                <div className="text-sm text-default-500">Discussions</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Explore by Category</h2>
            <p className="text-default-600">Discover innovative projects across different tech domains</p>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (index * 0.05) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Chip
                  variant={selectedCategory === category ? "solid" : "bordered"}
                  color={selectedCategory === category ? "primary" : "default"}
                  size="lg"
                  className={`cursor-pointer font-medium px-4 py-2 transition-all duration-300 ${
                    selectedCategory === category 
                      ? "shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-primary-600" 
                      : "hover:shadow-md hover:border-primary/50 hover:bg-primary/5"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                  startContent={
                    <div className={`transition-colors duration-300 ${
                      selectedCategory === category ? "text-primary-foreground" : "text-primary"
                    }`}>
                      {getCategoryIcon(category)}
                    </div>
                  }
                >
                  <span className={selectedCategory === category ? "text-primary-foreground" : ""}>
                    {category}
            </span>
                </Chip>
              </motion.div>
            ))}
          </div>
          
          {/* Active Filter Indicator */}
          {selectedCategory !== 'All' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <span className="text-sm text-primary font-medium">
                  Showing {filteredIdeas.length} {selectedCategory} projects
                </span>
                <Button
                  size="sm"
                  variant="light"
                  color="primary"
                  isIconOnly
                  onPress={() => setSelectedCategory('All')}
                  className="w-5 h-5 min-w-5"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Project Ideas Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredIdeas.map((idea, index) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group h-full"
            >
              <Card className="h-[520px] bg-gradient-to-br from-content1 via-content1 to-content2/50 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative flex flex-col">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Category Badge - Floating */}
                <div className="absolute top-4 left-4 z-10">
                  <Chip
                    startContent={getCategoryIcon(idea.category)}
                    variant="solid"
                    color="primary"
                    size="sm"
                    className="bg-primary/90 backdrop-blur-sm text-primary-foreground font-medium shadow-lg max-w-[120px] truncate"
                  >
                    <span className="truncate">{idea.category}</span>
                  </Chip>
                </div>

                {/* Difficulty & Like Badge - Floating */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <Chip
                    size="sm"
                    variant="solid"
                    color={getDifficultyColor(idea.difficulty) as any}
                    className="font-medium shadow-lg backdrop-blur-sm"
                  >
                    {idea.difficulty}
                  </Chip>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge 
                      content={idea.likes} 
                      color="danger" 
                      size="sm"
                      className="bg-gradient-to-r from-pink-500 to-red-500"
                    >
                      <Button
                        isIconOnly
                        variant="solid"
                        color="danger"
                        size="sm"
                        onPress={() => handleLike(idea.id)}
                        className="bg-white/90 text-red-500 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg backdrop-blur-sm"
                      >
                        <Heart className="w-4 h-4" fill={idea.likes > 0 ? "currentColor" : "none"} />
                      </Button>
                    </Badge>
                  </motion.div>
                </div>

                <CardHeader className="pb-3 pt-16 flex-shrink-0">
                  <div className="w-full">
                    <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 min-h-[3.5rem]">
                      {idea.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-default-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="truncate">{new Date(idea.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="w-1 h-1 bg-default-400 rounded-full flex-shrink-0" />
                      <div className="flex items-center gap-1 min-w-0">
                        <Users className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{idea.author}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="pt-0 pb-6 flex-1 flex flex-col">
                  <p className="text-default-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-shrink-0 min-h-[4.5rem]">
                    {idea.description}
                  </p>
                  
                  {/* Tech Stack with improved styling */}
                  <div className="mb-4 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-3 h-3 text-default-500" />
                      <span className="text-xs font-medium text-default-600">Tech Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
                      {idea.techStack.slice(0, 3).map((tech, techIndex) => (
                        <motion.div
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (index * 0.1) + (techIndex * 0.05) }}
                        >
                          <Chip 
                            size="sm" 
                            variant="flat" 
                            color="secondary"
                            className="bg-secondary/10 text-secondary-600 hover:bg-secondary/20 transition-colors duration-200 font-medium max-w-[80px] truncate"
                          >
                            <span className="truncate">{tech}</span>
                          </Chip>
                        </motion.div>
                      ))}
                      {idea.techStack.length > 3 && (
                        <Chip 
                          size="sm" 
                          variant="flat" 
                          color="default"
                          className="bg-default-100 text-default-600 font-medium"
                        >
                          +{idea.techStack.length - 3}
                        </Chip>
                      )}
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-default-50 rounded-lg flex-shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500" />
                        <span className="text-xs font-medium text-default-700">{idea.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-blue-500" />
                        <span className="text-xs font-medium text-default-700">{idea.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs font-medium text-default-700">Hot</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      startContent={<MessageCircle className="w-3 h-3" />}
                      onPress={() => handleOpenChat(idea.id)}
                      className="flex-1 font-medium hover:scale-105 transition-transform duration-200"
                    >
                      Chat
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      color="default"
                      startContent={<Share2 className="w-3 h-3" />}
                      onPress={() => handleShare(idea.id)}
                      className="font-medium hover:scale-105 transition-transform duration-200"
                    >
                      Share
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      color="secondary"
                      startContent={<Rocket className="w-3 h-3" />}
                      onPress={() => handleCollaborate(idea.id)}
                      className="font-medium hover:scale-105 transition-transform duration-200"
                    >
                      Join
                    </Button>
              </div>
                </CardBody>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-lg transition-colors duration-500" />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredIdeas.length === 0 && (
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl" />
              </div>
              <div className="relative">
              <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Lightbulb className="w-20 h-20 text-primary mx-auto" />
                </motion.div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-foreground mb-3">
              No {selectedCategory !== 'All' ? selectedCategory : ''} ideas yet
            </h3>
            <p className="text-default-600 mb-8 max-w-md mx-auto leading-relaxed">
              {selectedCategory !== 'All' 
                ? `Be the pioneer in ${selectedCategory}! Share your innovative concept and inspire others.`
                : 'Be the first to share an innovative project idea and start building the future!'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                color="primary"
                size="lg"
                startContent={<Lightbulb className="w-5 h-5" />}
                onPress={onOpen}
                className="font-semibold px-8 shadow-lg shadow-primary/25"
              >
                Share Your Idea
              </Button>
              {selectedCategory !== 'All' && (
                <Button
                  variant="bordered"
                  size="lg"
                  startContent={<X className="w-5 h-5" />}
                  onPress={() => setSelectedCategory('All')}
                  className="font-semibold px-8"
                >
                  View All Categories
                </Button>
              )}
            </div>
            
            {/* Suggestion Cards */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {['💡 Share Ideas', '🤝 Collaborate', '🚀 Build Together'].map((suggestion, index) => (
                <motion.div
                  key={suggestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                  className="p-4 bg-gradient-to-br from-content1 to-content2/50 rounded-lg border border-divider"
                >
                  <p className="text-sm font-medium text-default-700">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Create Idea Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Share Your Project Idea
              </div>
              <p className="text-sm text-default-500 font-normal">
                Help others discover your innovative concept
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Project Title"
                  placeholder="Enter a catchy title for your project"
                  value={projectTitle}
                  onValueChange={setProjectTitle}
                  isRequired
                />
                
                <Textarea
                  label="Description"
                  placeholder="Describe your project idea in detail..."
                  value={projectDescription}
                  onValueChange={setProjectDescription}
                  minRows={4}
                  maxRows={8}
                  isRequired
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Category"
                    placeholder="e.g., Web Development"
                    value={projectCategory}
                    onValueChange={setProjectCategory}
                  />
                  
                  <div>
                    <label className="text-sm font-medium text-default-700 mb-2 block">
                      Difficulty Level
                    </label>
                    <div className="flex gap-2">
                      {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                        <Chip
                          key={level}
                          variant={projectDifficulty === level ? "solid" : "bordered"}
                          color={projectDifficulty === level ? getDifficultyColor(level) as any : "default"}
                          className="cursor-pointer"
                          onClick={() => setProjectDifficulty(level)}
                        >
                          {level}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="text-sm font-medium text-default-700 mb-2 block">
                    Tech Stack
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add technology (e.g., React, Node.js)"
                      value={newTech}
                      onValueChange={setNewTech}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTechStack();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      color="primary"
                      variant="flat"
                      onPress={addTechStack}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {/* Popular Tech Stack Suggestions */}
                  <div className="mb-2">
                    <p className="text-xs text-default-500 mb-1">Popular technologies:</p>
                    <div className="flex flex-wrap gap-1">
                      {popularTechStacks.map((tech) => (
                        <Chip
                          key={tech}
                          size="sm"
                          variant="flat"
                          className="cursor-pointer"
                          onClick={() => {
                            if (!projectTechStack.includes(tech)) {
                              setProjectTechStack([...projectTechStack, tech]);
                            }
                          }}
                        >
                          {tech}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  {/* Selected Tech Stack */}
                  {projectTechStack.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {projectTechStack.map((tech) => (
                        <Chip
                          key={tech}
                          color="secondary"
                          variant="solid"
                          onClose={() => removeTechStack(tech)}
                        >
                          {tech}
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button 
                color="primary" 
                type="submit"
                startContent={<Rocket className="w-4 h-4" />}
              >
                Share Idea
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Chat Modal */}
      <Modal 
        isOpen={isChatOpen} 
        onClose={onChatClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Project Discussion
            </div>
            <p className="text-sm text-default-500 font-normal">
              Connect with other developers interested in this idea
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4 max-h-96 overflow-y-auto">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                  className={`flex ${message.author === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${message.author === 'You' ? 'order-2' : 'order-1'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar
                        size="sm"
                        name={message.author}
                        className="w-6 h-6 text-xs"
                      />
                      <span className="text-xs text-default-500">{message.author}</span>
                      <span className="text-xs text-default-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <Card className={message.author === 'You' ? 'bg-primary text-primary-foreground' : ''}>
                      <CardBody className="py-2 px-3">
                        <p className="text-sm">{message.text}</p>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
              <Input
                placeholder="Type your message..."
                      value={newMessage}
                onValueChange={setNewMessage}
                className="flex-1"
                    />
              <Button
                      type="submit"
                color="primary"
                isIconOnly
                    >
                <Send className="w-4 h-4" />
              </Button>
                </form>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProjectIdeas; 