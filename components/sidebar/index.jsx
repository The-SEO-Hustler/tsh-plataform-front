// components/Sidebar.js
import React from "react";
import { Tag, Tags, Bookmark } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import s from "./style.module.css";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
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
      id: "title",
      tooltip: "Title",
      Icon: <Tag strokeWidth={1.5} />,
    },
    {
      id: "description",
      tooltip: "Description",
      Icon: <Tags strokeWidth={1.5} />,
    },
    {
      id: "keywords",
      tooltip: "Keywords",
      Icon: <Bookmark strokeWidth={1.5} />,
    },

    { id: "title", tooltip: "Title", Icon: <Tag strokeWidth={1.5} /> },
    {
      id: "description",
      tooltip: "Description",
      Icon: <Tags strokeWidth={1.5} />,
    },
    {
      id: "keywords",
      tooltip: "Keywords",
      Icon: <Bookmark strokeWidth={1.5} />,
    },

    { id: "title", tooltip: "Title", Icon: <Tag strokeWidth={1.5} /> },
    {
      id: "description",
      tooltip: "Description",
      Icon: <Tags strokeWidth={1.5} />,
    },
    {
      id: "keywords",
      tooltip: "Keywords",
      Icon: <Bookmark strokeWidth={1.5} />,
    },

    { id: "title", tooltip: "Title", Icon: <Tag strokeWidth={1.5} /> },
    {
      id: "description",
      tooltip: "Description",
      Icon: <Tags strokeWidth={1.5} />,
    },
    {
      id: "keywords",
      tooltip: "Keywords",
      Icon: <Bookmark strokeWidth={1.5} />,
    },

    { id: "title", tooltip: "Title", Icon: <Tag strokeWidth={1.5} /> },
    {
      id: "description",
      tooltip: "Description",
      Icon: <Tags strokeWidth={1.5} />,
    },
    {
      id: "keywords",
      tooltip: "Keywords",
      Icon: <Bookmark strokeWidth={1.5} />,
    },
    // Add additional button data here...
  ];

  return (
    <div>
      <div className="md:hidden fixed bottom-0 right-0">
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          icon={<SpeedDialIcon />}
          direction="up"
          sx={{ position: "absolute", top: 0, left: 0 }}
        >
          {buttons.slice(0, 6).map((button, id) => (
            <SpeedDialAction
              key={`${button.id}-${id}`}
              icon={button.Icon}
              tooltipTitle={button.title}
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
          />
        ))}
      </div>
    </div>
  );
}

function SidebarButton({ id, tooltipText, Icon, onFocusCard }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="rounded-full p-3 bg-[#ffffff90]"
            onClick={() => onFocusCard(id)}
          >
            {Icon}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div>{tooltipText}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default Sidebar;
