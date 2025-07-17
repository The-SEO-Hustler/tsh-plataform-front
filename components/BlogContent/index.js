"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import { LinkedinIcon, Mail, Check, Copy, X, AlignLeft } from "lucide-react";
import HeroTemplate from "@/components/HeroTemplate";
import { toast } from "sonner";
import Image from "next/image";
import { replaceComponents } from "@/lib/replaceComponents";
import TocItem from "@/components/TocItem";
import tocStyle from "@/components/TocItem/TocItem.module.css";
import Container from "@/components/container";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useScrollDirection from "@/components/header/scroll";
// import useStickyTableHeaders from '@/lib/useStickyTableHeaders'

function BlogContentPage({ post, blogPostsData, toc }) {
  const tocRef = useRef(null)
  const mobileTocRef = useRef(null)
  const contentRef = useRef(null)
  const scrollDirection = useScrollDirection();
  const [isTocOpen, setIsTocOpen] = useState(false);

  // Auto-close drawer when TOC item is clicked
  const handleTocItemClick = () => {
    setIsTocOpen(false);
  };

  const handleShare = (platform) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = post.title;

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        // You could add a toast notification here
        toast.success("Link copied to clipboard");
        return;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };
  useEffect(() => {
    const contentElement = contentRef.current;
    const tocElement = tocRef.current;
    const mobileTocElement = mobileTocRef.current;
    const headings = contentElement?.querySelectorAll('h2, h3') ?? [];
    const observerOptions = {
      rootMargin: '0px',
      threshold: 0,
    };
    if (!tocElement) return
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {

        if (entry.isIntersecting) {
          const targetId = entry.target.id;
          const activeLink = tocElement.querySelector(`[href="#${targetId}"]`);
          const mobileActiveLink = mobileTocElement.querySelector(`[href="#${targetId}"]`);
          if (activeLink || mobileActiveLink) {

            tocElement?.querySelectorAll('a')?.forEach(link => link.classList.remove(tocStyle.active));
            mobileTocElement?.querySelectorAll('a')?.forEach(link => link.classList.remove(tocStyle.active));
            activeLink?.classList.add(tocStyle.active);
            mobileActiveLink?.classList.add(tocStyle.active);
          }

        }

      })
    }, observerOptions)

    headings.forEach((heading) => {
      observer.observe(heading);
    })
    return () => {
      headings.forEach((heading) => {
        observer.unobserve(heading)
      })
    }
  }, [toc, tocRef, contentRef, mobileTocRef])
  return (
    <>
      {/* Article Header */}
      <HeroTemplate className="!md:pt-32 !pb-10 !md:pb-10 ">
        <div className="container lg:max-w-4xl mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex md:items-center mb-5 flex-col md:flex-row items-start gap-4">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium">
                {post.category}
              </span>
              <span className=" text-foreground/70 dark:text-foreground/70 flex items-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>

                  {`${post.readTime}  min read`}
                </span>
              </span>
              <span className=" text-foreground/70 dark:text-foreground/70 text-sm">
                {post.date}
              </span>
            </div>

            <h1
              className={`text-3xl md:text-4xl lg:text-5xl font-black !text-foreground dark:!text-foreground mb-6 leading-tight ${styles.title}`}
            >
              {post.title}
            </h1>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-muted dark:bg-foreground/10 flex items-center justify-center overflow-hidden mr-3 relative">
                {post.authorAvatar && (
                  <Image
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-full object-cover h-full "
                    fill
                  />
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <p className="text-foreground dark:text-foreground font-medium">
                  {post.author}
                </p>
                <p className="text-foreground/60 dark:text-foreground/60 text-sm">
                  SEO Consultant & Founder
                </p>
              </div>
            </div>
          </div>
        </div>
      </HeroTemplate>

      <Container>

        <div className="flex flex-col md:flex-row flex-wrap w-full pt-16 max-w-full relative py-12 bg-background">


          {/* Article Content */}
          <section className='flex flex-col md:pr-4 lg:pr-6 w-full md:w-[65%]'>
            <div className="container lg:max-w-4xl mx-auto">
              <div className="max-w-4xl mx-auto">
                {/* Mobile TOC Toggle Button */}
                <div className="md:hidden mb-6">
                  <button
                    onClick={() => setIsTocOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <AlignLeft strokeWidth={1.5} />
                    Table of Contents
                  </button>
                </div>

                {/* Social Sharing */}


                {/* Main Article Content */}
                <article className={`${styles.content} wp-article`} ref={contentRef}>

                  {replaceComponents(post.content)}
                </article>
                {/* {content && <Content html={content} />} */}

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


              </div>
            </div>
          </section>
          {/* Toc */}
          <div className="w-full md:w-[35%] hidden  md:flex flex-col lg:pl-10 xl:items-start xl:pl-20">


            <div className={`${scrollDirection === "up" ? "sticky top-[70px] md:h-[calc(100vh-88px)]" : "sticky top-[8px] md:h-[calc(100vh-18px)]"} transition-all duration-300  overflow-auto`}>

              <h3 className='mb-2 text-lg dark:text-primary text-foreground flex items-center font-semibold'><AlignLeft strokeWidth={1.5} className='mr-1' /> On This Article</h3>
              <ul ref={tocRef}>
                {toc.map(({ id: h2Id, title: h2Title, children, tag }) => (
                  <TocItem h2Id={h2Id} h2Title={h2Title} key={h2Id} tag={tag}>
                    {children}
                  </TocItem>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="fixed xl:right-4 right-4 top-[50%] translate-y-[-50%] hidden md:block">
            <div className="flex flex-col items-center gap-4">
              <Tooltip>

                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleShare("facebook")}
                    className="w-10 h-10 rounded-full bg-card text-foreground border-foreground/20 flex items-center justify-center hover:bg-primary border-2 cursor-pointer hover:text-primary-foreground transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Share on Facebook
                </TooltipContent>

              </Tooltip>

              <Tooltip>

                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-10 h-10 rounded-full bg-card text-foreground border-foreground/20 flex items-center justify-center hover:bg-primary border-2 cursor-pointer hover:text-primary-foreground transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Share on Twitter
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="w-10 h-10 rounded-full bg-card text-foreground border-foreground/20 flex items-center justify-center hover:bg-primary border-2 cursor-pointer hover:text-primary-foreground transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Share on LinkedIn
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleShare("copy")}
                    className="w-10 h-10 rounded-full bg-card text-foreground border-foreground/20 flex items-center justify-center hover:bg-primary border-2 cursor-pointer hover:text-primary-foreground transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Copy Link
                </TooltipContent>
              </Tooltip>

            </div>
          </div>
        </div>
        {/* Author Bio */}
        <div className="mt-12 p-6 bg-card rounded-lg border border-border shadow-sm text-foreground max-w-xl mx-auto">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden mr-4 relative">
              {post.authorAvatar && (
                <Image
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-full object-cover h-full "
                  fill
                />
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <h3
                className={`font-bold text-lg text-foreground ${styles.author}`}
              >
                {post.author}
              </h3>
              <p className="text-muted-foreground">
                SEO Consultant & Founder
              </p>
            </div>
          </div>
          <p className="mt-4 text-foreground">
            Zac is an SEO consultant with over 10 years of experience
            helping businesses achieve measurable growth through search. He
            specializes in technical SEO audits, content strategy, and
            driving e-commerce conversions.
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <a
              href="mailto:zac@theseo.com"
              className="text-foreground hover:text-primary/80"
            >
              <Mail className="text-foreground" />
            </a>
            <a
              href="https://www.linkedin.com/in/zacalmeida/"
              className="text-foreground "
            >
              <LinkedinIcon className="text-foreground" />
            </a>
            <a
              href="https://substack.com/@zacalmeida"
              className="text-foreground fill-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="inherit"
                viewBox="0 0 16 16"
              >
                <path d="M15 3.604H1v1.891h14v-1.89ZM1 7.208V16l7-3.926L15 16V7.208zM15 0H1v1.89h14z" />
              </svg>
            </a>
          </div>
        </div>
        {/* Related Posts */}
        {blogPostsData.length > 0 && (
          <div className="py-16 ">
            <h2 className="text-2xl font-bold mb-6 !text-foreground">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPostsData.map((relatedPost, index) => {
                return (
                  <Link
                    key={index}
                    href={`/blog/${relatedPost.slug}`}
                    className="block group rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-all"
                  >
                    {relatedPost.featuredImage.node.sourceUrl && (
                      <div className="relative h-40 w-full">
                        <Image
                          src={relatedPost.featuredImage.node.sourceUrl}
                          alt={relatedPost.title}
                          className="object-cover"
                          fill
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="!text-lg font-bold mb-2 !text-foreground group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.date && (
                        <div className="flex items-center text-xs !text-muted-foreground">
                          <span>{relatedPost.date}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </Container>

      {/* Mobile TOC Fixed Tip */}
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <button
          onClick={() => setIsTocOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105"
        >
          <AlignLeft strokeWidth={1.5} className="w-4 h-4" />
          <span className="text-sm font-medium">Contents</span>
        </button>
      </div>

      {/* Mobile TOC Bottom Drawer */}
      <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isTocOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsTocOpen(false)}
        />

        {/* Drawer */}
        <div className={`absolute bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-2xl transition-transform duration-300 ${isTocOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          {/* Drawer Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full"></div>
          </div>

          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <AlignLeft strokeWidth={1.5} className="mr-2" />
              On This Article
            </h3>
            <button
              onClick={() => setIsTocOpen(false)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X strokeWidth={1.5} />
            </button>
          </div>

          {/* TOC Content */}
          <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
            <ul ref={mobileTocRef}>
              {toc.map(({ id: h2Id, title: h2Title, children, tag }) => (
                <TocItem
                  h2Id={h2Id}
                  h2Title={h2Title}
                  key={h2Id}
                  tag={tag}
                  onClick={handleTocItemClick}
                >
                  {children}
                </TocItem>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </>
  );
}

export default BlogContentPage;
