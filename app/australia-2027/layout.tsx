import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "호주여행 2027" },
  icons: {
    icon: [{ url: "/australia-icon.svg", type: "image/svg+xml" }, { url: "/icons/australia-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = { themeColor: "#0b5360" };

export default function AustraliaLayout({ children }: { children: React.ReactNode }) { return children; }
