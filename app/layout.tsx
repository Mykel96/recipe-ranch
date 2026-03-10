import type { Metadata } from "next";
import { Playfair_Display, Lato, Dancing_Script } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/context";
import CookieBanner from "./components/cookie-banner";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-body",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-accent",
  display: "swap",
});

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
    <html lang="en" className={`${playfair.variable} ${lato.variable} ${dancingScript.variable}`}>
      <body className="antialiased min-h-screen bg-cream">
        <LanguageProvider>
          {children}
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
