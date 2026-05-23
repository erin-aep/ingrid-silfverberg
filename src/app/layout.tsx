import type { Metadata } from "next";
import { Instrument_Serif, Space_Mono } from "next/font/google";
import { CustomCursor } from "@/components/layout/CustomCursor";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ingrid silfverberg — motion artist",
  description:
    "Multidisciplinary artist portfolio — motion design, branding, film, UI/UX, and marketing.",
  openGraph: {
    title: "ingrid silfverberg — motion artist",
    description: "Turning vision into motion.",
    type: "website",
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
      className={`${instrumentSerif.variable} ${spaceMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen antialiased">
        <CustomCursor />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:rounded focus:bg-chrome2 focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
