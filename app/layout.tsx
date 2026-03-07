import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/i18n/context";
import CookieBanner from "./components/cookie-banner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recipe Ranch — Where Good Folks Share Good Food",
  description:
    "A Southern-style, community-driven recipe sharing app. Pull up a chair. Supper's almost ready.",
  keywords: ["recipes", "southern cooking", "community", "food sharing", "comfort food"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Lato:wght@300;400;700;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-cream">
        <LanguageProvider>
          {children}
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
