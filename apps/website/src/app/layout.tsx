import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Jersey_20 } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from "@/components/ThemeToggle";

const jersey = Jersey_20({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jersey",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Entropretty - Algorithmic Art for Proof of Personhood",
  description:
    "Create unique visual identities from entropy. Algorithmic art that is beautiful, recognizable, and impossible to forge.",
  metadataBase: new URL("https://entropretty.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jersey.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
