import type { Metadata } from "next";
import { Poppins, Roboto_Mono } from "next/font/google";

import { CustomCursor } from "@/components/custom-cursor";
import { site } from "@/lib/site";
import "./globals.css";

// Gli stessi font del riferimento: Poppins per titoli e testi, Roboto Mono per il "codice"
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${poppins.variable} ${robotoMono.variable} dark h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
