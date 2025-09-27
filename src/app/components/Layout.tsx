"use client";
import React from "react";
import Navbar from "./Navbar";
import { JobFlixLogoFooter } from './JobFlixLogo';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow bg-background transition-colors duration-300">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <JobFlixLogoFooter size="lg" showText={true} animated={true} className="text-white" />
              <p className="text-sm">Your all-in-one platform for tech jobs, news, and project ideas.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/jobs" className="hover:text-white transition-colors">Find Jobs</a></li>
                <li><a href="/tech-news" className="hover:text-white transition-colors">Tech News</a></li>
                <li><a href="/project-ideas" className="hover:text-white transition-colors">Project Ideas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/career-guides" className="hover:text-white transition-colors">Career Guides</a></li>
                <li><a href="/interview-tips" className="hover:text-white transition-colors">Interview Tips</a></li>
                <li><a href="/resume-templates" className="hover:text-white transition-colors">Resume Templates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2">
                <li><a href="mailto:aadityabhardwaj5cs@gmail.com" className="hover:text-white transition-colors">aadityabhardwaj5cs@gmail.com</a></li>
                <li><a href="https://www.linkedin.com/in/aditya-bhardwaj-961198232/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn Profile</a></li>
                <li><a href="tel:+916006410085" className="hover:text-white transition-colors">+91 6006410085</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm">{new Date().getFullYear()} </p>
              <div className="flex space-x-6">
                <a href="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms" className="text-sm hover:text-white transition-colors">Terms of Service</a>
                <a href="/cookies" className="text-sm hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
