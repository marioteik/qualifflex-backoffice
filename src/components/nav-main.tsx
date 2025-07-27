import { ChevronRight, type LucideIcon } from "lucide-react";
import { useEffect, useState, useRef, useLayoutEffect } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { Badge } from "./ui/badge";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    hasNewMessages?: boolean;
    items?: {
      title: string;
      url: string;
      badge?: number;
    }[];
  }[];
}) {
  const location = useLocation();
  const firstPath = `${location.pathname}`
    .replace(/\//g, " ")
    .trim()
    .split(" ")[0];

  // State to track previous badge values and green state
  const [greenBadges, setGreenBadges] = useState<Record<string, boolean>>({});
  const previousBadgesRef = useRef<Record<string, number>>({});
  const isMounting = useRef(true);

  // Use layout effect to mark mounting phase complete after initial render
  useLayoutEffect(() => {
    // Give it a tick to allow initial data to load
    const timer = setTimeout(() => {
      isMounting.current = false;
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Reset green state on mount to ensure clean slate on page refresh
  useEffect(() => {
    setGreenBadges({});
    previousBadgesRef.current = {};
  }, []);

  // Effect to detect badge changes
  useEffect(() => {
    // Skip any processing during mounting phase
    if (isMounting.current) {
      return;
    }

    const currentBadges: Record<string, number> = {};

    items.forEach((item) => {
      if (item.items) {
        item.items.forEach((subItem) => {
          if (subItem.badge !== undefined) {
            currentBadges[subItem.url] = subItem.badge;
          }
        });
      }
    });

    // If we have no previous badges stored, this is initialization - just store current values
    if (Object.keys(previousBadgesRef.current).length === 0) {
      previousBadgesRef.current = { ...currentBadges };
      return;
    }

    // Check for changes only if we have previous badges to compare against
    Object.keys(currentBadges).forEach((url) => {
      const currentValue = currentBadges[url];
      const previousValue = previousBadgesRef.current[url];

      // Only trigger green if we had a previous value and the current value is bigger
      if (previousValue !== undefined && currentValue > previousValue) {
        setGreenBadges((prev) => ({ ...prev, [url]: true }));
      }
    });

    // Update the ref with current values
    previousBadgesRef.current = { ...currentBadges };
  }, [items]);

  // Handle link click to remove green state
  const handleLinkClick = (url: string) => {
    setGreenBadges((prev) => ({ ...prev, [url]: false }));
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Remessas</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const itemFirstPath = `${item.url}`
            .replace(/\//g, " ")
            .trim()
            .split(" ")[0];

          return item.items ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={firstPath === itemFirstPath}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={firstPath === itemFirstPath}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="mr-0 pr-0">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className="text-foreground/70 flex justify-between whitespace-nowrap"
                        >
                          <NavLink
                            to={subItem.url}
                            onClick={() => handleLinkClick(subItem.url)}
                          >
                            <span>{subItem.title}</span>
                            {subItem.badge ? (
                              <Badge
                                variant="outline"
                                className={`text-xs font-mono transition-all duration-300 ${
                                  greenBadges[subItem.url]
                                    ? "border-green-500 bg-green-50 text-green-700"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {subItem.badge}
                              </Badge>
                            ) : null}
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                className={`transition-all duration-300 ${
                  item.hasNewMessages
                    ? "bg-green-500/20 after:content-[''] after:absolute after:top-1/2 after:-mt-1 after:right-3 after:w-2 after:h-2 after:bg-green-500 after:rounded-full"
                    : ""
                }`}
              >
                <NavLink to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
