import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Premium Todo",
  description: "A premium todo application",
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
        <div className="min-h-screen bg-gradient-to-br from-brand-primary/20 via-brand-secondary/10 to-brand-accent/20 relative overflow-hidden">
          {/* Glassmorphism Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-accent/30 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl" />
          </div>

          {/* Main Content Container */}
          <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-5xl">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
