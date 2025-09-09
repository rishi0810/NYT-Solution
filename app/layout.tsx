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
  title: {
    default: "NYT Solutions",
    template: "%s | NYT Solutions",
  },
  description: "A collection of solutions to New York Times puzzles.",
  openGraph: {
    title: "NYT Solutions",
    description: "Server-rendered solutions to New York Times puzzles (Wordle, Sudoku, Strands, Connections, Letterboxd).",
    url: "https://example.com/",
    siteName: "NYT Solutions",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "NYT Solutions",
    description: "Server-rendered solutions to New York Times puzzles.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Small JSON-LD structured data to help crawlers
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NYT Solutions",
    url: "https://example.com/",
    description: "A small site showing solutions for NYT puzzles rendered server-side for privacy.",
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="canonical" href="https://example.com/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
