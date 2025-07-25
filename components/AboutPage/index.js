import { Button } from '@/components/ui/button';
import FeatureSection from '@/components/FeatureSection';
import Container from '@/components/container';
import CountUpSection from '@/components/CountUp';
export default function About() {
  // Values data
  const values = [
    {
      title: 'Results, Not Theory',
      description: 'If we haven\'t tested it, we don\'t teach it. Everything we share has been battle-tested in the trenches across industries from e-commerce to SaaS to local businesses. We\'re not interested in theory - we\'re obsessed with what actually moves the needle.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
    },
    {
      title: 'No Gatekeeping',
      description: 'Not using our free SEO tools in 2025 is like owning a restaurant and forgetting to put a sign outside. While others hide their "secrets" behind paywalls, we give away 90% of our knowledge through our toolkits, guides, and resources.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      title: 'Full-Stack Strategy',
      description: 'The AI search revolution isn\'t coming - it\'s already here. We integrate technical excellence, user experience, and cutting-edge AI innovations (like RAG and GAIO) to build sustainable organic growth that compounds over time.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20V10"></path>
          <path d="M18 20V4"></path>
          <path d="M6 20v-4"></path>
        </svg>
      ),
    },
  ];

  // Success metrics
  const metrics = [
    { number: '$100M+', label: 'In Generated Organic Revenue' },
    { number: '15+', label: 'Years of Enterprise Experience' },
    { number: '20K+', label: 'SEO Hustlers Getting Results' },
    { number: '90%', label: 'Of Our Knowledge Freely Available' },
  ];

  // How we can help categories
  const helpCategories = [
    {
      title: 'Free SEO Tools',
      description: 'Access professional-grade tools that help you research, analyze, and optimize without spending a dime. From our On-Page SEO Checker to comprehensive keyword research tools, we\'ve got you covered.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"></path>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"></path>
        </svg>
      ),
    },
    {
      title: 'In-Depth Guides',
      description: 'Cut through the noise with actionable guides on everything from technical SEO to content creation. No fluff, no jargon - just step-by-step instructions you can implement today.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
    },
    {
      title: 'Premium Resources',
      description: 'For those ready to accelerate their results, our flagship training programs and premium resources deliver enterprise-level strategies in a format anyone can execute.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      ),
    },
  ];

  return (
    <div className="overflow-hidden">



      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#4e503a] to-black relative overflow-hidden">
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

        <Container className=" text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white dark:text-foreground mb-6">
            We Cut Through the <span className="text-primary">BS</span> So You Can <span className="text-primary">Dominate Search</span>
          </h1>
          <p className="text-xl text-white/90 dark:text-foreground/90 mb-8 max-w-3xl mx-auto">
            Look, the SEO world is full of smoke and mirrors. We&apos;re not about that life.
          </p>
        </Container>
      </section>

      {/* Intro Section with Bold Statement */}
      <section className="py-16  bg-[#ffcc00]">
        <Container className="overflow-hidden !py-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-8 transform -rotate-1 shadow-lg animate-float">
              <div className="transform rotate-1">
                <p className="text-xl md:text-2xl font-bold mb-6 leading-relaxed">
                  Agencies charging $5K/month for &quot;proprietary strategies&quot; that are really just basic backlinks and keyword stuffing. Gurus peddling courses that teach outdated tactics. And a whole lot of people who talk big but can&apos;t actually move the needle on traffic or revenue.
                </p>
                <p className="text-xl md:text-2xl font-black text-primary">
                  We&apos;re not about that life.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Origin Story Section */}
      <FeatureSection >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">We&apos;ve Been in the Trenches</h2>
            <div className="space-y-6">
              <p className="text-lg">
                Back when I was hustling websites on Fiverr for $50 a pop, I learned the hard way how brutal the search game can be. One Google update wiped out six months of work overnight. That&apos;s when I stopped following the &quot;experts&quot; and started testing everything myself.
              </p>
              <p className="text-lg">
                Fifteen years and $100M+ in generated organic revenue later, here we are.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 rounded-md transform md:animate-rotate"></div>
            <div className="relative bg-foreground md:animate-float rounded-md shadow-md overflow-hidden p-8 text-background">
              <h3 className="font-black text-2xl mb-4 text-primary">Who We Are</h3>
              <p className="mb-4">
                The SEO Hustler was founded by Zac Almeida, a search veteran with 15+ years of enterprise experience who&apos;s seen every algorithm update, AI breakthrough, and industry shift you can imagine. After helping enterprise clients and scrappy startups alike turn complex SEO challenges into growth engines, one thing became clear:
              </p>
              <p className="font-bold text-xl">
                Most businesses are drowning in SEO information but starving for real results.
              </p>
              <p className="mt-4">
                That&apos;s why TSH exists. We&apos;re on a mission to democratize no-BS search strategies for everyone from solopreneurs to in-house teams at established brands.
              </p>
            </div>
          </div>
        </div>
      </FeatureSection>

      {/* What We're About Section */}
      <section className="py-20 bg-gray-200 dark:bg-background/70">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">What We&apos;re About</h2>
            <p className="text-xl text-on-surface-variant">
              These core principles guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-lg p-8 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-2 flex-col md:flex-row justify-center mb-4">
                  {index === 0 && <span className="text-primary text-2xl">🔥</span>}
                  {index === 1 && <span className="text-primary text-2xl">🚫</span>}
                  {index === 2 && <span className="text-primary text-2xl">🧠</span>}
                  <h3 className="text-2xl font-bold">
                    {value.title}
                  </h3>
                </div>
                <p className="text-on-surface-variant">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* No-BS Philosophy */}
      <FeatureSection>
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-6">Our No-BS Philosophy</h2>
          <p className="text-xl text-on-surface-variant max-w-3xl mx-auto mb-12">
            We believe in three things:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div className="h-2 bg-primary"></div>
            <div className="p-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6 text-primary text-3xl font-bold">
                1
              </div>
              <p className="text-lg font-semibold leading-relaxed">
                Business owners shouldn&apos;t need a PhD in computer science to understand SEO
              </p>
            </div>
          </div>

          <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div className="h-2 bg-primary"></div>
            <div className="p-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6 text-primary text-3xl font-bold">
                2
              </div>
              <p className="text-lg font-semibold leading-relaxed">
                The tools to dominate search should be accessible to everyone, not just big agencies
              </p>
            </div>
          </div>

          <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div className="h-2 bg-primary"></div>
            <div className="p-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6 text-primary text-3xl font-bold">
                3
              </div>
              <p className="text-lg font-semibold leading-relaxed">
                If advice doesn&apos;t lead to actual traffic, rankings, or revenue growth, it&apos;s just hot air
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-xl font-bold text-primary">
            The tools are free. The playing field is wide open. What&apos;s your excuse?
          </p>
        </div>
      </FeatureSection>

      {/* Success Metrics Section */}
      <CountUpSection metrics={metrics} />

      {/* How We Can Help You Win */}
      <FeatureSection>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">How We Can Help You Win</h2>
          <p className="text-xl text-on-surface-variant max-w-3xl mx-auto">
            Our ecosystem is designed to meet you wherever you are on your search journey:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-10">
          {helpCategories.map((category, index) => (
            <div
              key={index}
              className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center">
                <div className="p-6">
                  {category.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-3">{category.title}</h3>
                <p className="text-on-surface-variant">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </FeatureSection>

      {/* Real Talk Section */}
      <section className="py-16 bg-black text-white dark:text-foreground">
        <Container>
          <div className="max-w-4xl mx-auto ">
            <div className="bg-[#333] p-8 rounded-lg transform rotate-1 shadow-md overflow-hidden">
              <div className="transform -rotate-1">
                <h2 className="text-3xl font-black mb-6 dark:text-foreground">Real Talk: This Isn&apos;t For Everyone</h2>
                <div className="space-y-4 text-lg">
                  <p>
                    Let&apos;s be real — no one&apos;s reading a 1,500-word blog post about alt text unless it&apos;s helping them rank or save time.
                  </p>
                  <p>
                    We don&apos;t sugar-coat things. We&apos;ll tell you when your website looks like it was built in 2010 (because it probably was). We&apos;ll call out when your content reads like AI garbage. And we&apos;ll definitely let you know if you&apos;re wasting time on tactics that stopped working years ago.
                  </p>
                  <p>
                    If you want gentle pats on the back and validation, there are plenty of &quot;gurus&quot; who&apos;ll take your money for that.
                  </p>
                  <p className="font-bold">
                    But if you want someone who&apos;ll help you cut through the BS and actually grow your organic traffic? You&apos;re in the right place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Call To Action Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-on-primary-container">
              Ready to Stop Wondering and Start Winning?
            </h2>
            <p className="text-xl mb-10 text-on-primary-container/80">
              Ignore local SEO and your competitor down the street will keep eating your lunch — and your leads.
            </p>
            <p className="text-lg mb-10 font-bold text-on-primary-container">
              The choice is yours: Keep trying random tactics you found on YouTube, or start building a systematic approach to dominating search in your niche.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <Button size="lg" href="/free-tools" variant="ghost">
                Start With Our Free Tools
              </Button>
              <Button variant="secondary" size="lg" href="/resources">
                Join 20K+ SEO Hustlers
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}