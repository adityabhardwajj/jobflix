import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import User from "./models/User.js";
import Idea from "./models/Idea.js";
import Job from "./models/Job.js";

const seedData = async () => {
  try {
    await connectDB();

    console.log("🧹 Clearing old data...");
    await Promise.all([User.deleteMany({}), Idea.deleteMany({}), Job.deleteMany({})]);

    console.log("👤 Creating users...");
    const users = await User.create([
      { name: "Admin User", email: "admin@ideaverse.com", password: "Password123!", role: "admin" },
      { name: "Alice Creator", email: "alice@ideaverse.com", password: "Password123!", role: "creator" },
      { name: "Bob Freelancer", email: "bob@ideaverse.com", password: "Password123!", role: "freelancer" },
      { name: "Carol Recruiter", email: "carol@ideaverse.com", password: "Password123!", role: "recruiter" },
      { name: "David Innovator", email: "david@ideaverse.com", password: "Password123!", role: "creator" },
      { name: "Emma Designer", email: "emma@ideaverse.com", password: "Password123!", role: "creator" },
      { name: "Frank Developer", email: "frank@ideaverse.com", password: "Password123!", role: "freelancer" },
      { name: "Grace Manager", email: "grace@ideaverse.com", password: "Password123!", role: "recruiter" },
    ]);

    const [admin, alice, bob, carol, david, emma, frank, grace] = users;

    console.log("💡 Creating sample ideas...");
    await Idea.create([
      {
        title: "AI Resume Builder",
        description: "Generate professional resumes using AI. Automatically format, optimize, and tailor resumes for specific job applications. Includes ATS optimization and keyword suggestions.",
        tags: ["AI", "HR", "Productivity"],
        createdBy: alice._id,
      },
      {
        title: "EduTech Platform",
        description: "Learn coding interactively with live mentors. Real-time code review, pair programming sessions, and personalized learning paths for developers of all levels.",
        tags: ["EdTech", "Learning", "Coding"],
        createdBy: alice._id,
      },
      {
        title: "CodeCollab",
        description: "Real-time collaborative editor with AI suggestions. Multiple developers can code together with intelligent autocomplete, code review, and version control integration.",
        tags: ["Collab", "Editor", "AI"],
        createdBy: david._id,
      },
      {
        title: "DesignVerse",
        description: "Crowdsourced UI/UX gallery for designers. Share designs, get feedback, and discover inspiration from a global community of creative professionals.",
        tags: ["Design", "UX", "Community"],
        createdBy: emma._id,
      },
      {
        title: "RemoteRise",
        description: "Curated remote job board for developers. Filter by tech stack, salary range, and company culture. Includes interview prep and salary negotiation tips.",
        tags: ["Jobs", "Remote", "Career"],
        createdBy: david._id,
      },
      {
        title: "HealthTracker Pro",
        description: "Comprehensive health and fitness tracking app with AI-powered insights. Track workouts, nutrition, sleep, and get personalized recommendations.",
        tags: ["Health", "Fitness", "AI"],
        createdBy: alice._id,
      },
      {
        title: "EcoMarket",
        description: "Sustainable marketplace connecting eco-conscious consumers with green businesses. Carbon footprint calculator and eco-friendly product recommendations.",
        tags: ["Sustainability", "E-commerce", "Green"],
        createdBy: emma._id,
      },
      {
        title: "FinanceFlow",
        description: "Personal finance management with automated budgeting, expense tracking, and investment insights. AI-powered financial planning and goal setting.",
        tags: ["Finance", "Budgeting", "AI"],
        createdBy: david._id,
      },
      {
        title: "SocialConnect",
        description: "Professional networking platform for tech professionals. Connect with peers, share knowledge, and discover career opportunities in the tech industry.",
        tags: ["Social", "Networking", "Career"],
        createdBy: alice._id,
      },
      {
        title: "TaskMaster AI",
        description: "Intelligent task management with AI prioritization. Automatically organize tasks, set deadlines, and provide productivity insights based on your work patterns.",
        tags: ["Productivity", "AI", "Task Management"],
        createdBy: emma._id,
      },
      {
        title: "LearnLang",
        description: "Interactive language learning app with native speaker conversations. Gamified lessons, pronunciation practice, and cultural immersion experiences.",
        tags: ["Education", "Language", "Mobile"],
        createdBy: david._id,
      },
      {
        title: "FoodieFinder",
        description: "Discover local restaurants and food experiences. Personalized recommendations based on dietary preferences, reviews, and real-time availability.",
        tags: ["Food", "Local", "Recommendations"],
        createdBy: alice._id,
      },
      {
        title: "TravelCompanion",
        description: "AI-powered travel planning assistant. Create itineraries, find best deals, and get real-time travel updates and recommendations.",
        tags: ["Travel", "AI", "Planning"],
        createdBy: emma._id,
      },
      {
        title: "MediCare Connect",
        description: "Telemedicine platform connecting patients with healthcare providers. Virtual consultations, prescription management, and health record access.",
        tags: ["Healthcare", "Telemedicine", "Mobile"],
        createdBy: david._id,
      },
      {
        title: "EventHub",
        description: "Discover and organize local events. Create events, sell tickets, and connect with attendees. Perfect for meetups, workshops, and conferences.",
        tags: ["Events", "Social", "Community"],
        createdBy: alice._id,
      },
      {
        title: "CodeReview AI",
        description: "Automated code review tool that suggests improvements, finds bugs, and enforces coding standards. Integrates with GitHub, GitLab, and Bitbucket.",
        tags: ["Development", "AI", "Code Quality"],
        createdBy: david._id,
      },
      {
        title: "MindfulMoments",
        description: "Meditation and mindfulness app with guided sessions, breathing exercises, and progress tracking. Personalized meditation plans for stress relief.",
        tags: ["Wellness", "Meditation", "Health"],
        createdBy: emma._id,
      },
      {
        title: "PetCare Pro",
        description: "Comprehensive pet care management app. Track vaccinations, vet appointments, feeding schedules, and connect with local pet services.",
        tags: ["Pets", "Health", "Management"],
        createdBy: alice._id,
      },
      {
        title: "SmartHome Hub",
        description: "Centralized control for all smart home devices. Voice commands, automation rules, energy monitoring, and security management in one app.",
        tags: ["IoT", "Smart Home", "Automation"],
        createdBy: david._id,
      },
      {
        title: "StudyBuddy",
        description: "Collaborative study platform for students. Create study groups, share notes, schedule study sessions, and track academic progress together.",
        tags: ["Education", "Collaboration", "Students"],
        createdBy: emma._id,
      },
    ]);

    console.log("💼 Creating sample jobs...");
    await Job.create([
      {
        title: "Frontend Developer",
        description: "Build beautiful and responsive UI for IdeaVerse platform using React and Tailwind CSS. Work on modern web applications with focus on user experience and performance.",
        skills: ["React", "Tailwind CSS", "JavaScript", "TypeScript"],
        budgetRange: "$50,000 - $80,000",
        isRemote: true,
        location: "Remote",
        postedBy: carol._id,
        status: "open",
      },
      {
        title: "Backend Engineer",
        description: "Develop robust APIs and integrations for IdeaVerse. Work with Node.js, MongoDB, and cloud services. Experience with RESTful APIs and microservices architecture required.",
        skills: ["Node.js", "MongoDB", "Express", "REST APIs"],
        budgetRange: "$60,000 - $90,000",
        isRemote: true,
        location: "Remote",
        postedBy: carol._id,
        status: "open",
      },
      {
        title: "Full Stack Developer",
        description: "End-to-end development of web applications. Must be proficient in both frontend and backend technologies. Experience with MERN stack preferred.",
        skills: ["React", "Node.js", "MongoDB", "Express"],
        budgetRange: "$70,000 - $100,000",
        isRemote: true,
        location: "San Francisco, CA",
        postedBy: grace._id,
        status: "open",
      },
      {
        title: "UI/UX Designer",
        description: "Create intuitive and visually appealing user interfaces. Work closely with developers to implement designs. Portfolio required showcasing modern design principles.",
        skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
        budgetRange: "$45,000 - $70,000",
        isRemote: true,
        location: "Remote",
        postedBy: grace._id,
        status: "open",
      },
      {
        title: "DevOps Engineer",
        description: "Manage cloud infrastructure, CI/CD pipelines, and deployment processes. Experience with AWS, Docker, and Kubernetes required.",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
        budgetRange: "$80,000 - $120,000",
        isRemote: false,
        location: "New York, NY",
        postedBy: carol._id,
        status: "open",
      },
      {
        title: "Mobile App Developer (React Native)",
        description: "Develop cross-platform mobile applications using React Native. Experience with iOS and Android development, state management, and API integration.",
        skills: ["React Native", "JavaScript", "iOS", "Android"],
        budgetRange: "$65,000 - $95,000",
        isRemote: true,
        location: "Remote",
        postedBy: grace._id,
        status: "open",
      },
      {
        title: "Data Scientist",
        description: "Analyze user data, build ML models, and provide insights for product improvement. Experience with Python, TensorFlow, and data visualization required.",
        skills: ["Python", "Machine Learning", "TensorFlow", "Data Analysis"],
        budgetRange: "$85,000 - $130,000",
        isRemote: true,
        location: "Remote",
        postedBy: carol._id,
        status: "open",
      },
      {
        title: "Product Manager",
        description: "Lead product development from conception to launch. Work with cross-functional teams, define requirements, and prioritize features based on user feedback.",
        skills: ["Product Management", "Agile", "User Research", "Analytics"],
        budgetRange: "$90,000 - $140,000",
        isRemote: false,
        location: "Seattle, WA",
        postedBy: grace._id,
        status: "open",
      },
      {
        title: "QA Engineer",
        description: "Ensure software quality through comprehensive testing. Write test cases, perform manual and automated testing, and work with developers to fix bugs.",
        skills: ["Testing", "Selenium", "Jest", "QA Automation"],
        budgetRange: "$50,000 - $75,000",
        isRemote: true,
        location: "Remote",
        postedBy: carol._id,
        status: "open",
      },
      {
        title: "Content Writer",
        description: "Create engaging content for blog, documentation, and marketing materials. Technical writing experience preferred. Must have excellent communication skills.",
        skills: ["Content Writing", "Technical Writing", "SEO", "Copywriting"],
        budgetRange: "$40,000 - $60,000",
        isRemote: true,
        location: "Remote",
        postedBy: grace._id,
        status: "open",
      },
      {
        title: "Graphic Designer",
        description: "Create visual assets for marketing campaigns, social media, and product interfaces. Strong portfolio in digital design and branding required.",
        skills: ["Photoshop", "Illustrator", "Branding", "Digital Design"],
        budgetRange: "$45,000 - $65,000",
        isRemote: true,
        location: "Remote",
        postedBy: carol._id,
        status: "open",
      },
      {
        title: "Security Engineer",
        description: "Implement security best practices, conduct security audits, and protect against vulnerabilities. Experience with penetration testing and security protocols required.",
        skills: ["Cybersecurity", "Penetration Testing", "Security Audits", "OWASP"],
        budgetRange: "$95,000 - $150,000",
        isRemote: false,
        location: "Austin, TX",
        postedBy: grace._id,
        status: "open",
      },
      {
        title: "Blockchain Developer",
        description: "Develop smart contracts and decentralized applications. Experience with Solidity, Ethereum, and Web3 technologies required.",
        skills: ["Solidity", "Ethereum", "Web3", "Smart Contracts"],
        budgetRange: "$100,000 - $160,000",
        isRemote: true,
        location: "Remote",
        postedBy: carol._id,
        status: "open",
      },
      {
        title: "Marketing Specialist",
        description: "Develop and execute marketing strategies, manage social media presence, and analyze campaign performance. Experience with digital marketing tools required.",
        skills: ["Digital Marketing", "Social Media", "Analytics", "SEO"],
        budgetRange: "$50,000 - $75,000",
        isRemote: true,
        location: "Remote",
        postedBy: grace._id,
        status: "open",
      },
      {
        title: "Customer Success Manager",
        description: "Ensure customer satisfaction, onboard new clients, and provide ongoing support. Strong communication skills and technical knowledge required.",
        skills: ["Customer Support", "Communication", "CRM", "Problem Solving"],
        budgetRange: "$55,000 - $80,000",
        isRemote: true,
        location: "Remote",
        postedBy: carol._id,
        status: "open",
      },
    ]);

    console.log("✅ Database seeded successfully!");
    console.log(`   - ${users.length} users created (including admin)`);
    console.log(`   - 20 ideas created`);
    console.log(`   - 15 jobs created`);
    console.log("\n📋 Login Credentials:");
    console.log("   👑 Admin: admin@ideaverse.com / Password123!");
    console.log("   👤 Creator: alice@ideaverse.com / Password123!");
    console.log("   💼 Freelancer: bob@ideaverse.com / Password123!");
    console.log("   🎯 Recruiter: carol@ideaverse.com / Password123!");
    process.exit();
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedData();
