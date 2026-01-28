import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Premium Todo - 프리미엄 할 일 관리",
  description: "Next.js 15, shadcn/ui, Framer Motion으로 만든 프리미엄 할 일 관리 애플리케이션",
  keywords: ["todo", "할일", "task", "productivity", "next.js", "react"],
  authors: [{ name: "Premium Todo Team" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gradient-to-br from-brand-primary/20 via-brand-secondary/10 to-brand-accent/20 dark:from-brand-primary/10 dark:via-brand-secondary/5 dark:to-brand-accent/10 relative overflow-hidden">
            {/* Glassmorphism Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/30 dark:bg-brand-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-accent/30 dark:bg-brand-accent/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-secondary/20 dark:bg-brand-secondary/10 rounded-full blur-3xl" />
            </div>

            {/* Main Content Container */}
            <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
              <div className="w-full max-w-5xl">
                {children}
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
