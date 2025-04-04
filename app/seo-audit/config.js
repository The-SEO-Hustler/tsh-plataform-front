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
  Heading1,
  Heading2,
  Share2,
  Map,
  Code,
  Lock,
  Gauge,
  AlertTriangleIcon,
  Component,
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
};

// Centralized icon mapping
export const iconMapping = {
  title: FileText,
  inlineCss: Code,
  "site-loading-speed": Gauge,
  "js-execution-time": Gauge,
  "network-requests": Network,
  "meta-description": FileText,
  h1: Heading1,
  socialTags: Share2,
  headings: Code,
  h2Tags: Heading2,
  robotsTxt: Lock,
  sitemapCheck: Map,
  brokenLinksCheck: Link,
  keywordAnalysis: Gauge,
  "image-alt": Image,
  "seo-url": Globe,
  "image-responsiveness": Image,
  analyticsGtmCheck: BarChart,
  faviconCheck: Image,
  jsErrorsCheck: AlertTriangleIcon,
  consoleErrorsCheck: Terminal,
  charsetCheck: FileText,
  htmlSizeCheck: FileText,
  domSizeCheck: Network,
  htmlCompression: Component,
  requestCountCheck: Network,
  cacheCheck: CheckCircle,
  flashCheck: XCircle,
  cdnCheck: Network,
  modernMedia: Image,
};

// Helper function to get icon component
export const getIconComponent = (type) => {
  const Icon = iconMapping[type];
  return Icon ? <Icon className="w-5 h-5" /> : <FileText className="w-5 h-5" />;
};

