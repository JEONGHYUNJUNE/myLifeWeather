import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Australia 2027 · 유진 & 현준",
    short_name: "호주여행 2027",
    description: "유진과 현준의 시드니·멜버른 여행 일정, 예산과 준비 체크리스트",
    start_url: "/australia-2027",
    display: "standalone",
    background_color: "#f7f2e8",
    theme_color: "#0b5360",
    orientation: "portrait-primary",
    icons: [
      { src: "/australia-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/australia-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/australia-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/australia-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
