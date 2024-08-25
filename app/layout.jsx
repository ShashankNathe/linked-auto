import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LinkedAuto",
  description: "Manage your LinkedIn posts with ease",
  image: "/logo.png",
  type: "website",
  site_name: "LinkedAuto",
  locale: "en_US",
  robots: "follow, index",
  keywords: "linkedin, social media, posts, schedule, linkedin posts",
  openGraph: {
    title: "LinkedAuto",
    description: "Manage your LinkedIn posts with ease",
    url: "https://linked-auto.vercel.app",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 390,
        height: 441,
        alt: "LinkedAuto Logo",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <TooltipProvider>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </TooltipProvider>
    </html>
  );
}
