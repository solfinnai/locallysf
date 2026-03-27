'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  variant?: 'transparent' | 'light' | 'dark';
  className?: string;
}

const navLinks = [
  { href: '/restaurants', label: 'Restaurants' },
  { href: '/cafes', label: 'Cafes' },
  { href: '/bars', label: 'Bars' },
  { href: '/shopping', label: 'Shopping' },
  { href: '/attractions', label: 'Attractions' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

const variantStyles = {
  transparent: {
    nav: 'bg-transparent border-white/10',
    link: 'text-white/80 hover:text-white',
    active: 'text-white font-semibold',
    logo: 'text-white',
    hamburger: 'bg-white',
  },
  light: {
    nav: 'bg-white border-gray-100',
    link: 'text-gray-500 hover:text-primary',
    active: 'text-primary font-semibold',
    logo: 'text-primary',
    hamburger: 'bg-primary',
  },
  dark: {
    nav: 'bg-[#0A1628] border-white/10',
    link: 'text-gray-300 hover:text-white',
    active: 'text-white font-semibold',
    logo: 'text-white',
    hamburger: 'bg-white',
  },
};

export default function Navigation({ variant = 'light', className = '' }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const styles = variantStyles[variant];

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && isOpen) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeMenu]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    closeMenu();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b ${styles.nav} ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className={`text-xl font-bold transition-colors ${styles.logo}`}
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            <span className="opacity-50">◎</span> Locally<span className="text-accent">SF</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? styles.active : styles.link
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:block">
            <Link
              href="/restaurants"
              className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              Explore
            </Link>
          </div>

          <button
            ref={buttonRef}
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="w-6 h-6 relative">
              <span
                className={`absolute top-0 left-0 w-full h-0.5 transform transition-all duration-300 ${
                  styles.hamburger
                } ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}
              />
              <span
                className={`absolute top-2.5 left-0 w-full h-0.5 transition-opacity duration-300 ${
                  styles.hamburger
                } ${isOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`absolute top-5 left-0 w-full h-0.5 transform transition-all duration-300 ${
                  styles.hamburger
                } ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}
              />
            </div>
          </button>
        </div>

        <div
          ref={menuRef}
          id="mobile-menu"
          role="menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          aria-hidden={!isOpen}
        >
          <div className="py-4 space-y-2" role="none">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : `${styles.link} hover:bg-white/5`
                  }`}
                  role="menuitem"
                  tabIndex={isOpen ? 0 : -1}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/restaurants"
              onClick={handleLinkClick}
              className="block mx-4 mt-4 text-center bg-accent text-white px-4 py-2.5 rounded-lg text-sm font-medium"
              role="menuitem"
              tabIndex={isOpen ? 0 : -1}
            >
              Explore
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
