'use client';

import { Link, Divider, Chip } from '@heroui/react';
import { 
  Briefcase, 
  Newspaper, 
  Lightbulb, 
  HelpCircle,
  Building2,
  Users,
  Phone,
  Activity,
  Shield,
  FileText,
  Cookie
} from 'lucide-react';
import { JobFlixLogoFooter } from './JobFlixLogo';

interface FooterLink {
  name: string;
  href: string;
  icon?: any;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export default function Footer() {
  const footerSections: FooterSection[] = [
    {
      title: 'Product',
      links: [
        { name: 'Find Jobs', href: '/jobs', icon: Briefcase },
        { name: 'Tech News', href: '/tech-news', icon: Newspaper },
        { name: 'Project Ideas', href: '/project-ideas', icon: Lightbulb },
        { name: 'Resources', href: '/resources', icon: HelpCircle },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about', icon: Building2 },
        { name: 'Careers', href: '/careers', icon: Users },
        { name: 'Press', href: '/press', icon: Newspaper },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact', href: '/contact', icon: Phone },
        { name: 'Status', href: '/status', icon: Activity },
        { name: 'Help Center', href: '/help', icon: HelpCircle },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy', icon: Shield },
        { name: 'Terms of Service', href: '/terms', icon: FileText },
        { name: 'Cookie Policy', href: '/cookies', icon: Cookie },
      ],
    },
  ];

  return (
    <footer className="bg-background border-t border-default-200/60">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          <div className="space-y-3">
            <Link href="/" className="flex items-center">
              <JobFlixLogoFooter size="lg" showText={true} animated={true} />
            </Link>
            <p className="text-sm text-default-500 max-w-md">
              Minimal, modern, and verified opportunities. Career decisions that feel intentional.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Chip color="primary" variant="flat" className="text-xs uppercase tracking-wide">
              Credibility first
            </Chip>
            <Chip color="secondary" variant="flat" className="text-xs uppercase tracking-wide">
              Built for alignment
            </Chip>
          </div>
        </div>

        <Divider className="bg-default-200/60 mb-12" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-default-600 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                      >
                        {IconComponent && (
                          <IconComponent 
                            size={14} 
                            className="text-default-400 group-hover:text-primary transition-colors" 
                          />
                        )}
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter signup */}
        <div className="border-t border-default-200/60 pt-12 mb-12">
          <div className="max-w-md">
            <h3 className="font-semibold text-foreground mb-2">Stay Updated</h3>
            <p className="text-default-600 text-sm mb-4">
              Get the latest job opportunities and tech insights delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-content2 border border-divider rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-default-200/60 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-default-500 text-sm">
              © 2025 JobFlix — Minimal, modern, and verified opportunities.
            </p>

            <div className="flex items-center gap-4">
              {[
                { href: 'https://twitter.com/jobflix', label: 'Twitter', icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                ) },
                { href: 'https://www.linkedin.com/in/aditya-bhardwaj-961198232/', label: 'LinkedIn', icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                ) },
                { href: 'https://github.com/jobflix', label: 'GitHub', icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                ) },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-default-400 hover:text-primary transition-colors"
                  aria-label={`Follow us on ${item.label}`}
                  isExternal
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
