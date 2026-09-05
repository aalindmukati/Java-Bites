import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://java-bites.vercel.app"),
  applicationName: "Java Bites",

  title: {
    default: "Java Bites",
    template: "%s | Java Bites",
  },

  description:
    "Discover menus, reviews, ratings, and budget-friendly food vendors across the SRMIST food court.",

  keywords: [
    "Java Bites",
    "SRM food court",
    "SRMIST food",
    "SRM vendors",
    "college food",
    "food court menus",
    "SRM KTR food",
    "restaurant reviews",
  ],

  authors: [
    {
      name: "Aalind Mukati",
    },
  ],

  creator: "Aalind Mukati",

  openGraph: {
    title: "Java Bites",
    description:
      "Browse SRMIST food court vendors, menus, ratings, and budget-friendly meals.",
    url: "https://java-bites.vercel.app",
    siteName: "Java Bites",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Java Bites",
      },
    ],

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Java Bites",
    description:
      "Discover menus, reviews, and vendors across the SRMIST food court.",
    images: ["/og-image.png"],
  },

  verification: {
    google: "Bzt6fPEFDoV75rsXu-JNJk8RVfOIw_tf9RFH1DuKLBM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-G6RHQLXCTB" />
    </html>
  );
}