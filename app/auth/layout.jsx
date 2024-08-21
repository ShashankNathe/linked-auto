import React from "react";
import Link from "next/link";
import { Linkedin } from "lucide-react";
const layout = ({ children }) => {
  return (
    <div>
      <div>
        <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">Linked Auto</span>
              </Link>
            </nav>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
              <div className="ml-auto flex-1 sm:flex-initial"></div>
              <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link href="/auth/login" className="text-muted-foreground transition-colors hover:text-foreground">
                  Login
                </Link>
                <Link href="/auth/register" className="text-muted-foreground transition-colors hover:text-foreground">
                  Register
                </Link>
              </nav>
            </div>
          </header>
          <div className="flex-1 flex items-center justify-center flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default layout;