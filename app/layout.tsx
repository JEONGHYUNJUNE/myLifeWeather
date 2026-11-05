import { DeploymentRefresh } from "@/components/DeploymentRefresh";
import type { Metadata } from "next";
import "@fontsource/gowun-dodum/400.css";
import "./globals.css";
export const metadata: Metadata = {
  title: "Chung-Website",
  description: "호주여행, 운동 기록, Hey Tablo 영어 학습을 한곳에서.",
  applicationName: "Chung-Website",
  icons: { icon: "/chung-icon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        <DeploymentRefresh />
      </body>
    </html>
  );
}
