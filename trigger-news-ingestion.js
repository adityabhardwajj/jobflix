#!/usr/bin/env node

/**
 * Script to trigger news ingestion from external APIs
 * Run this to populate the database with real tech news
 */

const fetch = require('node-fetch');

async function triggerNewsIngestion() {
  console.log('🚀 Triggering news ingestion...');
  
  try {
    // Trigger the backend news ingestion
    const response = await fetch('http://localhost:8000/api/v1/blog/ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sources: ['newsapi', 'devto', 'hackernews'],
        max_articles: 50
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('✅ News ingestion completed successfully!');
    console.log(`📊 Results:`, result);
    
    // Also trigger the frontend API endpoint
    console.log('🔄 Triggering frontend news ingestion endpoint...');
    const frontendResponse = await fetch('http://localhost:3000/api/news/ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (frontendResponse.ok) {
      const frontendResult = await frontendResponse.json();
      console.log('✅ Frontend ingestion trigger successful:', frontendResult);
    } else {
      console.log('⚠️  Frontend ingestion trigger failed, but backend ingestion was successful');
    }

  } catch (error) {
    console.error('❌ Error triggering news ingestion:', error.message);
    console.log('💡 Make sure the backend server is running on http://localhost:8000');
    console.log('💡 You can start it with: cd backend && python -m uvicorn main:app --reload --port 8000');
  }
}

// Run the script
triggerNewsIngestion();
