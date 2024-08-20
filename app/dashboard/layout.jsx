import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  Linkedin,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  User,
  Users2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ThemeBtn from "./ThemeBtn";
import DynamicBreadCrumbs from "./DynamicBreadCrumbs";
import DynamicSideIcons from "./DynamicSideIcons";
import { redirect } from "next/navigation";
// import { logout } from "../actions/authActions";

const layout = ({ children }) => {
  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.ok) {
      // router.push("/auth/login");
      redirect("/auth/login");
    } else {
      setError(data.message);
    }
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Linkedin className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">LinkedAuto</span>
          </Link>
          <DynamicSideIcons />
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <div className="h-10"></div>
                {/* <Link
                  href="/dashboard"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">LinkedAuto</span>
                </Link> */}
                <Link href="/" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link href="/dashboard/profile" className="flex items-center gap-4 px-2.5 text-foreground">
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                <Link href="/dashboard/schedule" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                  <CalendarCheck className="h-5 w-5" />
                  Schedule
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <DynamicBreadCrumbs />
          <div className="relative ml-auto flex-1 md:grow-0">
            <ThemeBtn />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                <Settings />
                {/* <Image src="/placeholder-user.jpg" width={36} height={36} alt="Avatar" className="overflow-hidden rounded-full" /> */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/dashboard/profile">Settings</Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem>Support</DropdownMenuItem> */}
              <DropdownMenuSeparator />
              {/* <form action={logout}> */}
              {/* <Button> */}
              <DropdownMenuItem>Logout</DropdownMenuItem>
              {/* </Button> */}
              {/* </form> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {children}
      </div>
    </div>
  );
};

export default layout;
