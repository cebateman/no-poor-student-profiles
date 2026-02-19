import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "No Poor Africa | Our Girls",
  description:
    "Meet the girls in the No Poor Africa program. Every girl has a story, a dream, and a future worth investing in.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
