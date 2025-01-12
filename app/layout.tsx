import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import React from "react";

export const metadata: Metadata = { title: "Messages" };

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" suppressHydrationWarning>
    <body>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
