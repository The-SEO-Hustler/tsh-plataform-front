import Link from 'next/link';
import Container from '@/components/container';

export default function Footer() {
  // Footer link sections
  const sections = [
    {
      title: 'Resources',
      links: [
        { name: 'Free SEO Tools', href: '/tools' },
        { name: 'Blog', href: '/blog' },
        { name: 'Guides', href: '/resources' },
        { name: 'Cheatsheets', href: '/resources?type=cheatsheets' },
        { name: 'Ebooks', href: '/resources?type=ebooks' },
      ],
    },
    {
      title: 'Learn',
      links: [
        { name: 'SEO Basics', href: '/blog/seo-basics' },
        { name: 'Keyword Research', href: '/blog/keyword-research' },
        { name: 'Link Building', href: '/blog/link-building' },
        { name: 'Technical SEO', href: '/blog/technical-seo' },
        { name: 'Content Strategy', href: '/blog/content-strategy' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Terms', href: '/terms' },
        { name: 'Privacy', href: '/privacy' },
      ],
    },
  ];

  // Social media links
  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/theseohustler', icon: 'twitter' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/theseohustler', icon: 'linkedin' },
    { name: 'YouTube', href: 'https://youtube.com/theseohustler', icon: 'youtube' },
  ];

  return (
    <footer className="bg-zinc-900 text-zinc-100 pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <svg width="160" height="40" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="100" y="30" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle" fill="#FFDD00">THE SEO HUSTLER</text>
              </svg>
            </Link>
            <p className="mt-4 text-zinc-300 text-sm">
              The SEO Hustler is a resource for anyone trying to learn and execute SEO and organic growth by themselves. Get sh*t done with our free tools, in-depth guides, and resources.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 text-zinc-100 hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.name}
                >
                  {social.icon === 'twitter' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  )}
                  {social.icon === 'linkedin' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  )}
                  {social.icon === 'youtube' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-bold text-primary mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-zinc-300 hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        {/* <div className="mt-12 py-6 border-t border-zinc-800">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-primary mb-2">Subscribe to our newsletter</h3>
            <p className="text-zinc-300 text-sm mb-4">
              Get the latest SEO tips, strategies, and resources delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-md bg-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="px-5 py-2 bg-primary text-primary-foreground font-bold rounded-md shadow-sm hover:shadow-md transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div> */}

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-300 text-sm">
            © {new Date().getFullYear()} The SEO Hustler. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
