"use client";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Main Content */}
      <main className="flex-grow bg-white dark:bg-gray-900 transition-colors duration-300">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Jobflix</h3>
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
                <li><a href="mailto:support@jobflix.com" className="hover:text-white transition-colors">aadityabhardwaj5cs@gmail.com</a></li>
                <li><a href="tel:+1234567890" className="hover:text-white transition-colors">+91 6006410085</a></li>
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
