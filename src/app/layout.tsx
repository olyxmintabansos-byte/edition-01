import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AURA // EDITION 01 — Kinetic Digital Artifact",
  description: "A sovereign, kinetic interactive digital artifact. Volume 01 in the sequential daily craft series.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-[#f59e0b] selection:text-black">
        {children}
      </body>
    </html>
  );
}
