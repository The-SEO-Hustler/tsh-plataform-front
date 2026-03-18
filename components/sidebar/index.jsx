import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import s from "./style.module.css";
import { useState } from "react";
import { getIconComponent, categoryMap } from "@/lib/config";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
const statusClasses = {
  error:
    "!bg-red-100 dark:!bg-red-700 dark:hover:!bg-red-300 dark:!text-red-300 dark:hover:!text-red-700 !text-red-500 hover:!bg-red-200 ",
  warning:
    "!bg-yellow-100 dark:!bg-yellow-700 dark:hover:!bg-yellow-300 dark:!text-yellow-300 dark:hover:!text-yellow-700 !text-yellow-700 hover:!bg-yellow-200",
  normal: "!bg-card md:!bg-card/70 !hover:bg-card",
};

function Sidebar({
  setFocusedCardId,
  alwaysShowTooltips,
  data,
  statusFilters,
  categoryFilters,
  typeOrder,
}) {
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
        },
      );
      observer.observe(cardEl);
    }
  };

  const handleScrollCategory = (categoryLabel) => {
    const categoryId = `category-${categoryLabel
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()}`;
    const el = document.getElementById(categoryId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Group data by category and sort by the same order as the grid
  const groups = (data || []).length
    ? (() => {
        const result = [];
        const byType = Object.fromEntries(
          (data || []).map((item) => [item.type, item]),
        );

        Object.entries(categoryMap).forEach(([label, types]) => {
          if (categoryFilters && categoryFilters[label] === false) return;

          const cards = types
            .map((t) => byType[t])
            .filter(Boolean)
            .filter((item) => statusFilters[item.status || "normal"])
            .sort((a, b) => {
              const aIdx = typeOrder?.[a.type] ?? Number.MAX_SAFE_INTEGER;
              const bIdx = typeOrder?.[b.type] ?? Number.MAX_SAFE_INTEGER;
              return aIdx - bIdx;
            });
          if (cards.length) {
            result.push({ label, cards });
          }
        });

        return result;
      })()
    : [];

  const buttons = groups.flatMap((group) =>
    group.cards.map((item) => ({
      id: item.type,
      tooltipText: item?.type?.replace(/([A-Z])/g, " $1").trim(),
      Icon: getIconComponent(item?.type),
      status: item.status || "normal",
      category: group.label,
    })),
  );

  // compute prioritizedButtons before rendering the mobile SpeedDial
  const errorWarningButtons = buttons.filter(
    (button) => button.status === "error" || button.status === "warning",
  );

  const normalButtons = buttons.filter(
    (button) => !button.status || button.status === "normal",
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
      <div className=" fixed bottom-0 left-0 block md:hidden w-[100px] h-[100px] z-[9999]">
        <SpeedDial
          ariaLabel="SEO Navigation"
          icon={<SpeedDialIcon />}
          color="primary"
          direction="up"
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,

            zIndex: "2147483647",
          }}
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
              tooltipTitle={button.tooltipText}
              onClick={() => handleFocusCard(button.id)}
            />
          ))}
        </SpeedDial>
      </div>
      <div
        className={`${s.sidebar} [&>*:nth-child(2)]:!border-t-0 [&>*:nth-child(2)]:!pt-0`}
      >
        <GoBackButton alwaysShowTooltips={alwaysShowTooltips} />
        {groups.map((group) => (
          <div
            key={group.label}
            className="mb-4 pt-3 border-t border-foreground/10  first:border-t-0"
          >
            {/* Category button */}
            <SidebarButton
              id={`category-${group.label
                .replace(/[^a-z0-9]+/gi, "-")
                .toLowerCase()}`}
              tooltipText={group.label}
              Icon={getIconComponent(group.cards[0]?.type) || null}
              onFocusCard={() => handleScrollCategory(group.label)}
              status={"normal"}
              alwaysShowTooltips={alwaysShowTooltips}
              variant="category"
            />
            <div className="mt-2 flex flex-col gap-2">
              {group.cards.map((item, idx) => {
                const Icon = getIconComponent(item.type);
                return (
                  <SidebarButton
                    key={`${item.type}-${idx}`}
                    id={item.type}
                    tooltipText={item.type.replace(/([A-Z])/g, " $1").trim()}
                    Icon={Icon}
                    onFocusCard={handleFocusCard}
                    status={item.status || "normal"}
                    alwaysShowTooltips={alwaysShowTooltips}
                    variant="card"
                  />
                );
              })}
            </div>
          </div>
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
  alwaysShowTooltips,
  variant = "card",
}) {
  const [isHovered, setIsHovered] = useState(false);

  const variantClasses =
    variant === "category" ? "border-[1.5px] !border-foreground/30" : "";

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={alwaysShowTooltips || isHovered}>
        <TooltipTrigger asChild>
          <button
            className={`rounded-xl p-3 shadow-sm cursor-pointer border border-foreground/10 ${statusClasses[status]} ${variantClasses}`}
            onClick={() => onFocusCard(id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {Icon}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="select-none" hideWhenDetached>
          <div className="flex items-center gap-2">
            {status === "error" && (
              <span className="w-2 h-2 rounded-full bg-red-500" />
            )}
            {status === "warning" && (
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
            )}

            {status === "normal" && (
              <span className="w-2 h-2 rounded-full bg-green-500" />
            )}
            {tooltipText}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function GoBackButton({ alwaysShowTooltips }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={alwaysShowTooltips || isHovered}>
        <TooltipTrigger asChild>
          <Link
            className={`rounded-xl p-3 shadow-sm border`}
            href="/seo-check"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <ArrowLeft size={20} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="select-none" hideWhenDetached>
          Go Back
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default Sidebar;
