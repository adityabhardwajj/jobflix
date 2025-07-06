'use client';

import { useState } from 'react';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = () => {
    // TODO: Implement image generation logic
    console.log('Generating image for prompt:', prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          AI Text to Image Generator
        </h1>
        
        <p className="text-xl text-gray-600">
          Describe anything. See it visualized.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your imagination…"
            className="w-full sm:w-96 px-4 py-3 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <button
            onClick={handleGenerate}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
} 