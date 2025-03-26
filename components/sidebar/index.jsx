import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import {
  DollarSign,
  Globe,
  ImageIcon,
  Lock,
  Server,
  Share2,
  Gauge,
  Code,
} from "lucide-react";
import s from "./style.module.css";
const statusClasses = {
  error: "!bg-red-100 !text-red-500 hover:!bg-red-200",
  warning: "!bg-yellow-100 !text-yellow-700 hover:!bg-yellow-200",
  normal: "!bg-white/90 !hover:bg-white",
};

function Sidebar({ setFocusedCardId }) {
  const handleFocusCard = (id) => {
    setFocusedCardId(id);
    const cardEl = document.getElementById(id);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setFocusedCardId(null);
              }, 1000);
              observer.disconnect();
            }
          });
        },
        {
          threshold: 0.8,
        }
      );
      observer.observe(cardEl);
    }
  };

  const buttons = [
    {
      id: "headings",
      tooltip: "Heading Structure",
      Icon: <Code strokeWidth={1.5} />,
      status: "normal",
    },
    {
      id: "links",
      tooltip: "Links Distribution",
      Icon: <Share2 strokeWidth={1.5} />,
      status: "warning",
    },
    {
      id: "meta",
      tooltip: "Meta Information",
      Icon: <Globe strokeWidth={1.5} />,
      status: "error",
    },
    {
      id: "keywords",
      tooltip: "Top Keywords",
      Icon: <Gauge strokeWidth={1.5} />,
      status: "normal",
    },
    {
      id: "metaRobots",
      tooltip: "Meta Robots / Directives",
      Icon: <Lock strokeWidth={1.5} />,
      status: "normal",
    },
    {
      id: "sitemap",
      tooltip: "Sitemap Presence",
      Icon: <Server strokeWidth={1.5} />,
      status: "normal",
    },
    {
      id: "socialTags",
      tooltip: "Social Tags",
      Icon: <ImageIcon strokeWidth={1.5} />,
      status: "normal",
    },
    {
      id: "searchPreview",
      tooltip: "Google Search Preview",
      Icon: <Globe strokeWidth={1.5} />,
      status: "normal",
    },
    {
      id: "keywordDensity",
      tooltip: "Keyword Density",
      Icon: <Gauge strokeWidth={1.5} />,
      status: "normal",
    },
    {
      id: "competitors",
      tooltip: "Competitor Domains",
      Icon: <DollarSign strokeWidth={1.5} />,
      status: "normal",
    },
    {
      id: "urlStructure",
      tooltip: "URL Structure",
      Icon: <Globe strokeWidth={1.5} />,
      status: "normal",
    },
    {
      id: "imageAnalysis",
      tooltip: "Image Analysis",
      Icon: <ImageIcon strokeWidth={1.5} />,
      status: "normal",
    },
    {
      id: "inlineCSS",
      tooltip: "Inline CSS / Deprecated Tags",
      Icon: <Code strokeWidth={1.5} />,
      status: "normal",
    },
    {
      id: "gaTracking",
      tooltip: "Analytics & Tracking",
      Icon: <Server strokeWidth={1.5} />,
      status: "normal",
    },
    {
      id: "favicon",
      tooltip: "Favicon",
      Icon: <Globe strokeWidth={1.5} />,
      status: "normal",
    },
  ];

  // compute prioritizedButtons before rendering the mobile SpeedDial
  const errorWarningButtons = buttons.filter(
    (button) => button.status === "error" || button.status === "warning"
  );

  const normalButtons = buttons.filter(
    (button) => !button.status || button.status === "normal"
  );

  let prioritizedButtons = [];
  if (errorWarningButtons.length >= 6) {
    prioritizedButtons = errorWarningButtons.slice(0, 6);
  } else {
    prioritizedButtons = [
      ...errorWarningButtons,
      ...normalButtons.slice(0, 6 - errorWarningButtons.length),
    ];
  }

  return (
    <>
      <div className="md:hidden fixed bottom-0 right-0">
        <SpeedDial
          ariaLabel="SEO Navigation"
          icon={<SpeedDialIcon />}
          direction="up"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
        >
          {prioritizedButtons.map((button, id) => (
            <SpeedDialAction
              key={`${button.id}-${id}`}
              icon={button.Icon}
              classes={statusClasses[button.status] || ""}
              slotProps={{
                fab: {
                  className: statusClasses[button.status] || "",
                },
              }}
              tooltipTitle={button.tooltip}
              onClick={() => handleFocusCard(button.id)}
            />
          ))}
        </SpeedDial>
      </div>
      <div className={s.sidebar}>
        {buttons.map((btn, id) => (
          <SidebarButton
            key={`${btn.id}-${id}`}
            id={btn.id}
            tooltipText={btn.tooltip}
            Icon={btn.Icon}
            onFocusCard={handleFocusCard}
            status={btn.status}
          />
        ))}
      </div>
    </>
  );
}

function SidebarButton({
  id,
  tooltipText,
  Icon,
  onFocusCard,
  status = "success",
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`rounded-full p-3 shadow-sm ${statusClasses[status]}`}
            onClick={() => onFocusCard(id)}
          >
            {Icon}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="flex items-center gap-2">
            {status === "error" && (
              <span className="w-2 h-2 rounded-full bg-red-500" />
            )}
            {status === "warning" && (
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
            )}
            {tooltipText}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default Sidebar;
