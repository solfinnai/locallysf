import Link from 'next/link';

interface FooterProps {
  variant?: 'dark' | 'light';
  showNewsletter?: boolean;
  className?: string;
}

const socialLinks = [
  { href: 'https://twitter.com/locallysf', label: 'Twitter', icon: 'X' },
  { href: 'https://instagram.com/locallysf', label: 'Instagram', icon: 'IG' },
  { href: 'https://facebook.com/locallysf', label: 'Facebook', icon: 'FB' },
];

const exploreLinks = [
  { href: '/restaurants', label: 'Restaurants' },
  { href: '/cafes', label: 'Cafes & Coffee' },
  { href: '/bars', label: 'Bars & Nightlife' },
  { href: '/shopping', label: 'Shopping' },
  { href: '/attractions', label: 'Attractions' },
  { href: '/services', label: 'Services' },
];

const neighborhoodLinks = [
  { href: '/restaurants?neighborhood=Mission', label: 'Mission District' },
  { href: '/restaurants?neighborhood=Chinatown', label: 'Chinatown' },
  { href: '/restaurants?neighborhood=North+Beach', label: 'North Beach' },
  { href: '/restaurants?neighborhood=Castro', label: 'Castro' },
  { href: '/restaurants?neighborhood=Marina', label: 'Marina' },
  { href: '/restaurants?neighborhood=Hayes+Valley', label: 'Hayes Valley' },
];

const companyLinks = [
  { href: '/about', label: 'About LocallySF' },
  { href: '/blog', label: 'Blog' },
];

export default function Footer({ variant = 'dark', className = '' }: FooterProps) {
  const isDark = variant === 'dark';
  const currentYear = new Date().getFullYear();

  const bgClass = isDark ? 'bg-primary' : 'bg-white border-t border-gray-100';
  const textClass = isDark ? 'text-gray-300' : 'text-gray-600';
  const headingClass = isDark ? 'text-white' : 'text-primary';
  const accentClass = 'text-accent';

  return (
    <footer className={`${bgClass} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span
                className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-primary'}`}
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Locally<span className={accentClass}>SF</span>
              </span>
            </Link>
            <p className={`${textClass} mb-6 max-w-md`}>
              Your complete guide to San Francisco&apos;s best restaurants, bars, cafes,
              shopping, and attractions. Discover hidden gems and local favorites with
              real reviews and real photos.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isDark
                      ? 'bg-white/10 hover:bg-accent'
                      : 'bg-gray-100 hover:bg-accent hover:text-white'
                  }`}
                  aria-label={social.label}
                >
                  <span className="text-sm font-bold">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`font-bold text-lg mb-4 ${headingClass}`}>Explore</h3>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${textClass} hover:${accentClass} transition-colors`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`font-bold text-lg mb-4 ${headingClass}`}>Neighborhoods</h3>
            <ul className="space-y-3">
              {neighborhoodLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${textClass} hover:${accentClass} transition-colors`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`font-bold text-lg mb-4 ${headingClass}`}>Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${textClass} hover:${accentClass} transition-colors`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={`border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center ${
            isDark ? 'border-white/10' : 'border-gray-100'
          }`}
        >
          <div className={`text-sm mb-4 md:mb-0 ${textClass}`}>
            © {currentYear} LocallySF. All rights reserved.
          </div>
          <div className={`flex items-center space-x-6 text-sm ${textClass}`}>
            <span>Made with ♥ in San Francisco</span>
            <Link href="/sitemap.xml" className={`hover:${accentClass} transition-colors`}>
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
