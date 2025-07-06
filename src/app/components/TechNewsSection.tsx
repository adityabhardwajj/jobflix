"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  Bookmark, 
  Share2,
  ExternalLink,
  Calendar,
  User,
  Tag
} from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  trending: boolean;
}

const mockNews: NewsItem[] = [
  {
    id: 1,
    title: "The Future of AI in Software Development: What Developers Need to Know",
    excerpt: "Artificial Intelligence is revolutionizing how we write, test, and deploy code. From automated testing to intelligent code completion, AI tools are becoming essential for modern developers.",
    author: "Sarah Chen",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "AI/ML",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
    trending: true
  },
  {
    id: 2,
    title: "React 19: New Features and Breaking Changes You Should Know",
    excerpt: "React 19 brings exciting new features including concurrent rendering improvements, better error boundaries, and enhanced developer experience tools.",
    author: "Mike Johnson",
    date: "2024-01-14",
    readTime: "8 min read",
    category: "Frontend",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    trending: true
  },
  {
    id: 3,
    title: "Microservices vs Monoliths: Making the Right Architecture Choice",
    excerpt: "Choosing between microservices and monolithic architecture can make or break your project. Learn the pros, cons, and when to use each approach.",
    author: "Alex Rodriguez",
    date: "2024-01-13",
    readTime: "6 min read",
    category: "Backend",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop",
    trending: false
  },
  {
    id: 4,
    title: "The Rise of WebAssembly: Performance and Possibilities",
    excerpt: "WebAssembly is changing the web development landscape, enabling near-native performance in browsers and opening new possibilities for web applications.",
    author: "Emma Wilson",
    date: "2024-01-12",
    readTime: "7 min read",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
    trending: false
  }
];

const categories = [
  { id: 'all', name: 'All', color: 'bg-gray-500' },
  { id: 'ai', name: 'AI/ML', color: 'bg-purple-500' },
  { id: 'frontend', name: 'Frontend', color: 'bg-blue-500' },
  { id: 'backend', name: 'Backend', color: 'bg-green-500' },
  { id: 'web', name: 'Web Dev', color: 'bg-orange-500' }
];

export default function TechNewsSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedArticles, setSavedArticles] = useState<number[]>([]);

  const filteredNews = selectedCategory === 'all' 
    ? mockNews 
    : mockNews.filter(news => news.category.toLowerCase().includes(selectedCategory));

  const handleSaveArticle = (articleId: number) => {
    setSavedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.name.toLowerCase().includes(category.toLowerCase()));
    return cat?.color || 'bg-gray-500';
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Tech News
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest trends, technologies, and insights from the tech world
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? `${category.color} text-white shadow-lg`
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredNews.map((news, index) => (
            <motion.article
              key={news.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(news.category)}`}>
                    <Tag className="w-3 h-3 mr-1" />
                    {news.category}
                  </span>
                </div>

                {/* Trending Badge */}
                {news.trending && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </span>
                  </div>
                )}

                {/* Save Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSaveArticle(news.id)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200"
                >
                  <Bookmark 
                    className={`w-4 h-4 ${
                      savedArticles.includes(news.id) 
                        ? 'fill-white text-white' 
                        : 'text-white'
                    }`} 
                  />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  {news.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {news.excerpt}
                </p>

                {/* Meta Information */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{news.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(news.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{news.readTime}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </motion.button>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
} 