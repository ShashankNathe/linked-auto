"use client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarCheck, Home, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const DynamicSideIcons = () => {
  const path = usePathname();
  const pathObj = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icons: <Home />,
      isActive: path == "/dashboard" ? true : false,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icons: <User />,
      isActive: path == "/dashboard/profile" ? true : false,
    },
    {
      name: "Schedule",
      path: "/dashboard/schedule",
      icons: <CalendarCheck />,
      isActive: path == "/dashboard/schedule" ? true : false,
    },
  ];
  return (
    <>
      {pathObj.map((item, index) => {
        return (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Link
                href={item.path}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  item.isActive ? "bg-accent" : ""
                }`}
              >
                {item.icons}
                <span className="sr-only">{item.name}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{item.name}</TooltipContent>
          </Tooltip>
        );
      })}
    </>
  );
};

export default DynamicSideIcons;
