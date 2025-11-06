import axios from "axios";
import asyncHandler from "express-async-handler";

const NEWSAPI_BASE = "https://newsapi.org/v2";
const CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes
const cache = new Map();

/**
 * Helper: create a cache key from params
 */
const cacheKey = (params) => JSON.stringify(params);

/**
 * GET /api/news
 * Query params: q, pageSize, page, sources, country, category
 * Example: /api/news?q=ai&pageSize=10
 */
export const getNews = asyncHandler(async (req, res) => {
  const {
    q = "technology",
    pageSize = 10,
    page = 1,
    sources,
    country,
    category,
  } = req.query;

  const params = { q, pageSize, page, sources, country, category };

  const key = cacheKey(params);
  const now = Date.now();

  // Return cached if fresh
  if (cache.has(key)) {
    const { timestamp, data } = cache.get(key);
    if (now - timestamp < CACHE_TTL_MS) {
      return res.json(data);
    }
    cache.delete(key);
  }

  // If no API key, return demo news for development
  if (!process.env.NEWSAPI_KEY) {
    const demoNews = {
      status: "ok",
      totalResults: 6,
      articles: [
        {
          title: "AI Revolution: How Machine Learning is Transforming Industries",
          description: "Discover how artificial intelligence and machine learning are reshaping businesses across various sectors, from healthcare to finance.",
          url: "https://example.com/ai-revolution",
          source: { name: "Tech News" },
          publishedAt: new Date().toISOString(),
        },
        {
          title: "The Future of Remote Work: Tools and Trends for 2024",
          description: "Explore the latest tools, technologies, and trends shaping the future of remote work and distributed teams.",
          url: "https://example.com/remote-work",
          source: { name: "Tech News" },
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          title: "Blockchain Technology: Beyond Cryptocurrency",
          description: "Learn about the diverse applications of blockchain technology beyond digital currencies, including supply chain and identity verification.",
          url: "https://example.com/blockchain",
          source: { name: "Tech News" },
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          title: "Cybersecurity Best Practices for Modern Businesses",
          description: "Essential cybersecurity strategies and best practices to protect your business from evolving digital threats.",
          url: "https://example.com/cybersecurity",
          source: { name: "Tech News" },
          publishedAt: new Date(Date.now() - 259200000).toISOString(),
        },
        {
          title: "Cloud Computing: Migration Strategies and Benefits",
          description: "A comprehensive guide to cloud migration, including strategies, benefits, and common challenges businesses face.",
          url: "https://example.com/cloud-computing",
          source: { name: "Tech News" },
          publishedAt: new Date(Date.now() - 345600000).toISOString(),
        },
        {
          title: "The Rise of Low-Code and No-Code Development Platforms",
          description: "How low-code and no-code platforms are democratizing software development and enabling non-technical users to build applications.",
          url: "https://example.com/low-code",
          source: { name: "Tech News" },
          publishedAt: new Date(Date.now() - 432000000).toISOString(),
        },
      ],
    };
    return res.json(demoNews);
  }

  try {
    // Prefer /everything for wide search, /top-headlines if country/category present
    const endpoint =
      country || category || sources ? `${NEWSAPI_BASE}/top-headlines` : `${NEWSAPI_BASE}/everything`;

    const response = await axios.get(endpoint, {
      params: {
        q,
        pageSize,
        page,
        sources,
        country,
        category,
        apiKey: process.env.NEWSAPI_KEY,
        language: "en",
        sortBy: "publishedAt",
      },
      timeout: 10000,
    });

    const payload = response.data;

    // Save to cache
    cache.set(key, { timestamp: now, data: payload });

    res.json(payload);
  } catch (error) {
    // If API key is invalid or request fails, return demo news as fallback
    if (error.response?.status === 401 || error.response?.data?.code === "apiKeyInvalid") {
      const demoNews = {
        status: "ok",
        totalResults: 6,
        articles: [
          {
            title: "AI Revolution: How Machine Learning is Transforming Industries",
            description: "Discover how artificial intelligence and machine learning are reshaping businesses across various sectors, from healthcare to finance.",
            url: "https://example.com/ai-revolution",
            source: { name: "Tech News" },
            publishedAt: new Date().toISOString(),
          },
          {
            title: "The Future of Remote Work: Tools and Trends for 2024",
            description: "Explore the latest tools, technologies, and trends shaping the future of remote work and distributed teams.",
            url: "https://example.com/remote-work",
            source: { name: "Tech News" },
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            title: "Blockchain Technology: Beyond Cryptocurrency",
            description: "Learn about the diverse applications of blockchain technology beyond digital currencies, including supply chain and identity verification.",
            url: "https://example.com/blockchain",
            source: { name: "Tech News" },
            publishedAt: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            title: "Cybersecurity Best Practices for Modern Businesses",
            description: "Essential cybersecurity strategies and best practices to protect your business from evolving digital threats.",
            url: "https://example.com/cybersecurity",
            source: { name: "Tech News" },
            publishedAt: new Date(Date.now() - 259200000).toISOString(),
          },
          {
            title: "Cloud Computing: Migration Strategies and Benefits",
            description: "A comprehensive guide to cloud migration, including strategies, benefits, and common challenges businesses face.",
            url: "https://example.com/cloud-computing",
            source: { name: "Tech News" },
            publishedAt: new Date(Date.now() - 345600000).toISOString(),
          },
          {
            title: "The Rise of Low-Code and No-Code Development Platforms",
            description: "How low-code and no-code platforms are democratizing software development and enabling non-technical users to build applications.",
            url: "https://example.com/low-code",
            source: { name: "Tech News" },
            publishedAt: new Date(Date.now() - 432000000).toISOString(),
          },
        ],
      };
      return res.json(demoNews);
    }
    const status = error.response?.status || 500;
    const message = error.response?.data || error.message || "News provider error";
    res.status(status).json({ message });
  }
});

