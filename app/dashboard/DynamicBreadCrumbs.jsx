"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const DynamicBreadCrumbs = () => {
  const path = usePathname();
  const pathNames = path.split("/").filter((name) => name);
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {pathNames.map((name, index) => {
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {index < pathNames.length - 1 ? (
                  <BreadcrumbLink asChild>
                    <Link href={`/${name}`}>{name.charAt(0).toUpperCase() + name.slice(1)}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{name.charAt(0).toUpperCase() + name.slice(1)}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < pathNames.length - 1 && <BreadcrumbSeparator key={index + 1}></BreadcrumbSeparator>}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadCrumbs;
