'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data for tech news
const techNews = [
  {
    id: 1,
    headline: "OpenAI Releases GPT-5 with Enhanced Multimodal Capabilities",
    summary: "The latest iteration of GPT brings unprecedented improvements in image understanding and generation, setting new benchmarks in AI capabilities.",
    category: "AI",
    date: "2024-03-15",
    link: "https://example.com/news/1"
  },
  {
    id: 2,
    headline: "Next.js 15 Introduces Revolutionary Server Components",
    summary: "The latest version of Next.js brings significant performance improvements and new features for server-side rendering.",
    category: "Web",
    date: "2024-03-14",
    link: "https://example.com/news/2"
  },
  {
    id: 3,
    headline: "Docker Announces New Container Security Features",
    summary: "Enhanced security scanning and runtime protection features make Docker containers more secure than ever.",
    category: "DevOps",
    date: "2024-03-13",
    link: "https://example.com/news/3"
  },
  {
    id: 4,
    headline: "Rust 2.0: What's New in the Latest Release",
    summary: "Major improvements in memory safety and performance optimization in the latest Rust release.",
    category: "Programming",
    date: "2024-03-12",
    link: "https://example.com/news/4"
  },
  {
    id: 5,
    headline: "AWS Launches New AI-Powered Cloud Services",
    summary: "Amazon Web Services introduces new machine learning tools for cloud infrastructure management.",
    category: "Cloud",
    date: "2024-03-11",
    link: "https://example.com/news/5"
  },
  {
    id: 6,
    headline: "Meta's New AR Glasses Breakthrough",
    summary: "Revolutionary display technology promises to transform augmented reality experiences.",
    category: "Hardware",
    date: "2024-03-10",
    link: "https://example.com/news/6"
  }
];

// Categories for filtering
const categories = ["All", "AI", "Web", "DevOps", "Programming", "Cloud", "Hardware"];

export default function TechNews() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter news based on selected category
  const filteredNews = selectedCategory === "All" 
    ? techNews 
    : techNews.filter(news => news.category === selectedCategory);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔍 Trending in Tech
          </h1>
          
          {/* Category Filter */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                  ${selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <article
              key={news.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                {/* Category Tag */}
                <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full mb-4">
                  {news.category}
                </span>

                {/* Headline */}
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {news.headline}
                </h2>

                {/* Summary */}
                <p className="text-gray-600 mb-4">
                  {news.summary}
                </p>

                {/* Date and Read More */}
                <div className="flex justify-between items-center">
                  <time className="text-sm text-gray-500">
                    {new Date(news.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <Link
                    href={news.link}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
} 