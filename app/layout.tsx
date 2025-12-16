import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./AppProviders";

export const metadata: Metadata = {
  title: "Nerdcave - Links",
  description: "Your one-stop destination for all Nerdcave links and content",
  keywords: ["nerdcave", "links", "social media", "tech", "gaming"],
  authors: [{ name: "Nerdcave" }],
  openGraph: {
    title: "Nerdcave - Links",
    description: "Your one-stop destination for all Nerdcave links and content",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
