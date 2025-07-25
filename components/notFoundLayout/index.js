// 'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFoundLayout() {
  // const [email, setEmail] = useState('');

  // const handleEmailChange = (e) => {
  //   setEmail(e.target.value);
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // In a real app, this would subscribe the user to a newsletter
  //   setEmail('');
  //   alert('Thanks for subscribing! We\'ll send you SEO tips and updates.');
  // };

  // Helpful links for users who are lost
  const helpfulLinks = [
    {
      title: 'Free SEO Tools',
      description: 'Boost your rankings with our no-BS tools',
      link: '/free-tools',
    },
    {
      title: 'SEO Blog',
      description: 'Actionable SEO tips that actually work',
      link: '/blog',
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-[#4e503a] to-black text-white">
        {/* 404 Hero Section */}
        <section className="pt-40 pb-20 relative overflow-hidden">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFDD00" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* 404 Status */}
              <div className="inline-flex items-center justify-center bg-primary text-primary-foreground font-black text-7xl 
                              w-40 h-40 rounded-full mb-8 shadow-lg rotate-3">
                404
              </div>

              <h1 className="text-5xl md:text-6xl font-black mb-6">
                PAGE <span className="text-primary">NOT</span> FOUND
              </h1>

              <p className="text-xl mb-8 text-white/80">
                Well, sh*t happens. The page you&apos;re looking for doesn&apos;t exist or has been moved.
                But don&apos;t worry, we&apos;ve got plenty of other valuable SEO resources to help you rank higher.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href="/">
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90"
                  >
                    Go to Homepage
                  </Button>
                </Link>

                <Link href="/free-tools">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white cursor-pointer text-white hover:bg-white/10"
                  >
                    Try Free SEO Tools
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Helpful Resources Section */}
        <section className="pb-20 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Get Back on <span className="text-primary">Track</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {helpfulLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.link}
                  className="block group p-6 bg-white/5 hover:bg-white/10 border-2 border-primary/20 hover:border-primary 
                          rounded-lg transition-all h-full"
                >
                  <h3 className="text-xl font-bold mb-2 text-primary">{link.title}</h3>
                  <p className="text-white/70 mb-4">{link.description}</p>
                  <div className="flex items-center text-primary font-medium">
                    Explore
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Terminal-Style Error Message - Fun Element */}
        <section className="pb-32 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-black border border-primary/30 rounded-lg p-6 font-mono text-sm">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-white/50 text-xs">terminal</span>
                </div>

                <div className="text-green-400">$ find -name &quot;page-you-requested.html&quot;</div>
                <div className="text-white mb-2">find: No matches found</div>

                <div className="text-green-400">$ run seo-hustler-rescue-command</div>
                <div className="text-white mb-2">
                  Running emergency SEO rescue... <br />
                  Analyzing alternative paths... <br />
                  <span className="text-primary">Recommended action: Navigate to homepage or explore existing resources</span>
                </div>

                <div className="text-green-400">$ echo &quot;Don&apos;t worry, we&apos;ve got your back!&quot;</div>
                <div className="text-white">Don&apos;t worry, we&apos;ve got your back!</div>

                <div className="mt-4 flex items-center">
                  <div className="w-2 h-5 bg-primary animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}