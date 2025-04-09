'use client'

import React from 'react'
import s from './styles.module.css'
import { LinkedinIcon, Mail } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
function ResourceContentPage({ post }) {
  // Function to handle social sharing
  const handleShare = (platform) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = post.title;

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        // You could add a toast notification here
        toast.success('Link copied to clipboard');
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <>
      {/* Article Header */}
      <section className="pt-32 pb-10 bg-gradient-to-br from-[#4e503a] to-black relative overflow-hidden">
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

        <div className="container lg:max-w-4xl mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-5">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium">
                {post.category}
              </span>
              <span className="ml-4 text-white/70 flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {post.readTime} min read
              </span>
              <span className="ml-4 text-white/70 text-sm">
                {post.date}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden mr-3 relative">
                {post.authorAvatar && (
                  <Image src={post.authorAvatar} alt={post.author} className="w-full object-cover h-full " fill />
                )}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">
                  {post.author}
                </p>
                <p className="text-white/60 text-sm">
                  SEO Consultant & Founder
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-background">
        <div className="container lg:max-w-4xl mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* Social Sharing */}
            <div className="sticky top-24 float-left -ml-16 hidden lg:block">
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary cursor-pointer hover:text-primary-foreground transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary cursor-pointer hover:text-primary-foreground transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary cursor-pointer hover:text-primary-foreground transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary cursor-pointer hover:text-primary-foreground transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Main Article Content */}
            <article className={`${s.content}`}>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-border/10">
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded-md text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-12 p-6 bg-background rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden mr-4 relative">
                  {post.authorAvatar && (
                    <Image src={post.authorAvatar} alt={post.author} className="w-full object-cover h-full " fill />
                  )}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{post.author}</h3>
                  <p className="text-muted-foreground">SEO Consultant & Founder</p>
                </div>
              </div>
              <p className="mt-4 text-foreground">
                Zac is an SEO consultant with over 10 years of experience helping businesses achieve measurable growth through search. He specializes in technical SEO audits, content strategy, and driving e-commerce conversions.
              </p>
              <div className="mt-4 flex items-center space-x-4">
                <a href="mailto:zac@theseo.com" className="text-primary hover:text-primary/80">
                  <Mail />
                </a>
                <a href="https://www.linkedin.com/in/zacalmeida/" className="text-primary hover:text-primary/80">
                  <LinkedinIcon />
                </a>
                <a href="https://substack.com/@zacalmeida" className=" text-primary hover:text-primary/80">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15 3.604H1v1.891h14v-1.89ZM1 7.208V16l7-3.926L15 16V7.208zM15 0H1v1.89h14z" />
                  </svg>
                </a>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-primary-foreground">
              Get SEO Tips Delivered to Your Inbox
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/80">
              Subscribe to our newsletter to receive the latest SEO strategies, tips, and industry insights.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                required
              />
              <Button
                variant="secondary"
                size="lg"
                type="submit"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                Subscribe
              </Button>
            </form>
            <p className="mt-4 text-sm text-primary-foreground/60">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section> */}
    </>
  )
}

export default ResourceContentPage