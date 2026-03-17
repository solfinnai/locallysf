import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { href: '/restaurants', label: 'Restaurants' },
      { href: '/cafes', label: 'Cafes & Coffee' },
      { href: '/bars', label: 'Bars & Nightlife' },
      { href: '/shopping', label: 'Shopping' },
      { href: '/attractions', label: 'Attractions' },
      { href: '/services', label: 'Services' },
    ],
    neighborhoods: [
      { href: '/restaurants?neighborhood=Mission', label: 'Mission District' },
      { href: '/restaurants?neighborhood=Chinatown', label: 'Chinatown' },
      { href: '/restaurants?neighborhood=North+Beach', label: 'North Beach' },
      { href: '/restaurants?neighborhood=Castro', label: 'Castro' },
      { href: '/restaurants?neighborhood=Marina', label: 'Marina' },
      { href: '/restaurants?neighborhood=Hayes+Valley', label: 'Hayes Valley' },
    ],
    company: [
      { href: '/about', label: 'About LocallySF' },
      { href: '/blog', label: 'Blog' },
    ],
  };

  const socialLinks = [
    { href: 'https://twitter.com/locallysf', label: 'Twitter', icon: 'X' },
    { href: 'https://instagram.com/locallysf', label: 'Instagram', icon: 'IG' },
    { href: 'https://facebook.com/locallysf', label: 'Facebook', icon: 'FB' },
  ];

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-3xl font-display font-bold">
                Locally<span className="text-accent">SF</span>
              </span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Your complete guide to San Francisco&apos;s best restaurants, bars, cafes, shopping, and attractions.
              Discover hidden gems and local favorites with real reviews and real photos.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors duration-200"
                  aria-label={social.label}
                >
                  <span className="text-sm font-bold">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-bold text-lg mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Neighborhoods */}
          <div>
            <h3 className="font-bold text-lg mb-4">Neighborhoods</h3>
            <ul className="space-y-3">
              {footerLinks.neighborhoods.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-300 text-sm mb-4 md:mb-0">
            © {currentYear} LocallySF. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-300">
            <span>Made with ❤️ in San Francisco</span>
            <Link href="/sitemap.xml" className="hover:text-accent transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}