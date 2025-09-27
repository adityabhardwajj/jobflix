# 🎬 JobFlix - Your Career, Your Next Step

[![CI/CD Pipeline](https://github.com/yourusername/jobflix/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/jobflix/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/yourusername/jobflix/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/jobflix)
[![Lighthouse Performance](https://img.shields.io/badge/lighthouse-90%2B-brightgreen)](https://github.com/yourusername/jobflix)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, production-ready job platform built with Next.js 14, TypeScript, and cutting-edge web technologies. JobFlix provides a seamless experience for job seekers to find verified opportunities and connect directly with decision-makers.

## ✨ Features

### 🎯 **Core Features**

- **Verified Job Listings** - Curated opportunities from startups to Fortune 500
- **AI-Powered Matching** - Intelligent job recommendations using OpenAI GPT-4
- **Direct Decision-Maker Access** - Connect directly with hiring managers
- **Real-time Tech News** - Stay updated with the latest industry trends
- **Interactive Dashboard** - Track applications and manage your job search
- **Advanced Search & Filters** - Find exactly what you're looking for

### 🚀 **Technical Features**

- **Next.js 14 App Router** - Latest React Server Components
- **TypeScript** - Full type safety throughout the application
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark/Light Mode** - Automatic theme switching with system preference
- **Form Validation** - React Hook Form + Zod for robust validation
- **Authentication** - NextAuth.js with Google OAuth
- **Database** - Prisma ORM with PostgreSQL
- **Testing** - Jest unit tests + Playwright E2E tests
- **Performance** - Lighthouse scores ≥90 across all metrics
- **Accessibility** - WCAG AA compliant with full keyboard navigation

## 🛠️ Tech Stack

### **Frontend**

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + HeroUI (NextUI v2)
- **Animations**: Framer Motion + Aceternity UI
- **Forms**: React Hook Form + Zod validation
- **State Management**: React hooks + Context API

### **Backend**

- **API**: Next.js API Routes + FastAPI (Python)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI GPT-4
- **File Storage**: Cloudinary/AWS S3
- **Email**: Nodemailer

### **DevOps & Testing**

- **Testing**: Jest + React Testing Library + Playwright
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel
- **Monitoring**: Lighthouse CI + Sentry
- **Code Quality**: ESLint + Prettier + Husky

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Google OAuth credentials

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/jobflix.git
cd jobflix
npm install
```

### 2. Environment Setup

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/jobflix"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data (optional)
npm run db:seed
```

### 4. Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

## 📋 Available Scripts

### **Development**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start          # Start production server
npm run lint          # Run ESLint
```

### **Database**

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:migrate   # Create and run migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

### **Testing**

```bash
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # Run E2E tests with UI
npm run test:all          # Run all tests
npm run playwright:install # Install Playwright browsers
```

## 🏗️ Project Structure

```text
jobflix/
├── 📁 .github/workflows/     # GitHub Actions CI/CD
├── 📁 e2e/                   # Playwright E2E tests
├── 📁 prisma/                # Database schema & migrations
├── 📁 public/                # Static assets
├── 📁 src/
│   ├── 📁 app/               # Next.js App Router
│   │   ├── 📁 api/           # API routes
│   │   ├── 📁 components/    # React components
│   │   ├── 📁 contexts/      # React contexts
│   │   └── 📁 hooks/         # Custom hooks
│   ├── 📁 components/        # Shared UI components
│   └── 📁 lib/               # Utilities & configurations
├── 📄 .env.local.example     # Environment variables template
├── 📄 jest.config.js         # Jest configuration
├── 📄 playwright.config.ts   # Playwright configuration
├── 📄 tailwind.config.js     # Tailwind CSS configuration
└── 📄 tsconfig.json          # TypeScript configuration
```

## 🧪 Testing Strategy

### **Unit Tests (Jest + React Testing Library)**

- Component testing with user interactions
- Validation schema testing
- Utility function testing
- API route testing

### **E2E Tests (Playwright)**

- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness testing
- User journey testing
- Performance testing

### **Coverage Requirements**

- **Minimum 70%** code coverage
- **90%+ Performance** on Lighthouse
- **95%+ Accessibility** score
- **95%+ Best Practices** score
- **95%+ SEO** score

## 🚀 Deployment

### **Vercel (Recommended)**

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Manual Deployment**

```bash
# Build the application
npm run build

# Start production server
npm start
```

### **Environment Variables for Production**

```env
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=your-production-database-url
# ... other production variables
```

## 🔧 Configuration

### **Tailwind CSS Themes**

The application supports custom themes defined in `tailwind.config.js`:

- `jobflix-light` - Light theme with blue/purple gradients
- `jobflix-dark` - Dark theme with enhanced contrast

### **HeroUI Components**

Pre-configured with HeroUI (NextUI v2) for consistent design:

- Buttons, inputs, modals, navigation
- Automatic dark mode support
- Accessibility built-in

### **Form Validation**

Robust validation using Zod schemas in `src/lib/validations.ts`:

- Login/registration forms
- Job application forms
- Profile management forms
- Search and filter forms

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**

- Follow TypeScript best practices
- Write tests for new features
- Maintain accessibility standards
- Use semantic commit messages
- Update documentation as needed

## 📊 Performance Metrics

### **Lighthouse Scores (Target)**

- **Performance**: ≥90
- **Accessibility**: ≥95
- **Best Practices**: ≥95
- **SEO**: ≥95

### **Core Web Vitals**

- **LCP**: <2.5s (Largest Contentful Paint)
- **FID**: <100ms (First Input Delay)
- **CLS**: <0.1 (Cumulative Layout Shift)

## 🔒 Security

- **Authentication**: Secure JWT tokens with NextAuth.js
- **Authorization**: Role-based access control
- **Input Validation**: Server-side validation with Zod
- **CSRF Protection**: Built-in Next.js protection
- **Rate Limiting**: API route protection
- **Security Headers**: Configured in `next.config.js`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the guides in `/docs`
- **Issues**: [GitHub Issues](https://github.com/yourusername/jobflix/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/jobflix/discussions)

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Seamless deployment platform
- **HeroUI** - Beautiful component library
- **Aceternity UI** - Stunning animation components
- **OpenAI** - Powerful AI integration

---

**Built with ❤️ by [Your Name](https://github.com/yourusername)**

[🌐 Live Demo](https://jobflix.vercel.app) • [📖 Documentation](./docs) • [🐛 Report Bug](https://github.com/yourusername/jobflix/issues) • [✨ Request Feature](https://github.com/yourusername/jobflix/issues)
