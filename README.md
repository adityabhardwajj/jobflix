This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## Environment Variables

Before deploying, make sure to set up the following environment variables in your Vercel project:

1. **OPENAI_API_KEY** - Your OpenAI API key for the AI assistant feature
2. **GOOGLE_CLIENT_ID** - Your Google OAuth client ID
3. **GOOGLE_REDIRECT_URI** - Your Vercel domain + callback path (e.g., `https://your-app.vercel.app/api/auth/google/callback`)

### Setting up Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with the appropriate environment (Production, Preview, Development)
4. Redeploy your application

## Features

- 🏠 Real Estate Listings
- 🤖 AI Assistant for Job Search
- 🌙 Dark/Light Theme Toggle
- 📱 Responsive Design
- 🔐 Google OAuth Authentication
- 📞 Phone Number Authentication
- 📊 Job Application Tracking
- 📰 Tech News Section

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
