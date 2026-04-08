import HeadingsCard from "@/components/Cards/HeadingsCard";
import LinksCard from "@/components/Cards/LinksCard";
import MetaCard from "@/components/Cards/MetaCard";
import KeywordsCard from "@/components/Cards/KeywordsCard";
import MetaRobotsCard from "@/components/Cards/MetaRobotsCard";
import SitemapCard from "@/components/Cards/SitemapCard";
import TitleCard from "@/components/Cards/TitleCard";
import MetaDescriptionCard from "@/components/Cards/MetaDescriptionCard";
import H1Card from "@/components/Cards/H1Card";
import SocialTagsCard from "@/components/Cards/SocialTagsCard";
import H2TagsCard from "@/components/Cards/H2TagsCard";
import RobotsTxtCard from "@/components/Cards/RobotsTxtCard";
import SitemapCheckCard from "@/components/Cards/SitemapCheckCard";
import BrokenLinksCheckCard from "@/components/Cards/BrokenLinksCheckCard";
import KeywordAnalysisCard from "@/components/Cards/KeywordAnalysisCard";
import ImageAltCard from "@/components/Cards/ImageAltCard";
import SeoUrlCard from "@/components/Cards/SeoUrlCard";
import ImageResponsivenessCard from "@/components/Cards/ImageResponsivenessCard";
import AnalyticsGtmCard from "@/components/Cards/AnalyticsGtmCard";
import FaviconCheckCard from "@/components/Cards/FaviconCheckCard";
import JsErrorsCheckCard from "@/components/Cards/JsErrorsCheckCard";
import HtmlSizeCheckCard from "@/components/Cards/HtmlSizeCheckCard";
import DeprecatedHtmlCard from "@/components/Cards/DeprecatedHtmlCard";
import ConsoleErrorsCheckCard from "@/components/Cards/ConsoleErrorsCheckCard";
import CharsetCheckCard from "@/components/Cards/CharsetCheckCard";
import DomSizeCheckCard from "@/components/Cards/DomSizeCheckCard";
import HtmlCompressionCard from "@/components/Cards/HtmlCompressionCard";
import RequestCountCheckCard from "@/components/Cards/RequestCountCheckCard";
import CacheCheckCard from "@/components/Cards/CacheCheckCard";
import FlashCheckCard from "@/components/Cards/FlashCheckCard";
import CdnCheckCard from "@/components/Cards/CdnCheckCard";
import ModernMediaCard from "@/components/Cards/ModernMediaCard";
import CoreWebVitalsCard from "@/components/Cards/CoreWebVitalsCard";
import StructuredDataCard from "@/components/Cards/StructuredDataCard";
import CanonicalCheckCard from "@/components/Cards/CanonicalCheckCard";
import HreflangCheckCard from "@/components/Cards/HreflangCheckCard";
import RedirectChainCard from "@/components/Cards/RedirectChainCard";
import ContentQualityCard from "@/components/Cards/ContentQualityCard";
import BrokenImagesCard from "@/components/Cards/BrokenImagesCard";
import MobileCheckCard from "@/components/Cards/MobileCheckCard";
import SecurityHeadersCard from "@/components/Cards/SecurityHeadersCard";
import LinkTextQualityCard from "@/components/Cards/LinkTextQualityCard";
import NoJsParityCard from "@/components/Cards/NoJsParityCard";
import {
  FileText,
  Globe,
  Image,
  BarChart,
  Network,
  Terminal,
  CheckCircle,
  XCircle,
  Link,
  Link2,
  Heading1,
  Heading2,
  Share2,
  Map,
  Code,
  Lock,
  Gauge,
  Timer,
  Cpu,
  ArrowLeftRight,
  ListOrdered,
  Database,
  Package,
  Cloud,
  Contrast,
  Link as LinkIcon,
  KeyRound,
  BookOpenCheck,
  Braces,
  Bot,
  Languages,
  Shuffle,
  Unlink,
  Bug,
  ShieldCheck,
  FileType,
  Stamp,
  Ban,
  Paintbrush,
  Ruler,
  Sparkles,
  ImageOff,
  AlertTriangleIcon,
  Component,
  Shield,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import InlineCssCard from "@/components/Cards/InlineCssCard";
import NetworkRequestsCard from "@/components/Cards/NetworkRequestsCard";
import JsExecutionTimeCard from "@/components/Cards/JsExecutionTimeCard";
import SiteLoadingSpeedCard from "@/components/Cards/SiteLoadingSpeedCard";
export const cardComponents = {
  title: TitleCard,
  "network-requests": NetworkRequestsCard,
  "js-execution-time": JsExecutionTimeCard,
  "site-loading-speed": SiteLoadingSpeedCard,
  inlineCss: InlineCssCard,
  headings: HeadingsCard,
  links: LinksCard,
  meta: MetaCard,
  keywords: KeywordsCard,
  metaRobots: MetaRobotsCard,
  sitemap: SitemapCard,
  "meta-description": MetaDescriptionCard,
  h1: H1Card,
  socialTags: SocialTagsCard,
  h2Tags: H2TagsCard,
  robotsTxt: RobotsTxtCard,
  sitemapCheck: SitemapCheckCard,
  brokenLinksCheck: BrokenLinksCheckCard,
  keywordAnalysis: KeywordAnalysisCard,
  "image-alt": ImageAltCard,
  "seo-url": SeoUrlCard,
  "image-responsiveness": ImageResponsivenessCard,
  analyticsGtmCheck: AnalyticsGtmCard,
  htmlSizeCheck: HtmlSizeCheckCard,
  jsErrorsCheck: JsErrorsCheckCard,
  faviconCheck: FaviconCheckCard,
  deprecatedHtml: DeprecatedHtmlCard,
  consoleErrorsCheck: ConsoleErrorsCheckCard,
  charsetCheck: CharsetCheckCard,
  domSizeCheck: DomSizeCheckCard,
  htmlCompression: HtmlCompressionCard,
  requestCountCheck: RequestCountCheckCard,
  cacheCheck: CacheCheckCard,
  flashCheck: FlashCheckCard,
  cdnCheck: CdnCheckCard,
  modernMedia: ModernMediaCard,
  coreWebVitals: CoreWebVitalsCard,
  structuredData: StructuredDataCard,
  canonicalCheck: CanonicalCheckCard,
  hreflangCheck: HreflangCheckCard,
  redirectChain: RedirectChainCard,
  contentQuality: ContentQualityCard,
  brokenImages: BrokenImagesCard,
  mobileCheck: MobileCheckCard,
  securityHeaders: SecurityHeadersCard,
  linkTextQuality: LinkTextQualityCard,
  noJsParity: NoJsParityCard,
};

// Centralized icon mapping
export const iconMapping = {
  // Performance & Speed
  "site-loading-speed": Timer,
  "js-execution-time": Cpu,
  "network-requests": ArrowLeftRight,
  requestCountCheck: ListOrdered,
  cacheCheck: Database,
  htmlCompression: Package,
  cdnCheck: Cloud,
  coreWebVitals: Gauge,
  domSizeCheck: Network,
  htmlSizeCheck: FileText,

  // On-Page SEO & Content
  title: Heading1,
  "meta-description": FileText,
  h1: Heading1,
  h2Tags: Heading2,
  headings: Code,
  keywordAnalysis: KeyRound,
  contentQuality: BookOpenCheck,
  "seo-url": Link2,
  mobileCheck: Smartphone,
  socialTags: Share2,
  linkTextQuality: LinkIcon,

  // Media & Assets
  "image-responsiveness": Ruler,
  modernMedia: Sparkles,
  "image-alt": BookOpenCheck,
  brokenImages: ImageOff,

  // Technical SEO & Architecture
  structuredData: Braces,
  canonicalCheck: Link2,
  hreflangCheck: Languages,
  robotsTxt: Bot,
  sitemapCheck: Map,
  redirectChain: Shuffle,
  brokenLinksCheck: Unlink,

  // Security & Diagnostics
  consoleErrorsCheck: Bug,
  jsErrorsCheck: AlertTriangleIcon,
  securityHeaders: ShieldCheck,
  inlineCss: Paintbrush,
  deprecatedHtml: Ban,
  charsetCheck: FileType,
  faviconCheck: Stamp,
  flashCheck: Ban,
  noJsParity: Contrast,

  // Keep analytics distinct
  analyticsGtmCheck: BarChart,
};

// Helper function to get icon component
export const getIconComponent = (type) => {
  const Icon = iconMapping[type];
  return Icon ? <Icon className="w-5 h-5" /> : <FileText className="w-5 h-5" />;
};

export {
  categoryMap,
  cardCategoryByType,
} from "@/lib/seo-check-category-map";
