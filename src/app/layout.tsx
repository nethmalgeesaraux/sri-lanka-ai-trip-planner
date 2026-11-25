import type { Metadata } from "next";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";

export const metadata: Metadata = {
  title: "LankaTrails | Sri Lanka AI Trip Planner",
  description:
    "Discover Sri Lanka with personalised Gemini itineraries, an interactive island map, and your own collection of saved journeys.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-zinc-950 antialiased">
        <a className="figma-bypass-link" href="#root">
          Skip to content
        </a>
        <ConvexClientProvider>
          <div id="root" tabIndex={-1}>
            {children}
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
