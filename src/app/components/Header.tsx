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
  Chip,
} from '@heroui/react';

import { useTheme } from '../hooks/useTheme';
import { useState, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Briefcase, 
  Newspaper, 
  Lightbulb, 
  Bot,
  LogIn,
  ArrowRight,
  User,
  LogOut,
  Settings
} from 'lucide-react';
import { JobFlixLogoHeader } from './JobFlixLogo';

const navigationItems = [
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Tech News', href: '/tech-news', icon: Newspaper },
  { name: 'Project Ideas', href: '/project-ideas', icon: Lightbulb },
  { name: 'Assistant', href: '/assistant', icon: Bot },
];

const themeOptions = [
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'system', label: 'System', icon: Monitor },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  const ThemeIcon = useMemo(() => {
    const option = themeOptions.find((opt) => opt.key === theme);
    return option?.icon ?? Sun;
  }, [theme]);

  const currentThemeOption = themeOptions.find(option => option.key === theme);

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className="supports-[backdrop-filter]:bg-background/55 bg-background/80 border-b border-default-200/70"
      maxWidth="full"
      position="sticky"
    >
      {/* Brand */}
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="gap-3">
          <Link href="/" className="flex items-center">
            <JobFlixLogoHeader size="md" showText={true} animated={true} />
          </Link>
          <Chip size="sm" variant="flat" color="primary" className="hidden md:inline-flex">
            Verified talent
          </Chip>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden sm:flex gap-2 lg:gap-3" justify="center">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavbarItem key={item.name}>
              <Button
                as={Link}
                href={item.href}
                variant="flat"
                radius="full"
                className="gap-2 px-4 text-sm font-medium text-default-600 hover:text-primary hover:bg-primary/10"
                color="default"
                startContent={<IconComponent size={16} />}
              >
                {item.name}
              </Button>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      {/* Right side actions */}
      <NavbarContent justify="end">
        {/* Theme Toggle */}
        <NavbarItem>
          <Dropdown className="min-w-40">
            <DropdownTrigger>
              <Button
                variant="flat"
                radius="full"
                isIconOnly
                aria-label="Toggle theme"
                className="text-default-500"
              >
                <ThemeIcon size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Theme selection"
              selectedKeys={[theme]}
              selectionMode="single"
              onSelectionChange={(keys) => {
                const selectedTheme = Array.from(keys)[0] as 'light' | 'dark' | 'system';
                setTheme(selectedTheme);
              }}
            >
              {themeOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <DropdownItem
                    key={option.key}
                    startContent={<IconComponent size={16} />}
                  >
                    {option.label}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>

        {/* Authentication */}
        {session ? (
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  radius="full"
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
                  className="px-4 text-sm"
                >
                  {session.user?.name?.split(' ')[0] || 'User'}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu">
                <DropdownItem
                  key="dashboard"
                  startContent={<User size={16} />}
                  href="/dashboard"
                >
                  Dashboard
                </DropdownItem>
                <DropdownItem
                  key="profile"
                  startContent={<Settings size={16} />}
                  href="/profile"
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  startContent={<LogOut size={16} />}
                  color="danger"
                  onPress={() => signOut({ callbackUrl: '/' })}
                >
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <>
            {/* Login */}
            <NavbarItem className="hidden lg:flex">
              <Button
                as={Link}
                href="/auth/signin"
                variant="flat"
                radius="full"
                startContent={<LogIn size={16} />}
                className="px-4 text-sm text-default-600"
              >
                Sign In
              </Button>
            </NavbarItem>

            {/* Get Started CTA */}
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="/auth/signup"
                variant="solid"
                radius="full"
                endContent={<ArrowRight size={16} />}
                className="font-semibold px-6 shadow-sm shadow-primary/25 hover:shadow-primary/40"
              >
                Get Started
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="pt-6">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavbarMenuItem key={item.name}>
              <Link
                color="foreground"
                className="w-full flex items-center gap-3 py-2 text-lg"
                href={item.href}
                size="lg"
                onPress={() => setIsMenuOpen(false)}
              >
                <IconComponent size={20} />
                {item.name}
              </Link>
            </NavbarMenuItem>
          );
        })}
        
        <NavbarMenuItem className="mt-4 pt-4 border-t border-divider">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="w-full flex items-center gap-3 py-2 text-lg"
                onPress={() => setIsMenuOpen(false)}
              >
                <User size={20} />
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="w-full flex items-center gap-3 py-2 text-lg"
                onPress={() => setIsMenuOpen(false)}
              >
                <Settings size={20} />
                Profile
              </Link>
              <Button
                variant="flat"
                color="danger"
                className="w-full font-medium mt-2"
                startContent={<LogOut size={16} />}
                onPress={() => {
                  setIsMenuOpen(false)
                  signOut({ callbackUrl: '/' })
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="w-full flex items-center gap-3 py-2 text-lg text-default-600"
                onPress={() => setIsMenuOpen(false)}
              >
                <LogIn size={20} />
                Sign In
              </Link>
              <Button
                as={Link}
                color="primary"
                href="/auth/signup"
                variant="solid"
                className="w-full font-medium mt-2"
                endContent={<ArrowRight size={16} />}
                onPress={() => setIsMenuOpen(false)}
              >
                Get Started
              </Button>
            </>
          )}
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
