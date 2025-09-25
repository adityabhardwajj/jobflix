#!/usr/bin/env node

/**
 * API Keys Setup Helper
 * Helps you configure API keys for the multi-LLM assistant
 */

const fs = require('fs');
const path = require('path');

function setupApiKeys() {
    console.log('🔑 AI Assistant API Keys Setup');
    console.log('==============================\n');

    const envLocalPath = path.join(process.cwd(), '.env.local');
    
    console.log('📋 Current Status:');
    
    // Check if .env.local exists
    if (fs.existsSync(envLocalPath)) {
        console.log('✅ .env.local file exists');
        
        // Read and check for API keys
        const envContent = fs.readFileSync(envLocalPath, 'utf8');
        
        const apiKeys = {
            'OPENAI_API_KEY': {
                name: 'OpenAI (GPT-4, GPT-3.5)',
                required: true,
                url: 'https://platform.openai.com/api-keys'
            },
            'ANTHROPIC_API_KEY': {
                name: 'Anthropic (Claude)',
                required: false,
                url: 'https://console.anthropic.com/'
            },
            'GOOGLE_API_KEY': {
                name: 'Google (Gemini)',
                required: false,
                url: 'https://makersuite.google.com/app/apikey'
            }
        };

        let configuredKeys = 0;
        
        console.log('\n🔍 API Key Status:');
        Object.entries(apiKeys).forEach(([key, config]) => {
            const hasKey = envContent.includes(`${key}=sk-`) || 
                          envContent.includes(`${key}=AIza`) || 
                          envContent.includes(`${key}=sk-ant-`) ||
                          (envContent.includes(`${key}=`) && !envContent.includes(`${key}=your-`));
            
            const status = hasKey ? '✅ CONFIGURED' : (config.required ? '❌ MISSING (REQUIRED)' : '⚪ NOT SET (OPTIONAL)');
            console.log(`   ${config.name}: ${status}`);
            
            if (!hasKey && config.required) {
                console.log(`      🔗 Get your key: ${config.url}`);
            }
            
            if (hasKey) configuredKeys++;
        });

        console.log(`\n📊 Summary: ${configuredKeys}/${Object.keys(apiKeys).length} providers configured`);

    } else {
        console.log('❌ .env.local file not found');
    }

    console.log('\n🚀 Quick Setup Steps:');
    console.log('1. Get OpenAI API Key:');
    console.log('   • Visit: https://platform.openai.com/api-keys');
    console.log('   • Sign in or create account');
    console.log('   • Click "Create new secret key"');
    console.log('   • Copy the key (starts with "sk-")');
    
    console.log('\n2. Add to .env.local:');
    console.log('   • Open .env.local file in your editor');
    console.log('   • Uncomment the OPENAI_API_KEY line');
    console.log('   • Replace "sk-your-openai-key-here" with your actual key');
    console.log('   • Save the file');

    console.log('\n3. Restart Development Server:');
    console.log('   • Stop current server (Ctrl+C)');
    console.log('   • Run: npm run dev');
    console.log('   • Visit: http://localhost:3000/assistant');

    console.log('\n🎯 Expected Results After Setup:');
    console.log('✅ Real AI responses instead of demo messages');
    console.log('✅ GPT-4 and GPT-3.5 available for different tasks');
    console.log('✅ Intelligent routing based on question type');
    console.log('✅ Response metadata showing actual AI provider used');
    console.log('✅ Enhanced capabilities for coding, creative, analysis tasks');

    console.log('\n💡 Pro Tips:');
    console.log('• Start with just OpenAI key for full basic functionality');
    console.log('• Add Anthropic Claude key for better analysis capabilities');
    console.log('• Add Google Gemini key for faster general responses');
    console.log('• Monitor your API usage on provider dashboards');

    console.log('\n🛡️ Security Notes:');
    console.log('• Never commit .env.local to version control');
    console.log('• Keep your API keys private and secure');
    console.log('• Set usage limits on provider dashboards');
    console.log('• Rotate keys periodically for security');

    console.log('\n📞 Need Help?');
    console.log('• Demo mode working: Your assistant is functional without keys');
    console.log('• API key issues: Check format and billing on provider sites');
    console.log('• Still getting demo: Restart server after adding keys');

    console.log('\n🎉 Your multi-LLM assistant is ready to be upgraded!');
}

setupApiKeys();
