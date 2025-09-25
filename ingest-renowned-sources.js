#!/usr/bin/env node

/**
 * Enhanced News Ingestion Script
 * Pulls from all renowned tech news sources including TechCrunch, The Verge, Wired, etc.
 */

const fetch = require('node-fetch');

const RENOWNED_SOURCES = [
    'TechCrunch', 'The Verge', 'Wired', 'Ars Technica',
    'VentureBeat', 'MIT Technology Review', 'TechRadar',
    'ZDNet', 'Mashable', 'Fast Company', 'IEEE Spectrum',
    'NewsAPI', 'Dev.to', 'Hacker News'
];

async function ingestFromRenownedSources() {
    console.log('🚀 Starting enhanced news ingestion from renowned sources...');
    console.log(`📰 Sources: ${RENOWNED_SOURCES.join(', ')}`);
    
    try {
        // Trigger the enhanced backend news ingestion
        console.log('🔄 Triggering enhanced news aggregation...');
        const response = await fetch('http://localhost:8000/api/v1/news/ingest-enhanced', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                max_articles: 300  // Increased for comprehensive coverage
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        console.log('✅ Enhanced news ingestion completed successfully!');
        console.log('📊 Results Summary:');
        console.log(`   • Sources processed: ${result.data?.sources_processed || 'N/A'}`);
        console.log(`   • Total articles found: ${result.data?.total_articles_found || 'N/A'}`);
        console.log(`   • Unique articles: ${result.data?.unique_articles || 'N/A'}`);
        console.log(`   • Saved to database: ${result.data?.saved_to_db || 'N/A'}`);
        console.log(`   • Updated in database: ${result.data?.updated_in_db || 'N/A'}`);
        
        if (result.data?.source_breakdown) {
            console.log('📈 Source Breakdown:');
            Object.entries(result.data.source_breakdown).forEach(([source, count]) => {
                console.log(`   • ${source}: ${count} articles`);
            });
        }
        
        // Get updated stats
        console.log('\n📊 Fetching updated news statistics...');
        const statsResponse = await fetch('http://localhost:8000/api/v1/news/stats');
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            console.log('📈 Current Database Stats:');
            console.log(`   • Total articles: ${stats.total_articles}`);
            console.log(`   • Recent articles (24h): ${stats.recent_articles_24h}`);
            console.log(`   • Featured articles: ${stats.featured_articles}`);
            console.log(`   • Active sources: ${stats.active_sources}`);
            
            if (stats.sources_breakdown) {
                console.log('🏆 Top Sources:');
                Object.entries(stats.sources_breakdown)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .forEach(([source, count]) => {
                        console.log(`   • ${source}: ${count} articles`);
                    });
            }
        }
        
        // Test the frontend API
        console.log('\n🌐 Testing frontend integration...');
        const frontendResponse = await fetch('http://localhost:3000/api/news/ingest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (frontendResponse.ok) {
            const frontendResult = await frontendResponse.json();
            console.log('✅ Frontend integration test successful');
        } else {
            console.log('⚠️  Frontend integration test failed (this is optional)');
        }
        
        console.log('\n🎉 All done! Your tech news feed is now populated with content from renowned sources.');
        console.log('🌐 Visit http://localhost:3000/tech-news to see the live news feed!');

    } catch (error) {
        console.error('❌ Error during enhanced news ingestion:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   • Make sure the backend server is running: cd backend && python -m uvicorn main:app --reload --port 8000');
        console.log('   • Make sure the frontend server is running: npm run dev');
        console.log('   • Check if the database is properly configured');
        console.log('   • For NewsAPI integration, set NEWS_API_KEY environment variable');
        
        // Try fallback to basic ingestion
        console.log('\n🔄 Attempting fallback to basic ingestion...');
        try {
            const fallbackResponse = await fetch('http://localhost:8000/api/v1/blog/ingest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sources: ['devto', 'hackernews'],
                    max_articles: 50
                })
            });
            
            if (fallbackResponse.ok) {
                const fallbackResult = await fallbackResponse.json();
                console.log('✅ Fallback ingestion successful:', fallbackResult);
            } else {
                console.log('❌ Fallback ingestion also failed');
            }
        } catch (fallbackError) {
            console.log('❌ Fallback ingestion error:', fallbackError.message);
        }
    }
}

async function showAvailableSources() {
    console.log('\n📋 Checking available news sources...');
    try {
        const response = await fetch('http://localhost:8000/api/v1/news/sources');
        if (response.ok) {
            const sources = await response.json();
            console.log('📰 Configured Sources:');
            
            if (sources.rss_feeds) {
                console.log('\n🔗 RSS Feeds:');
                sources.rss_feeds.forEach(source => {
                    console.log(`   • ${source.name} (${source.category})`);
                });
            }
            
            if (sources.api_sources) {
                console.log('\n🔌 API Sources:');
                sources.api_sources.forEach(source => {
                    console.log(`   • ${source.name} (${source.type})`);
                });
            }
            
            console.log(`\n📊 Total Sources: ${sources.total_sources}`);
            console.log(`🔄 Update Frequency: ${sources.update_frequency}`);
        }
    } catch (error) {
        console.log('⚠️  Could not fetch source information:', error.message);
    }
}

// Main execution
async function main() {
    console.log('🎭 JobFlix Enhanced News Aggregator');
    console.log('=====================================');
    
    await showAvailableSources();
    await ingestFromRenownedSources();
}

// Run the script
main().catch(console.error);
