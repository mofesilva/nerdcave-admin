import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./AppProviders";

export const metadata: Metadata = {
  title: "Nerdcave Studio",
  description: "Seu hub de conteúdo sobre Games!",
  keywords: ["nerdcave", "links", "social media", "tech", "gaming"],
  authors: [{ name: "Moisés Ferreira e Silva" }],
  openGraph: {
    title: "Nerdcave Studio",
    description: "Seu hub de conteúdo sobre Games!",
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
