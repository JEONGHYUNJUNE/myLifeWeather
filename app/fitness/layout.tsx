import type { Metadata, Viewport } from "next";
import "./fitness.css";
import { FitnessGuideProvider } from "@/components/fitness/FitnessGuide";
export const metadata: Metadata = {
  manifest: "/fitness/manifest.webmanifest",
  applicationName: "운동의 계절",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "운동의 계절",
  },
  icons: {
    icon: [
      { url: "/fitness-icon.svg", type: "image/svg+xml" },
      { url: "/icons/fitness-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/fitness-apple-touch.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};
export const viewport: Viewport = { themeColor: "#32695d" };

export default function FitnessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FitnessGuideProvider>{children}</FitnessGuideProvider>;
}
