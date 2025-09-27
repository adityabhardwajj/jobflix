'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';

import { ThemeToggle } from './ThemeToggle';
import NotificationBell from './notifications/NotificationBell';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
  Briefcase, 
  Newspaper, 
  Lightbulb, 
  Bot,
  LogIn,
  User,
  LogOut,
  Settings
} from 'lucide-react';

const navigationItems = [
  { name: 'Jobs', href: '/jobs' },
  { name: 'Tech News', href: '/tech-news' },
  { name: 'Projects', href: '/project-ideas' },
  { name: 'Assistant', href: '/assistant' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className="bg-card/95 backdrop-blur-sm border-b border-border"
      maxWidth="full"
      position="sticky"
    >
      {/* Brand */}
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-fg"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-fg">
                JobFlix
              </div>
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        {navigationItems.map((item) => (
          <NavbarItem key={item.name}>
            <Link
              href={item.href}
              className="text-sm font-medium text-muted-fg hover:text-fg transition-colors duration-200 py-2"
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right side actions */}
      <NavbarContent justify="end">
        {/* Notifications */}
        {session && (
          <NavbarItem>
            <NotificationBell />
          </NavbarItem>
        )}
        
        {/* Theme Toggle */}
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>

        {/* Authentication */}
        {session ? (
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  className="bg-muted text-card-fg hover:bg-muted/80 px-4 py-2 min-w-0"
                  startContent={
                    session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User size={16} />
                    )
                  }
                >
                  {session.user?.name?.split(' ')[0] || 'User'}
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="User menu"
                className="bg-card border border-border"
              >
                <DropdownItem
                  key="dashboard"
                  startContent={<User size={16} />}
                  href="/dashboard"
                  className="text-card-fg hover:bg-muted"
                >
                  Dashboard
                </DropdownItem>
                <DropdownItem
                  key="profile"
                  startContent={<Settings size={16} />}
                  href="/profile"
                  className="text-card-fg hover:bg-muted"
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  startContent={<LogOut size={16} />}
                  color="danger"
                  className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  onClick={() => signOut()}
                >
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Button
              as={Link}
              href="/auth/signin"
              className="bg-primary text-primary-fg hover:bg-primary/90 px-6 py-2 font-medium"
              startContent={<LogIn size={16} />}
            >
              Sign In
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Mobile Navigation Menu */}
      <NavbarMenu className="bg-card/95 backdrop-blur-sm border-t border-border mt-2">
        {navigationItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              className="w-full text-card-fg hover:text-accent py-3 text-base font-medium transition-colors duration-200"
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        
        {/* Mobile Auth */}
        <NavbarMenuItem className="pt-4 border-t border-border mt-4">
          {session ? (
            <div className="space-y-2">
              <Link
                className="w-full text-card-fg hover:text-accent py-2 text-base font-medium transition-colors duration-200 block"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="w-full text-card-fg hover:text-accent py-2 text-base font-medium transition-colors duration-200 block"
                href="/profile"
              >
                Profile
              </Link>
              <button
                className="w-full text-left text-red-600 hover:text-red-700 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              className="w-full text-primary hover:text-primary/80 py-2 text-base font-medium transition-colors duration-200"
              href="/auth/signin"
            >
              Sign In
            </Link>
          )}
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}